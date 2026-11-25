/**
 * COMMANDO BATCH - ENTERPRISE SECURITY MIDDLEWARE & VALIDATION SUITE
 * Zero-dependency security layer engineered for Express 5 + Firebase Cloud Functions:
 *  - Strict Security Headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer/Permissions Policy)
 *  - Origin-restricted CORS policy
 *  - Sliding-window IP rate limiters for auth, registration, enquiries, and general API
 *  - Account-level brute-force lockout protection
 *  - Prototype-pollution key sanitization & strict input validators
 */

const allowedOrigins = new Set([
  'https://commandobatch.in',
  'https://www.commandobatch.in',
  'https://studenthub-f3414.web.app',
  'https://studenthub-f3414.firebaseapp.com',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin / server-to-server / CLI requests with no Origin header
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400
};

// Apply strict HTTP security headers to all responses
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  if (isHttps) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.gstatic.com",
    "script-src-attr 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https://commandobatch.in https://www.commandobatch.in https://studenthub-f3414.web.app https://studenthub-f3414.firebaseapp.com https://*.googleapis.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];
  if (isHttps) {
    cspDirectives.push('upgrade-insecure-requests');
  }
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  next();
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff && typeof xff === 'string') {
    return xff.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

// Sliding-window rate limiter factory (with periodic cleanup so memory stays bounded)
function createRateLimiter({ windowMs, maxRequests, message, keyPrefix = 'rl' }) {
  const buckets = new Map();
  let opsCount = 0;

  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${getClientIp(req)}`;
    let entry = buckets.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 1, resetAt: now + windowMs };
      buckets.set(key, entry);
    } else {
      entry.count += 1;
    }

    opsCount += 1;
    if (opsCount % 250 === 0) {
      for (const [k, v] of buckets.entries()) {
        if (now > v.resetAt) buckets.delete(k);
      }
    }

    const remaining = Math.max(0, maxRequests - entry.count);
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        error: message || `Too many requests. Please try again after ${retryAfterSec} seconds.`
      });
    }

    next();
  };
}

const authLoginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 12,
  keyPrefix: 'login',
  message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.'
});

const authRegisterLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 8,
  keyPrefix: 'register',
  message: 'Too many registration attempts from this IP. Please try again later.'
});

const enquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 6,
  keyPrefix: 'enquiry',
  message: 'Too many enquiry submissions. Please wait 15 minutes before submitting another request.'
});

const apiGeneralLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 240,
  keyPrefix: 'api',
  message: 'Rate limit exceeded. Please slow down API requests.'
});

// Account-level brute-force protection (5 failed password checks => 15-min lock)
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const loginFailures = new Map(); // emailLower -> { count, lockedUntil }

function checkAccountLock(email) {
  const key = String(email || '').trim().toLowerCase();
  const state = loginFailures.get(key);
  if (!state) return { locked: false };
  const now = Date.now();
  if (state.lockedUntil && now < state.lockedUntil) {
    const waitMinutes = Math.ceil((state.lockedUntil - now) / 60000);
    return {
      locked: true,
      waitMinutes,
      message: `Account temporarily locked due to repeated failed logins. Try again in ${waitMinutes} minute(s).`
    };
  }
  if (state.lockedUntil && now >= state.lockedUntil) {
    loginFailures.delete(key);
  }
  return { locked: false };
}

function recordFailedLogin(email) {
  const key = String(email || '').trim().toLowerCase();
  const cur = loginFailures.get(key) || { count: 0, lockedUntil: null };
  cur.count += 1;
  if (cur.count >= MAX_FAILED_LOGINS) {
    cur.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  loginFailures.set(key, cur);
  return cur;
}

function clearFailedLogins(email) {
  loginFailures.delete(String(email || '').trim().toLowerCase());
}

// Recursively block prototype-pollution keys (__proto__, constructor, prototype)
function stripDangerousKeys(value) {
  if (Array.isArray(value)) {
    return value.map(stripDangerousKeys);
  }
  if (value && typeof value === 'object') {
    const clean = {};
    for (const key of Object.keys(value)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      clean[key] = stripDangerousKeys(value[key]);
    }
    return clean;
  }
  return value;
}

function sanitizeBodyMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = stripDangerousKeys(req.body);
  }
  next();
}

// Strict validators
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 120 && EMAIL_REGEX.test(email.trim());
}

function validatePasswordStrength(password, isAdmin = false) {
  if (typeof password !== 'string') {
    return 'Password must be a valid string.';
  }
  const minLen = isAdmin ? 12 : 8;
  if (password.length < minLen || password.length > 128) {
    return `Password must be between ${minLen} and 128 characters.`;
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include uppercase, lowercase, and numeric characters.';
  }
  if (isAdmin && !/[^A-Za-z0-9]/.test(password)) {
    return 'Admin password must also contain at least one special character.';
  }
  return null;
}

// Ring buffer for security audit telemetry (no database bloat)
const auditEvents = [];
function logSecurityEvent(type, req, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    ip: req ? getClientIp(req) : 'system',
    ...details
  };
  auditEvents.unshift(entry);
  if (auditEvents.length > 100) auditEvents.pop();
  if (type.includes('FAIL') || type.includes('DENIED') || type.includes('LOCKED') || type.includes('ROTATED')) {
    console.warn(`[SECURITY:${type}]`, JSON.stringify(entry));
  }
}

function getSecurityAuditSummary() {
  return {
    activeLockouts: Array.from(loginFailures.entries())
      .filter(([, v]) => v.lockedUntil && v.lockedUntil > Date.now()).length,
    recentEvents: auditEvents.slice(0, 25),
    allowedOrigins: Array.from(allowedOrigins)
  };
}

module.exports = {
  corsOptions,
  securityHeaders,
  sanitizeBodyMiddleware,
  authLoginLimiter,
  authRegisterLimiter,
  enquiryLimiter,
  apiGeneralLimiter,
  checkAccountLock,
  recordFailedLogin,
  clearFailedLogins,
  isValidEmail,
  validatePasswordStrength,
  logSecurityEvent,
  getSecurityAuditSummary
};
