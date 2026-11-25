const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const auth = require('./auth');
const firebase = require('./firebase');
const security = require('./security');
const { getSeedData } = require('./seedData');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const adminRoutes = require('./routes/adminRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security hardening: hide framework fingerprint & trust Cloud Run / Firebase reverse proxy
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Core Security Middleware (Headers, Origin-restricted CORS, Payload & Prototype-Pollution guards)
app.use(security.securityHeaders);
app.use(cors(security.corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(security.sanitizeBodyMiddleware);
app.use('/api', security.apiGeneralLimiter);

// Serve static frontend assets with no-cache headers so updates reflect immediately
app.use(express.static(path.join(__dirname, '..', 'public'), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Seed database on startup if empty (never uses weak hardcoded passwords)
function initializeSeedData() {
  const currentDb = db.getDb();
  let modified = false;

  if (!currentDb.tests || currentDb.tests.length === 0) {
    const { defaultUsers, defaultTests } = getSeedData();
    currentDb.users = defaultUsers;
    currentDb.tests = defaultTests;
    currentDb.attempts = currentDb.attempts || [];
    modified = true;
    console.log('Seeded database with CAPF, SI, and LDCE mock tests.');
  }

  if (!currentDb.users.find(u => u.role === 'admin')) {
    const { defaultUsers } = getSeedData();
    const seededAdmins = defaultUsers.filter(u => u.role === 'admin');
    currentDb.users.push(...seededAdmins);
    modified = true;
  }

  if (modified) {
    db.saveDb();
  }
}

initializeSeedData();

// Unified async bootstrap (waits cleanly on Cloud Function cold starts so Firestore data
// and cryptographic JWT signing key are ready before serving any /api request)
let bootstrapPromise = null;
function ensureBootstrapped() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        await db.initFirebaseSync();
      } catch (err) {
        console.warn('Firebase sync init:', err.message);
      }
      try {
        await auth.initSecuritySecret(firebase);
      } catch (err) {
        console.warn('Security secret init:', err.message);
      }
    })();
  }
  return bootstrapPromise;
}

// Trigger immediately on boot and await on any incoming API request
ensureBootstrapped();
app.use('/api', async (req, res, next) => {
  await ensureBootstrapped();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enquiries', enquiryRoutes);

// System health check (redacted minimal public status)
app.get('/api/health', (req, res) => {
  const fbStatus = firebase.getStatus();
  res.json({
    status: 'online',
    portal: 'Commando Batch Exam Engine',
    version: '2.1.0',
    firebase: {
      connected: !!fbStatus.connected
    },
    security: {
      secretReady: auth.isSecretReady(),
      headersEnforced: true
    },
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback: Route all non-API GET requests to index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
  next();
});

// Global error handler — never leak internal stack traces to clients
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ error: 'Cross-origin request blocked by security policy.' });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON request payload.' });
  }
  console.error('Unhandled API Error:', err && err.message ? err.message : err);
  res.status(500).json({ error: 'Internal security/server error.' });
});

// Start server only when run directly (not when imported by Firebase Cloud Functions)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` COMMANDO BATCH - SECURED DEFENSE & COMPETITIVE EXAM PLATFORM`);
    console.log(` Server running at: http://localhost:${PORT}`);
    console.log(` Security: Headers, CORS Allowlist, Rate Limiting & JWT Lock Enabled`);
    console.log(`================================================================`);
  });
}

module.exports = app;
