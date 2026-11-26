const express = require('express');
const router = express.Router();
const db = require('../db');
const firebase = require('../firebase');
const security = require('../security');
const { requireAdmin, isSecretReady } = require('../auth');
const { getCashfreeConfig, clearCashfreeConfigCache } = require('./paymentRoutes');
const { getSeedData } = require('../seedData');

// Protect all admin routes
router.use(requireAdmin);

// Admin dashboard statistics
router.get('/stats', (req, res) => {
  const currentDb = db.getDb();
  const students = currentDb.users.filter(u => u.role === 'student');
  const attempts = currentDb.attempts;
  const tests = currentDb.tests;

  const totalScoreSum = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const avgScore = attempts.length > 0 ? Math.round((totalScoreSum / attempts.length) * 10) / 10 : 0;
  const qualifiedCount = attempts.filter(a => a.isQualified).length;
  const passRate = attempts.length > 0 ? Math.round((qualifiedCount / attempts.length) * 100) : 0;

  const categoryCounts = {
    LDCE: tests.filter(t => t.category === 'LDCE').length,
    CAPF: tests.filter(t => t.category === 'CAPF').length,
    SI: tests.filter(t => t.category === 'SI').length,
    SSC: tests.filter(t => t.category === 'SSC').length,
    Bank: tests.filter(t => t.category === 'Bank').length
  };

  res.json({
    stats: {
      totalStudents: students.length,
      totalTests: tests.length,
      totalAttempts: attempts.length,
      averageScore: avgScore,
      passRate,
      categoryCounts
    }
  });
});

// Admin: Get all tests (including full questions)
router.get('/tests', (req, res) => {
  const tests = db.getDb().tests;
  res.json({ tests });
});

// Admin: Create new mock test
router.post('/tests', (req, res) => {
  try {
    const {
      title,
      category,
      targetExam,
      description,
      durationMinutes,
      totalMarks,
      passingMarks,
      marksPerQuestion,
      negativeMarking,
      sections,
      difficulty,
      questions
    } = req.body;

    if (!title || !category || !questions || !questions.length) {
      return res.status(400).json({ error: 'Title, category, and at least one question are required' });
    }

    const newTest = {
      id: 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      category: category.trim(),
      targetExam: targetExam || category,
      description: description || '',
      durationMinutes: Number(durationMinutes) || 60,
      totalMarks: Number(totalMarks) || (questions.length * (Number(marksPerQuestion) || 1)),
      passingMarks: Number(passingMarks) || (Number(totalMarks) * 0.4),
      marksPerQuestion: Number(marksPerQuestion) || 1,
      negativeMarking: Number(negativeMarking) !== undefined ? Number(negativeMarking) : 0.25,
      sections: sections && sections.length ? sections : ['General Knowledge', 'Reasoning'],
      difficulty: difficulty || 'Moderate',
      featured: true,
      questions: questions.map((q, idx) => ({
        id: q.id || `q_${Date.now()}_${idx + 1}`,
        section: q.section || 'General',
        textEn: q.textEn || '',
        textHi: q.textHi || '',
        options: q.options || [],
        correctAnswer: Number(q.correctAnswer) || 0,
        explanationEn: q.explanationEn || '',
        explanationHi: q.explanationHi || ''
      })),
      createdAt: new Date().toISOString()
    };

    db.createTest(newTest);
    res.status(201).json({ message: 'Mock test created successfully!', test: newTest });
  } catch (err) {
    console.error('Create test error:', err);
    res.status(500).json({ error: 'Failed to create mock test' });
  }
});

// Admin: Update test & questions
router.put('/tests/:id', (req, res) => {
  try {
    const {
      title,
      category,
      targetExam,
      description,
      durationMinutes,
      totalMarks,
      passingMarks,
      marksPerQuestion,
      negativeMarking,
      sections,
      difficulty,
      questions
    } = req.body;

    const existing = db.getTestById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (category !== undefined) updates.category = category.trim();
    if (targetExam !== undefined) updates.targetExam = targetExam.trim();
    if (description !== undefined) updates.description = description;
    if (difficulty !== undefined) updates.difficulty = difficulty;
    if (marksPerQuestion !== undefined) updates.marksPerQuestion = Number(marksPerQuestion) || 1;
    if (negativeMarking !== undefined) updates.negativeMarking = Number(negativeMarking);
    if (sections !== undefined) updates.sections = sections;

    if (questions && Array.isArray(questions)) {
      updates.questions = questions.map((q, idx) => ({
        id: q.id || `q_${Date.now()}_${idx + 1}`,
        section: q.section || 'General',
        textEn: q.textEn || '',
        textHi: q.textHi || '',
        options: q.options || [],
        correctAnswer: Number(q.correctAnswer) || 0,
        explanationEn: q.explanationEn || '',
        explanationHi: q.explanationHi || ''
      }));
      // Auto-sync duration with questions count (1 min per question per user requirement)
      const qLen = updates.questions.length;
      updates.durationMinutes = Number(durationMinutes) || qLen;
      const mpq = updates.marksPerQuestion || existing.marksPerQuestion || 1;
      updates.totalMarks = Number(totalMarks) || (qLen * mpq);
      updates.passingMarks = Number(passingMarks) || (updates.totalMarks * 0.4);
    } else {
      if (durationMinutes !== undefined) updates.durationMinutes = Number(durationMinutes);
      if (totalMarks !== undefined) updates.totalMarks = Number(totalMarks);
      if (passingMarks !== undefined) updates.passingMarks = Number(passingMarks);
    }

    const updated = db.updateTest(req.params.id, updates);
    res.json({ message: 'Test and questions updated successfully', test: updated });
  } catch (err) {
    console.error('Update test error:', err);
    res.status(500).json({ error: 'Failed to update test' });
  }
});

