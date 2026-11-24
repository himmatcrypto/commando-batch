const express = require('express');
const router = express.Router();
const db = require('../db');
const { hashPassword, comparePassword, generateToken, requireAuth } = require('../auth');

// Register a new student
router.post('/register', (req, res) => {
  try {
    const { name, email, password, targetExam, force, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const rollRandom = Math.floor(1000 + Math.random() * 9000);
    const prefix = targetExam ? targetExam.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) : 'CB';
    const rollNo = `${prefix}-${new Date().getFullYear()}-${rollRandom}`;

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword(password),
      role: 'student',
      targetExam: targetExam || 'LDCE',
      force: force || 'Paramilitary Forces',
      phone: phone || '',
      rollNo,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Registration successful! Welcome to Commando Batch.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        targetExam: newUser.targetExam,
        force: newUser.force,
        rollNo: newUser.rollNo,
        activePackage: null
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login (Student or Admin)
router.post('/login', (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Role-restriction check: If logging in through Admin Portal, strictly verify user has 'admin' role
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return res.status(403).json({
        error: 'ACCESS DENIED: This portal is strictly restricted to HQ Administrators. Regular candidates must use Candidate Login.'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetExam: user.targetExam,
        force: user.force,
        rollNo: user.rollNo,
        activePackage: user.activePackage || null
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
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

// Subscribe to Mock Test Package (₹100 for 2 months / ₹199 for 6 months)
router.post('/subscribe-package', requireAuth, (req, res) => {
  try {
    const { packageId, targetForce } = req.body;
    let pkgDetails = null;
    const forceName = (targetForce && typeof targetForce === 'string') ? targetForce.trim() : 'CRPF';

    if (packageId === 'pkg_100_2m') {
      pkgDetails = {
        id: 'pkg_100_2m',
        name: `Tactical Pass (${forceName} Special - 10 Full-Length Tests)`,
        targetForce: forceName,
        price: 100,
        testsCount: 10,
        testsRemaining: 10,
        durationMonths: 2,
        subscribedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        transactionId: 'TXN-CB-' + Math.floor(100000 + Math.random() * 900000)
      };
    } else if (packageId === 'pkg_199_6m') {
      pkgDetails = {
        id: 'pkg_199_6m',
        name: `Commando Pro Pass (${forceName === 'ALL' ? 'All CAPF Forces' : forceName} - 6 Months)`,
        targetForce: forceName,
        price: 199,
        testsCount: forceName === 'ALL' ? 60 : 10,
        testsRemaining: forceName === 'ALL' ? 60 : 10,
        durationMonths: 6,
        subscribedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        transactionId: 'TXN-CB-' + Math.floor(100000 + Math.random() * 900000)
      };
    } else {
      return res.status(400).json({ error: 'Invalid package selection' });
    }

    const updatedUser = db.updateUser(req.user.id, { activePackage: pkgDetails });

    res.json({
      message: `Congratulations! ${pkgDetails.name} activated successfully on your account.`,
      package: pkgDetails,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
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
