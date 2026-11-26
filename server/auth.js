const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LOCAL_SECRET_FILE = path.join(__dirname, '..', 'config', '.jwt_secret');

// Initialized cleanly via initSecuritySecret() from env, Cloud Firestore settings/security,
// or local gitignored config/.jwt_secret — zero hardcoded secret strings in source code.
let activeJwtSecret = null;

function ensureLocalSecretFallback() {
  try {
    if (fs.existsSync(LOCAL_SECRET_FILE)) {
      const existing = fs.readFileSync(LOCAL_SECRET_FILE, 'utf8').trim();
      if (existing.length >= 64) return existing;
    }
    const dir = path.dirname(LOCAL_SECRET_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const generated = crypto.randomBytes(48).toString('hex');
    fs.writeFileSync(LOCAL_SECRET_FILE, generated, { encoding: 'utf8', mode: 0o600 });
    return generated;
  } catch (e) {
    // Cloud Functions /tmp or memory fallback when disk is read-only
    return crypto.randomBytes(48).toString('hex');
  }
}

async function initSecuritySecret(firebaseModule) {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 32) {
    activeJwtSecret = process.env.JWT_SECRET.trim();
    return { source: 'env', length: activeJwtSecret.length };
  }

  try {
    if (firebaseModule && firebaseModule.isConnected()) {
      const fsDb = firebaseModule.getFirestore();
      const docRef = fsDb.collection('settings').doc('security');
      const snap = await docRef.get();
      if (snap.exists && snap.data() && snap.data().jwtSecret && snap.data().jwtSecret.length >= 64) {
        activeJwtSecret = snap.data().jwtSecret;
        return { source: 'firestore', length: activeJwtSecret.length };
      }

      // Generate persistent 384-bit CSPRNG secret once and store inside locked Firestore settings/security
      const generated = ensureLocalSecretFallback();
      await docRef.set({
        jwtSecret: generated,
        rotatedAt: new Date().toISOString(),
        algorithm: 'HS256'
      }, { merge: true });
      activeJwtSecret = generated;
      return { source: 'firestore_created', length: activeJwtSecret.length };
    }
  } catch (err) {
    console.warn('⚠️ Security secret Firestore sync warning:', err.message);
  }

  activeJwtSecret = ensureLocalSecretFallback();
  return { source: 'local_file', length: activeJwtSecret.length };
}

function getJwtSecret() {
  if (!activeJwtSecret) {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 32) {
      activeJwtSecret = process.env.JWT_SECRET.trim();
    } else {
      activeJwtSecret = ensureLocalSecretFallback();
    }
  }
  return activeJwtSecret;
}

const BCRYPT_ROUNDS = 12;

function hashPassword(password) {
  return bcrypt.hashSync(password, BCRYPT_ROUNDS);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// Constant-time mitigation dummy hash for non-existent user checks
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKxGhu6p6D1i7nL7V1T6Y9H8bV5oR9Q0b3WFe';

function generateToken(user, sessionId = null, deviceId = null) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'student',
      targetExam: user.targetExam || 'LDCE',
      rollNo: user.rollNo || '',
      tokenVersion: user.tokenVersion || 1,
      sessionId: sessionId || user.activeSessionId || null,
      deviceId: deviceId || user.activeDeviceId || null
    },
    getJwtSecret(),
    {
      algorithm: 'HS256',
      issuer: 'commandobatch-api',
      expiresIn: user.role === 'admin' ? '12h' : '7d'
    }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: 'commandobatch-api'
    });
  } catch (err) {
    return null;
  }
}

// Lazy require db inside middleware to avoid circular load issues
function getDbModule() {
  return require('./db');
}

// Middleware: Authenticated user required (validates JWT + live user + tokenVersion)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.slice(7).trim();
  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }

  const liveUser = getDbModule().findUserById(decoded.id);
  if (!liveUser || liveUser.disabled) {
    return res.status(401).json({ error: 'Account unavailable or disabled' });
  }

  const liveTokenVersion = liveUser.tokenVersion || 1;
  if ((decoded.tokenVersion || 1) !== liveTokenVersion) {
    return res.status(401).json({ error: 'Session revoked after password change. Please log in again.' });
  }

  // Enforce One Device At a Time for candidates: if candidate logged in on another PC/Phone/Tablet,
  // previous device's sessionId no longer matches activeSessionId and is immediately logged out.
  if (liveUser.role !== 'admin' && liveUser.activeSessionId && decoded.sessionId !== liveUser.activeSessionId) {
    return res.status(401).json({
      code: 'SESSION_REPLACED',
      error: `Logged out: Your account is currently active on another device (${liveUser.activeDeviceLabel || 'another PC/Phone/Tablet'}). Only 1 device is allowed at a time.`
    });
  }

  const headerDeviceId = req.headers['x-device-id'];
  if (liveUser.role !== 'admin' && liveUser.activeDeviceId && headerDeviceId && headerDeviceId !== liveUser.activeDeviceId) {
    return res.status(401).json({
      code: 'SESSION_REPLACED',
      error: `Access blocked: Only 1 device (${liveUser.activeDeviceLabel || 'your active device'}) is allowed at a time.`
    });
  }

  // Always bind authoritative live role & identity from DB
  req.user = {
    id: liveUser.id,
    email: liveUser.email,
    name: liveUser.name,
    role: liveUser.role || 'student',
    targetExam: liveUser.targetExam || 'LDCE',
    force: liveUser.force || '',
    rollNo: liveUser.rollNo || '',
    activePackage: liveUser.activePackage || null
  };
  next();
}

// Middleware: Admin required
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin credentials required' });
    }
    next();
  });
}

module.exports = {
  initSecuritySecret,
  isSecretReady: () => !!activeJwtSecret,
  hashPassword,
  comparePassword,
  DUMMY_HASH,
  generateToken,
  verifyToken,
  requireAuth,
  requireAdmin
};
