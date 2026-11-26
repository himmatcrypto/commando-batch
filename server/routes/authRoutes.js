const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db');
const firebase = require('../firebase');
const security = require('../security');
const {
  hashPassword,
  comparePassword,
  DUMMY_HASH,
  generateToken,
  requireAuth
} = require('../auth');

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  const head = local.slice(0, Math.min(2, local.length));
  const tail = local.length > 3 ? local.slice(-1) : '';
  return `${head}***${tail}@${domain}`;
}

function maskPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 4) return null;
  return '******' + digits.slice(-4);
}

function maskRollNo(rollNo) {
  const parts = String(rollNo || '').split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-****-${parts[parts.length - 1]}`;
  }
  return rollNo ? '****' + String(rollNo).slice(-4) : null;
}

// Enforce: (1) Warning when multiple candidate accounts are used from same device,
// and (2) One device at a time (1 PC or Phone/Tablet) per candidate account.
function bindDeviceAndEnforcePolicy(req, user) {
  if (!user || user.role === 'admin') {
    return { sessionId: null, deviceId: null, securityWarning: null, updatedUser: user };
  }

  const rawDeviceId = (req.body && req.body.deviceId) || req.headers['x-device-id'] || '';
  const cleanDeviceId = String(rawDeviceId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) ||
    ('dev_' + crypto.createHash('sha256').update((req.headers['user-agent'] || '') + '|' + (req.ip || '')).digest('hex').slice(0, 16));
  const cleanDeviceLabel = String((req.body && req.body.deviceLabel) || 'Web Device').trim().slice(0, 60);
  const newSessionId = 'sess_' + Date.now() + '_' + crypto.randomBytes(6).toString('hex');

  let securityWarning = null;
  const warnings = Array.isArray(user.securityWarnings) ? [...user.securityWarnings] : [];

  // 1. Check multiple candidate accounts on the same device
  const existingBinding = db.getDeviceBinding(cleanDeviceId);
  if (existingBinding && Array.isArray(existingBinding.userIds)) {
    const otherUsers = existingBinding.userIds.filter(uid => uid !== user.id);
    if (otherUsers.length > 0) {
      securityWarning = {
        type: 'MULTIPLE_ACCOUNTS_WARNING',
        title: '⚠️ Warning: Multiple Accounts Detected',
        message: `Security Warning: Multiple candidate accounts (${otherUsers.length + 1} accounts) have been logged in from this device (${cleanDeviceLabel}). Only your own single registered account should be used.`
      };
      warnings.unshift({
        type: 'MULTIPLE_ACCOUNTS_WARNING',
        deviceLabel: cleanDeviceLabel,
        message: securityWarning.message,
        at: new Date().toISOString()
      });
      if (warnings.length > 10) warnings.length = 10;
      security.logSecurityEvent('MULTIPLE_ACCOUNTS_SAME_DEVICE', req, {
        deviceId: cleanDeviceId,
        deviceLabel: cleanDeviceLabel,
        email: user.email,
        totalAccountsOnDevice: otherUsers.length + 1
      });
    }
  }
  db.upsertDeviceBinding(cleanDeviceId, user.id, user.email, cleanDeviceLabel);

  // 2. Enforce One Device At a Time (replace any active session on another PC/Phone/Tablet)
  if (user.activeSessionId && user.activeDeviceId && user.activeDeviceId !== cleanDeviceId) {
    const prevLabel = user.activeDeviceLabel || 'another device';
    security.logSecurityEvent('SINGLE_DEVICE_SESSION_REPLACED', req, {
      email: user.email,
      previousDevice: prevLabel,
      newDevice: cleanDeviceLabel
    });
    if (!securityWarning) {
      securityWarning = {
        type: 'SINGLE_DEVICE_SWITCH',
        title: '📱 Single-Device Access Active',
        message: `Only 1 device (1 PC or 1 Phone/Tablet) is allowed at a time. Your previous login on "${prevLabel}" has been automatically logged out.`
      };
    }
  }

  const updatedUser = db.updateUser(user.id, {
    activeSessionId: newSessionId,
    activeDeviceId: cleanDeviceId,
    activeDeviceLabel: cleanDeviceLabel,
    activeDeviceUpdatedAt: new Date().toISOString(),
    securityWarnings: warnings
  }) || user;

  return { sessionId: newSessionId, deviceId: cleanDeviceId, securityWarning, updatedUser };
}

// Register a new student (with duplicate email/phone detection prompting previous login & reset)
router.post('/register', security.authRegisterLimiter, (req, res) => {
  try {
    const { name, email, password, targetExam, force, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone || '').replace(/[^\d+\-\s]/g, '').trim().slice(0, 18);
    const phoneDigits = cleanPhone.replace(/\D/g, '').slice(-10);

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({ error: 'Name must be between 2 and 80 characters' });
    }

    if (!security.isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const existingByEmail = db.findUserByEmail(cleanEmail);
    const existingByPhone = (!existingByEmail && phoneDigits.length === 10)
      ? (db.getDb().users || []).find(u => {
          const uDigits = String(u.phone || '').replace(/\D/g, '').slice(-10);
          return uDigits.length === 10 && uDigits === phoneDigits;
        })
      : null;

    const existing = existingByEmail || existingByPhone;
    if (existing) {
      const mEmail = maskEmail(existing.email);
      const matchedByEmail = !!existingByEmail;
      return res.status(409).json({
        error: `An account already exists with your previous login (${matchedByEmail ? existing.email : mEmail}). Please log in or reset your password.`,
        alreadyRegistered: true,
        existingAccount: {
          email: matchedByEmail ? existing.email : null,
          maskedEmail: mEmail,
          rollNo: existing.rollNo || null,
          authProvider: existing.authProvider || 'password'
        }
      });
    }

    const pwError = security.validatePasswordStrength(password, false);
    if (pwError) {
      return res.status(400).json({ error: pwError });
    }

    const cleanTargetExam = String(targetExam || 'LDCE').trim().slice(0, 40);
    const cleanForce = String(force || 'Paramilitary Forces').trim().slice(0, 60);

    const rollRandom = Math.floor(1000 + Math.random() * 9000);
    const prefix = cleanTargetExam.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'CB';
    const rollNo = `${prefix}-${new Date().getFullYear()}-${rollRandom}`;

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: cleanName,
      email: cleanEmail,
      password: hashPassword(password),
      role: 'student',
      authProvider: 'password',
      tokenVersion: 1,
      disabled: false,
      targetExam: cleanTargetExam,
      force: cleanForce,
      phone: cleanPhone,
      rollNo,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const policy = bindDeviceAndEnforcePolicy(req, newUser);
    const token = generateToken(policy.updatedUser, policy.sessionId, policy.deviceId);
    security.logSecurityEvent('USER_REGISTERED', req, { email: cleanEmail, role: 'student' });

    res.status(201).json({
      message: 'Registration successful! Welcome to Commando Batch.',
      token,
      securityWarning: policy.securityWarning,
      user: {
        id: policy.updatedUser.id,
        name: policy.updatedUser.name,
        email: policy.updatedUser.email,
        role: policy.updatedUser.role,
        targetExam: policy.updatedUser.targetExam,
        force: policy.updatedUser.force,
        rollNo: policy.updatedUser.rollNo,
        activePackage: null,
        activeDeviceLabel: policy.updatedUser.activeDeviceLabel || null
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login (Student or Admin) with IP rate limiting, account lockout & timing-safe check
router.post('/login', security.authLoginLimiter, (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const lockState = security.checkAccountLock(cleanEmail);
    if (lockState.locked) {
      security.logSecurityEvent('LOGIN_BLOCKED_LOCKOUT', req, { email: cleanEmail });
      return res.status(429).json({ error: lockState.message });
    }

    const user = db.findUserByEmail(cleanEmail);
    if (!user) {
      // Dummy bcrypt comparison to eliminate user-enumeration timing leaks
      comparePassword(password, DUMMY_HASH);
      security.recordFailedLogin(cleanEmail);
      security.logSecurityEvent('LOGIN_FAIL_UNKNOWN_EMAIL', req, { email: cleanEmail });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.disabled) {
      security.logSecurityEvent('LOGIN_DISABLED_ACCOUNT', req, { email: cleanEmail });
      return res.status(403).json({ error: 'This account has been suspended. Contact HQ Admin.' });
    }

    const match = comparePassword(password, user.password);
    if (!match) {
      const failState = security.recordFailedLogin(cleanEmail);
      security.logSecurityEvent('LOGIN_FAIL_BAD_PASSWORD', req, {
        email: cleanEmail,
        role: user.role,
        attempts: failState.count
      });
      if (failState.lockedUntil) {
        return res.status(429).json({
          error: 'Too many failed login attempts. Account locked for 15 minutes.'
        });
      }
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Role-restriction check: If logging in through Admin Portal, strictly verify user has 'admin' role
    if (requiredRole === 'admin' && user.role !== 'admin') {
      security.logSecurityEvent('ADMIN_PORTAL_DENIED', req, { email: cleanEmail });
      return res.status(403).json({
        error: 'ACCESS DENIED: This portal is strictly restricted to HQ Administrators. Regular candidates must use Candidate Login.'
      });
    }

    security.clearFailedLogins(cleanEmail);
    const policy = bindDeviceAndEnforcePolicy(req, user);
    const token = generateToken(policy.updatedUser, policy.sessionId, policy.deviceId);

    if (user.role === 'admin') {
      security.logSecurityEvent('ADMIN_LOGIN_SUCCESS', req, { email: cleanEmail, userId: user.id });
    }

    res.json({
      message: 'Login successful',
      token,
      securityWarning: policy.securityWarning,
      user: {
        id: policy.updatedUser.id,
        name: policy.updatedUser.name,
        email: policy.updatedUser.email,
        role: policy.updatedUser.role,
        targetExam: policy.updatedUser.targetExam,
        force: policy.updatedUser.force,
        rollNo: policy.updatedUser.rollNo,
        activePackage: policy.updatedUser.activePackage || null,
        activeDeviceLabel: policy.updatedUser.activeDeviceLabel || null
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Candidate Forgot Password Step 1: Lookup candidate account & return masked verification hints
router.post('/forgot-password', security.authLoginLimiter, (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !security.isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid registered email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'No candidate account found with this email address.' });
    }
    if (user.role === 'admin') {
      security.logSecurityEvent('ADMIN_SELF_RESET_BLOCKED', req, { email: cleanEmail });
      return res.status(403).json({ error: 'Admin passwords cannot be reset through candidate self-service.' });
    }

    res.json({
      message: 'Account located. Verify your Roll Number or registered Phone Number to set a new password.',
      hints: {
        email: cleanEmail,
        maskedPhone: maskPhone(user.phone),
        rollNoHint: maskRollNo(user.rollNo),
        authProvider: user.authProvider || 'password'
      }
    });
  } catch (err) {
    console.error('Forgot password lookup error:', err);
    res.status(500).json({ error: 'Unable to process password reset request' });
  }
});

// Candidate Forgot Password Step 2: Verify Roll No or Phone & set new password
router.post('/reset-password', security.authLoginLimiter, (req, res) => {
  try {
    const { email, verificationValue, newPassword } = req.body;
    if (!email || !verificationValue || !newPassword) {
      return res.status(400).json({ error: 'Email, Roll No / Phone verification, and new password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const lockState = security.checkAccountLock(cleanEmail);
    if (lockState.locked) {
      return res.status(429).json({ error: lockState.message });
    }

    const user = db.findUserByEmail(cleanEmail);
    if (!user || user.role === 'admin') {
      security.recordFailedLogin(cleanEmail);
      return res.status(400).json({ error: 'Invalid candidate account or verification details' });
    }

    const pwError = security.validatePasswordStrength(newPassword, false);
    if (pwError) {
      return res.status(400).json({ error: pwError });
    }

    const supplied = String(verificationValue).trim();
    const rollMatch = user.rollNo && supplied.toUpperCase() === String(user.rollNo).trim().toUpperCase();
    const suppliedDigits = supplied.replace(/\D/g, '');
    const userPhoneDigits = String(user.phone || '').replace(/\D/g, '');
    const phoneMatch = userPhoneDigits.length >= 10 && suppliedDigits.length >= 4 &&
      (suppliedDigits === userPhoneDigits || suppliedDigits.slice(-10) === userPhoneDigits.slice(-10) ||
       (suppliedDigits.length === 4 && suppliedDigits === userPhoneDigits.slice(-4)));

    if (!rollMatch && !phoneMatch) {
      const failState = security.recordFailedLogin(cleanEmail);
      security.logSecurityEvent('PASSWORD_RESET_VERIFY_FAIL', req, { email: cleanEmail, attempts: failState.count });
      return res.status(401).json({ error: 'Verification failed: Roll Number or Phone Number does not match our records.' });
    }

    security.clearFailedLogins(cleanEmail);
    const newVersion = (user.tokenVersion || 1) + 1;
    db.updateUser(user.id, {
      password: hashPassword(newPassword),
      tokenVersion: newVersion,
      passwordChangedAt: new Date().toISOString()
    });

    security.logSecurityEvent('CANDIDATE_PASSWORD_RESET', req, { email: cleanEmail, userId: user.id });
    res.json({
      message: 'Password reset successful! You can now log in with your new password.',
      email: cleanEmail
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Candidate Google Sign-In / Sign-Up (Verifies Firebase ID Token server-side)
router.post('/google', security.authLoginLimiter, async (req, res) => {
  try {
    const { idToken, targetExam, force } = req.body;
    if (!idToken || typeof idToken !== 'string') {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    const fbAuth = firebase.getAuth();
    if (!fbAuth) {
      return res.status(503).json({ error: 'Google Authentication service is currently unavailable' });
    }

    const decoded = await fbAuth.verifyIdToken(idToken);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: 'Invalid Google account token' });
    }

    const cleanEmail = decoded.email.trim().toLowerCase();
    let user = db.findUserByEmail(cleanEmail);
    let isNewUser = false;

    if (user) {
      if (user.role === 'admin') {
        security.logSecurityEvent('GOOGLE_ADMIN_LOGIN_BLOCKED', req, { email: cleanEmail });
        return res.status(403).json({ error: 'HQ Admin accounts must sign in using Admin HQ Login.' });
      }
      if (user.disabled) {
        return res.status(403).json({ error: 'This account has been suspended. Contact HQ Admin.' });
      }
      if (!user.googleUid) {
        user = db.updateUser(user.id, { googleUid: decoded.uid });
      }
    } else {
      isNewUser = true;
      const cleanName = (decoded.name || cleanEmail.split('@')[0]).trim().slice(0, 80);
      const cleanTargetExam = String(targetExam || 'CAPF').trim().slice(0, 40);
      const cleanForce = String(force || 'Paramilitary Forces').trim().slice(0, 60);
      const rollRandom = Math.floor(1000 + Math.random() * 9000);
      const rollNo = `GGL-${new Date().getFullYear()}-${rollRandom}`;

      const randomInternalPw = crypto.randomBytes(24).toString('base64url') + '!9G';
      user = db.createUser({
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        name: cleanName,
        email: cleanEmail,
        password: hashPassword(randomInternalPw),
        role: 'student',
        authProvider: 'google',
        googleUid: decoded.uid,
        tokenVersion: 1,
        disabled: false,
        targetExam: cleanTargetExam,
        force: cleanForce,
        phone: '',
        rollNo,
        createdAt: new Date().toISOString()
      });
      security.logSecurityEvent('GOOGLE_USER_REGISTERED', req, { email: cleanEmail, userId: user.id });
    }

    const policy = bindDeviceAndEnforcePolicy(req, user);
    const token = generateToken(policy.updatedUser, policy.sessionId, policy.deviceId);
    res.json({
      message: isNewUser ? `Google Sign-Up successful! Assigned Roll: ${user.rollNo}` : `Welcome back, ${user.name}!`,
      token,
      isNewUser,
      securityWarning: policy.securityWarning,
      user: {
        id: policy.updatedUser.id,
        name: policy.updatedUser.name,
        email: policy.updatedUser.email,
        role: policy.updatedUser.role,
        targetExam: policy.updatedUser.targetExam,
        force: policy.updatedUser.force,
        rollNo: policy.updatedUser.rollNo,
        activePackage: policy.updatedUser.activePackage || null,
        activeDeviceLabel: policy.updatedUser.activeDeviceLabel || null
      }
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Google Sign-In verification failed. Please try again.' });
  }
});

// Logout: clears activeSessionId so candidate can switch cleanly to another device
router.post('/logout', requireAuth, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      db.updateUser(req.user.id, {
        activeSessionId: null,
        activeDeviceId: null,
        activeDeviceLabel: null
      });
    }
    res.json({ message: 'Logged out cleanly. You can now sign in from any PC, Phone, or Tablet.' });
  } catch (err) {
    res.status(500).json({ error: 'Logout error' });
  }
});

// Change own password (rotates tokenVersion to revoke all previously issued tokens)
router.post('/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!comparePassword(currentPassword, user.password)) {
      security.logSecurityEvent('PASSWORD_CHANGE_FAIL', req, { userId: user.id });
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const pwError = security.validatePasswordStrength(newPassword, user.role === 'admin');
    if (pwError) {
      return res.status(400).json({ error: pwError });
    }

    const newVersion = (user.tokenVersion || 1) + 1;
    const updatedUser = db.updateUser(user.id, {
      password: hashPassword(newPassword),
      tokenVersion: newVersion,
      passwordChangedAt: new Date().toISOString()
    });

    security.logSecurityEvent('PASSWORD_ROTATED', req, { userId: user.id, email: user.email });
    const token = generateToken(updatedUser);

    res.json({
      message: 'Password changed successfully. All prior sessions have been revoked.',
      token
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Current user profile
router.get('/me', requireAuth, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const attempts = db.getAttemptsByUser(user.id);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetExam: user.targetExam,
      force: user.force,
      rollNo: user.rollNo,
      activePackage: user.activePackage || null,
      createdAt: user.createdAt
    },
    stats: {
      totalAttempts: attempts.length,
      bestScore: attempts.reduce((max, a) => Math.max(max, a.score), 0),
      averageScore: attempts.length ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0
    }
  });
});

// Subscribe to Mock Test Package — blocked when Cashfree is active so passes require verified payment
router.post('/subscribe-package', requireAuth, async (req, res) => {
  try {
    const { getCashfreeConfig } = require('./paymentRoutes');
    const cfCfg = await getCashfreeConfig();
    if (cfCfg || process.env.ALLOW_DEMO_CHECKOUT !== 'true') {
      return res.status(403).json({
        error: 'Direct unpaid activation is disabled. Please complete payment securely via Cashfree Checkout.',
        useCashfree: true
      });
    }

    const { packageId, targetForce, durationMonths } = req.body;
    const allowedForces = new Set(['CRPF', 'CISF', 'BSF', 'ITBP', 'SSB', 'ASSAM RIFLES', 'ALL']);
    const rawForce = (targetForce && typeof targetForce === 'string') ? targetForce.trim() : 'CRPF';
    const forceUpper = rawForce.toUpperCase();
    if (!allowedForces.has(forceUpper)) {
      return res.status(400).json({ error: 'Invalid target force specified for pass.' });
    }

    const forceName = forceUpper === 'ASSAM RIFLES' ? 'Assam Rifles' : (forceUpper === 'ALL' ? 'ALL' : forceUpper);
    const isAllForces = forceName === 'ALL';
    const is6Months = packageId === 'pkg_199_6m' || packageId === 'pkg_all_6m' || Number(durationMonths) === 6;

    let pkgDetails = null;
    if (is6Months) {
      const price = isAllForces ? 550 : 199;
      const testsCount = isAllForces ? 60 : 10;
      const name = isAllForces
        ? 'Commando All-Force Pro Pass (All 60 Full-Length Mocks - 6 Months)'
        : `Commando Pro Pass (${forceName} Special - 10 Full-Length Tests - 6 Months)`;

      pkgDetails = {
        id: isAllForces ? 'pkg_all_6m' : 'pkg_199_6m',
        name,
        targetForce: isAllForces ? 'ALL' : forceName,
        price,
        testsCount,
        testsRemaining: testsCount,
        durationMonths: 6,
        subscribedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        transactionId: 'TXN-CB-' + Math.floor(100000 + Math.random() * 900000)
      };
    } else {
      const price = isAllForces ? 300 : 100;
      const testsCount = isAllForces ? 60 : 10;
      const name = isAllForces
        ? 'Tactical All-Force Pass (All 60 Full-Length Mocks - 2 Months)'
        : `Tactical Pass (${forceName} Special - 10 Full-Length Tests - 2 Months)`;

      pkgDetails = {
        id: isAllForces ? 'pkg_all_2m' : 'pkg_100_2m',
        name,
        targetForce: isAllForces ? 'ALL' : forceName,
        price,
        testsCount,
        testsRemaining: testsCount,
        durationMonths: 2,
        subscribedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        transactionId: 'TXN-CB-' + Math.floor(100000 + Math.random() * 900000)
      };
    }

    const updatedUser = db.updateUser(req.user.id, { activePackage: pkgDetails });

    res.json({
      message: `Congratulations! ${pkgDetails.name} activated successfully on your account.`,
      package: pkgDetails,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        targetExam: updatedUser.targetExam,
        force: updatedUser.force,
        rollNo: updatedUser.rollNo,
        activePackage: updatedUser.activePackage
      }
    });
  } catch (err) {
    console.error('Package subscription error:', err);
    res.status(500).json({ error: 'Failed to activate mock test package' });
  }
});

module.exports = router;
