const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { getSeedData } = require('./seedData');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const adminRoutes = require('./routes/adminRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Seed database on startup if empty
function initializeSeedData() {
  const currentDb = db.getDb();
  let modified = false;

  if (!currentDb.tests || currentDb.tests.length === 0) {
    const { defaultUsers, defaultTests } = getSeedData();
    currentDb.users = defaultUsers;
    currentDb.tests = defaultTests;
    currentDb.attempts = currentDb.attempts || [];
    modified = true;
    console.log('Seeded database with authentic CRPF, CISF, CAPF, SI, SSC, and Bank mock tests.');
  }

  // Ensure default admin exists
  if (!currentDb.users.find(u => u.role === 'admin')) {
    const { defaultUsers } = getSeedData();
    currentDb.users.push(defaultUsers[0]);
    modified = true;
  }

  if (modified) {
    db.saveDb();
  }
}

initializeSeedData();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enquiries', enquiryRoutes);

// System health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'Commando Batch Exam Engine',
    version: '2.0.0',
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

// Start server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` COMMANDO BATCH - DEFENSE & COMPETITIVE EXAM PLATFORM`);
  console.log(` Target Exams: SSC | Bank | CAPF | SI | LDCE (CRPF / CISF)`);
  console.log(` Server running live at: http://localhost:${PORT}`);
  console.log(` Demo Admin: admin@commandobatch.gov.in / admin123`);
  console.log(` Demo Student: commando@student.in / student123`);
  console.log(`================================================================`);
});
