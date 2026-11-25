const express = require('express');
const router = express.Router();
const db = require('../db');
const security = require('../security');
const {
  hashPassword,
  comparePassword,
  DUMMY_HASH,
  generateToken,
  requireAuth
} = require('../auth');

// Register a new student (with strict rate limiting, validation & strong password policy)
router.post('/register', security.authRegisterLimiter, (req, res) => {
  try {
    const { name, email, password, targetExam, force, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({ error: 'Name must be between 2 and 80 characters' });
    }

    if (!security.isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const pwError = security.validatePasswordStrength(password, false);
    if (pwError) {
      return res.status(400).json({ error: pwError });
    }

    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const cleanTargetExam = String(targetExam || 'LDCE').trim().slice(0, 40);
    const cleanForce = String(force || 'Paramilitary Forces').trim().slice(0, 60);
    const cleanPhone = String(phone || '').replace(/[^\d+\-\s]/g, '').trim().slice(0, 18);

    const rollRandom = Math.floor(1000 + Math.random() * 9000);
    const prefix = cleanTargetExam.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'CB';
    const rollNo = `${prefix}-${new Date().getFullYear()}-${rollRandom}`;

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: cleanName,
      email: cleanEmail,
      password: hashPassword(password),
      role: 'student',
      tokenVersion: 1,
      disabled: false,
      targetExam: cleanTargetExam,
      force: cleanForce,
      phone: cleanPhone,
      rollNo,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = generateToken(newUser);
    security.logSecurityEvent('USER_REGISTERED', req, { email: cleanEmail, role: 'student' });

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
    const token = generateToken(user);

    if (user.role === 'admin') {
      security.logSecurityEvent('ADMIN_LOGIN_SUCCESS', req, { email: cleanEmail, userId: user.id });
    }

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

// Subscribe to Mock Test Package (Single Force: ₹100/2m or ₹199/6m | All Forces: ₹300/2m or ₹550/6m)
router.post('/subscribe-package', requireAuth, (req, res) => {
  try {
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