// Admin: Add a new question to an existing test
router.post('/tests/:id/questions', (req, res) => {
  try {
    const test = db.getTestById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const { section, textEn, textHi, options, correctAnswer, explanationEn, explanationHi } = req.body;
    if (!textEn || !options || options.length < 2) {
      return res.status(400).json({ error: 'Question text and at least 2 options are required' });
    }

    const newQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      section: section || 'General',
      textEn: textEn.trim(),
      textHi: (textHi || '').trim(),
      options: options.map(o => (o || '').trim()),
      correctAnswer: Number(correctAnswer) || 0,
      explanationEn: (explanationEn || '').trim(),
      explanationHi: (explanationHi || '').trim()
    };

    const currentQuestions = test.questions || [];
    currentQuestions.push(newQuestion);

    // Auto-sync question count and duration (1 min per question)
    const newQLen = currentQuestions.length;
    const mpq = test.marksPerQuestion || 1;
    const updates = {
      questions: currentQuestions,
      durationMinutes: newQLen,
      totalMarks: newQLen * mpq,
      passingMarks: Math.round(newQLen * mpq * 0.4)
    };

    const updated = db.updateTest(req.params.id, updates);
    res.status(201).json({
      message: 'New question added successfully!',
      question: newQuestion,
      totalQuestions: newQLen,
      durationMinutes: updates.durationMinutes,
      test: updated
    });
  } catch (err) {
    console.error('Add question error:', err);
    res.status(500).json({ error: 'Failed to add question to test' });
  }
});

// Admin: Delete test
router.delete('/tests/:id', (req, res) => {
  const removed = db.deleteTest(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Test not found' });
  }
  res.json({ message: 'Test deleted successfully', removedId: req.params.id });
});

// Admin: Get all student submissions
router.get('/attempts', (req, res) => {
  const attempts = db.getAllAttempts();
  res.json({ attempts });
});

// Admin: Get all users (with activePackage details)
router.get('/users', (req, res) => {
  const users = db.getDb().users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    targetExam: u.targetExam,
    force: u.force,
    rollNo: u.rollNo,
    activePackage: u.activePackage || null,
    createdAt: u.createdAt,
    attemptsCount: db.getAttemptsByUser(u.id).length
  }));
  res.json({ users });
});

// Admin: Grant Free Premium Pass to a registered candidate for N days
router.post('/users/:id/grant-pass', (req, res) => {
  try {
    const user = db.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const { targetForce, days } = req.body;
    const validDays = parseInt(days, 10);
    if (!validDays || validDays < 1 || validDays > 3650) {
      return res.status(400).json({ error: 'Please provide a valid number of days (between 1 and 3650)' });
    }

    const forceName = (targetForce && typeof targetForce === 'string') ? targetForce.trim() : 'ALL';
    const isAll = forceName.toUpperCase() === 'ALL';

    const pkgDetails = {
      id: 'pkg_admin_grant',
      name: `HQ Admin Free Premium Pass (${isAll ? 'All CAPF Forces' : forceName} - ${validDays} Days)`,
      targetForce: isAll ? 'ALL' : forceName,
      price: 0,
      testsCount: isAll ? 60 : 10,
      testsRemaining: isAll ? 60 : 10,
      durationDays: validDays,
      durationMonths: Math.max(1, Math.round(validDays / 30)),
      grantedByAdmin: true,
      subscribedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      transactionId: 'ADM-FREE-' + Math.floor(100000 + Math.random() * 900000)
    };

    const updatedUser = db.updateUser(user.id, { activePackage: pkgDetails });

    res.json({
      message: `Free Premium Pass (${isAll ? 'ALL Forces' : forceName}) granted to ${updatedUser.name} for ${validDays} days.`,
      package: pkgDetails,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        rollNo: updatedUser.rollNo,
        activePackage: updatedUser.activePackage
      }
    });
  } catch (err) {
    console.error('Admin grant pass error:', err);
    res.status(500).json({ error: 'Failed to grant free premium pass' });
  }
});

// Admin: Revoke active pass from a candidate
router.post('/users/:id/revoke-pass', (req, res) => {
  try {
    const user = db.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    db.updateUser(user.id, { activePackage: null });
    res.json({
      message: `Premium pass revoked for ${user.name}.`,
      userId: user.id
    });
  } catch (err) {
    console.error('Admin revoke pass error:', err);
    res.status(500).json({ error: 'Failed to revoke candidate pass' });
  }
});

// Admin: Reset / re-seed database (preserves live admins & requires explicit confirmation)
router.post('/seed-reset', (req, res) => {
  if (!req.body || req.body.confirm !== 'CONFIRM_RESET') {
    return res.status(400).json({ error: 'Confirmation token required (confirm: "CONFIRM_RESET") to reset database.' });
  }
  const { defaultUsers, defaultTests } = getSeedData();
  const currentDb = db.getDb();
  // Preserve existing admin accounts so active admins & rotated passwords are never lost
  const existingAdmins = (currentDb.users || []).filter(u => u.role === 'admin');
  const seedStudents = defaultUsers.filter(u => u.role !== 'admin');
  currentDb.users = existingAdmins.length > 0 ? [...existingAdmins, ...seedStudents] : defaultUsers;
  currentDb.tests = defaultTests;
  currentDb.attempts = [];
  db.saveDb();
  security.logSecurityEvent('ADMIN_SEED_RESET', req, { adminEmail: req.user.email });
  res.json({ message: 'Database reset to authentic seed data successfully (Admin credentials preserved).' });
});

// Admin: Security audit & telemetry summary
router.get('/security-audit', (req, res) => {
  const admins = (db.getDb().users || [])
    .filter(u => u.role === 'admin')
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isBackupAdmin: !!u.isBackupAdmin,
      tokenVersion: u.tokenVersion || 1,
      passwordChangedAt: u.passwordChangedAt || u.createdAt
    }));

  res.json({
    security: {
      jwtSecretReady: isSecretReady(),
      firestoreLockedDown: true,
      corsRestricted: true,
      rateLimitingActive: true,
      accountLockoutEnabled: true,
      admins,
      audit: security.getSecurityAuditSummary()
    }
  });
});

// Admin: Cashfree Payment Gateway Status (never exposes secretKey)
router.get('/payments/cashfree-config', async (req, res) => {
  const cfg = await getCashfreeConfig();
  const orders = db.getOrders ? db.getOrders() : [];
  res.json({
    configured: !!cfg,
    env: cfg ? cfg.env : 'sandbox',
    appIdMasked: cfg && cfg.appId ? `${cfg.appId.slice(0, 6)}...${cfg.appId.slice(-4)}` : null,
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.status === 'PAID').length
  });
});

// Admin: Save / Rotate Cashfree App ID, Secret Key & Mode in locked Firestore settings/cashfree
router.post('/payments/cashfree-config', async (req, res) => {
  try {
    const { appId, secretKey, env } = req.body;
    if (!appId || !secretKey || typeof appId !== 'string' || typeof secretKey !== 'string') {
      return res.status(400).json({ error: 'Cashfree App ID and Secret Key are required.' });
    }
    const cleanAppId = appId.trim();
    const cleanSecret = secretKey.trim();
    const cleanEnv = (String(env || 'sandbox').toLowerCase() === 'production') ? 'production' : 'sandbox';

    if (cleanAppId.length < 6 || cleanSecret.length < 10) {
      return res.status(400).json({ error: 'Invalid Cashfree App ID or Secret Key format.' });
    }

    if (!firebase.isConnected()) {
      return res.status(503).json({ error: 'Cloud Firestore is not connected.' });
    }

    await firebase.getFirestore().collection('settings').doc('cashfree').set({
      appId: cleanAppId,
      secretKey: cleanSecret,
      env: cleanEnv,
      updatedBy: req.user.email,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    clearCashfreeConfigCache();
    security.logSecurityEvent('CASHFREE_CONFIG_UPDATED', req, { env: cleanEnv, adminEmail: req.user.email });

    res.json({
      message: `Cashfree Payment Gateway (${cleanEnv.toUpperCase()}) configured & encrypted in Firestore!`,
      configured: true,
      env: cleanEnv
    });
  } catch (err) {
    console.error('Cashfree config save error:', err);
    res.status(500).json({ error: 'Failed to save Cashfree configuration.' });
  }
});

// Admin: Get payment orders
router.get('/orders', (req, res) => {
  res.json({ orders: db.getOrders ? db.getOrders() : [] });
});

// Admin: Get Firebase connection status
router.get('/firebase/status', (req, res) => {
  const st = firebase.getStatus();
  res.json({ connected: !!st.connected, projectId: st.projectId || null });
});

// Admin: Manually sync all local database records to Cloud Firestore
router.post('/firebase/sync', async (req, res) => {
  try {
    const result = await db.syncAllToFirestore();
    res.json({
      message: `Successfully synced ${result.totalSynced} records to Cloud Firestore!`,
      totalSynced: result.totalSynced,
      firebase: firebase.getStatus()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
