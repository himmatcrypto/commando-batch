/**
 * CASHFREE PAYMENTS PG (v2023-08-01) INTEGRATION
 * Supports:
 *  - Order creation with server-enforced INR pricing
 *  - Server-side payment verification (GET /pg/orders/:id)
 *  - HMAC-SHA256 verified Cashfree Webhooks
 *  - Secure config loading from env vars OR locked Cloud Firestore settings/cashfree
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db');
const firebase = require('../firebase');
const security = require('../security');
const { requireAuth } = require('../auth');

const CF_API_VERSION = '2023-08-01';
const ALLOWED_FORCES = new Set(['CRPF', 'CISF', 'BSF', 'ITBP', 'SSB', 'ASSAM RIFLES', 'ALL']);

let cachedCfConfig = null;
let cachedAt = 0;

async function getCashfreeConfig(forceRefresh = false) {
  if (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
    const envMode = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase() === 'production' ? 'production' : 'sandbox';
    return {
      appId: process.env.CASHFREE_APP_ID.trim(),
      secretKey: process.env.CASHFREE_SECRET_KEY.trim(),
      env: envMode,
      baseUrl: envMode === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'
    };
  }

  if (!forceRefresh && cachedCfConfig && (Date.now() - cachedAt) < 60000) {
    return cachedCfConfig;
  }

  try {
    if (firebase.isConnected()) {
      const snap = await firebase.getFirestore().collection('settings').doc('cashfree').get();
      if (snap.exists) {
        const d = snap.data() || {};
        if (d.appId && d.secretKey) {
          const envMode = (d.env || 'sandbox').toLowerCase() === 'production' ? 'production' : 'sandbox';
          cachedCfConfig = {
            appId: String(d.appId).trim(),
            secretKey: String(d.secretKey).trim(),
            env: envMode,
            baseUrl: envMode === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'
          };
          cachedAt = Date.now();
          return cachedCfConfig;
        }
      }
    }
  } catch (err) {
    console.warn('Cashfree config lookup error:', err.message);
  }
  return null;
}

function clearCashfreeConfigCache() {
  cachedCfConfig = null;
  cachedAt = 0;
}

function computePackageOffer(packageId, targetForce, durationMonths) {
  const rawForce = (targetForce && typeof targetForce === 'string') ? targetForce.trim() : 'CRPF';
  const forceUpper = rawForce.toUpperCase();
  if (!ALLOWED_FORCES.has(forceUpper)) {
    return null;
  }

  const forceName = forceUpper === 'ASSAM RIFLES' ? 'Assam Rifles' : (forceUpper === 'ALL' ? 'ALL' : forceUpper);
  const isAllForces = forceName === 'ALL';
  const is6Months = packageId === 'pkg_199_6m' || packageId === 'pkg_all_6m' || Number(durationMonths) === 6;

  const basePrice = is6Months ? (isAllForces ? 550 : 199) : (isAllForces ? 300 : 100);
  const gstRate = 18;
  const gstAmount = Math.round(basePrice * 0.18 * 100) / 100;
  const totalPayable = Math.round((basePrice + gstAmount) * 100) / 100;

  if (is6Months) {
    return {
      id: isAllForces ? 'pkg_all_6m' : 'pkg_199_6m',
      name: isAllForces
        ? 'Commando All-Force Pro Pass (All 60 Full-Length Mocks - 6 Months)'
        : `Commando Pro Pass (${forceName} Special - 10 Full-Length Tests - 6 Months)`,
      targetForce: isAllForces ? 'ALL' : forceName,
      basePrice,
      gstRate,
      gstAmount,
      price: totalPayable,
      testsCount: isAllForces ? 60 : 10,
      durationMonths: 6
    };
  }

  return {
    id: isAllForces ? 'pkg_all_2m' : 'pkg_100_2m',
    name: isAllForces
      ? 'Tactical All-Force Pass (All 60 Full-Length Mocks - 2 Months)'
      : `Tactical Pass (${forceName} Special - 10 Full-Length Tests - 2 Months)`,
    targetForce: isAllForces ? 'ALL' : forceName,
    basePrice,
    gstRate,
    gstAmount,
    price: totalPayable,
    testsCount: isAllForces ? 60 : 10,
    durationMonths: 2
  };
}

function activatePackageForOrder(order, cfOrder, cfPaymentId) {
  const user = db.findUserById(order.userId);
  if (!user) return null;

  const pkgDetails = {
    id: order.packageId,
    name: order.packageName,
    targetForce: order.targetForce,
    basePrice: order.basePrice || order.amount,
    gstRate: order.gstRate || 18,
    gstAmount: order.gstAmount || 0,
    price: order.amount,
    testsCount: order.testsCount,
    testsRemaining: order.testsCount,
    durationMonths: order.durationMonths,
    subscribedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (order.durationMonths === 6 ? 180 : 60) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    paymentGateway: 'CASHFREE',
    orderId: order.orderId,
    transactionId: cfPaymentId || cfOrder.cf_order_id || order.orderId
  };

  const updatedUser = db.updateUser(user.id, { activePackage: pkgDetails });
  db.updateOrder(order.id, {
    status: 'PAID',
    cfOrderId: cfOrder.cf_order_id || order.cfOrderId || null,
    cfPaymentId: cfPaymentId || null,
    paidAt: new Date().toISOString()
  });

  return { pkgDetails, updatedUser };
}

// Public: Check whether Cashfree is configured & which mode (sandbox/production)
router.get('/status', async (req, res) => {
  const cfg = await getCashfreeConfig();
  res.json({
    configured: !!cfg,
    mode: cfg ? cfg.env : null
  });
});

// Create Cashfree Payment Order (Authenticated Candidate)
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const cfg = await getCashfreeConfig();
    if (!cfg) {
      return res.status(503).json({
        error: 'Cashfree Payment Gateway is not configured yet. Please ask HQ Admin to add Cashfree App ID & Secret Key in Admin Panel.',
        needsConfiguration: true
      });
    }

    const { packageId, targetForce, durationMonths } = req.body;
    const offer = computePackageOffer(packageId, targetForce, durationMonths);
    if (!offer) {
      return res.status(400).json({ error: 'Invalid target force or package selected.' });
    }

    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Candidate account not found.' });
    }

    const orderId = `CB_ORD_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const phoneDigits = String(user.phone || '').replace(/\D/g, '').slice(-10);
    const customerPhone = phoneDigits.length === 10 ? phoneDigits : '9999999999';

    const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || 'commandobatch.in';
    const protoHeader = (req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0].trim();
    const originUrl = `${protoHeader}://${hostHeader}`;

    const cfPayload = {
      order_id: orderId,
      order_amount: offer.price,
      order_currency: 'INR',
      customer_details: {
        customer_id: String(user.id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48),
        customer_name: String(user.name || 'Candidate').slice(0, 80),
        customer_email: user.email,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: `${originUrl}/?cf_order_id={order_id}`
      },
      order_note: `${offer.name} | Roll: ${user.rollNo || 'N/A'}`
    };

    const cfRes = await fetch(`${cfg.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': CF_API_VERSION,
        'x-client-id': cfg.appId,
        'x-client-secret': cfg.secretKey
      },
      body: JSON.stringify(cfPayload)
    });

    const cfData = await cfRes.json().catch(() => ({}));
    if (!cfRes.ok || !cfData.payment_session_id) {
      console.error('Cashfree create-order failed:', cfRes.status, cfData);
      return res.status(502).json({
        error: cfData.message || 'Unable to initiate Cashfree payment order. Verify Cashfree API keys & mode.'
      });
    }

    const orderRecord = {
      id: orderId,
      orderId,
      cfOrderId: cfData.cf_order_id || null,
      paymentSessionId: cfData.payment_session_id,
      userId: user.id,
      userEmail: user.email,
      packageId: offer.id,
      packageName: offer.name,
      targetForce: offer.targetForce,
      basePrice: offer.basePrice,
      gstRate: offer.gstRate,
      gstAmount: offer.gstAmount,
      amount: offer.price,
      currency: 'INR',
      testsCount: offer.testsCount,
      durationMonths: offer.durationMonths,
      env: cfg.env,
      status: 'CREATED',
      createdAt: new Date().toISOString()
    };

    db.createOrder(orderRecord);
    security.logSecurityEvent('CASHFREE_ORDER_CREATED', req, { orderId, userId: user.id, amount: offer.price, gstAmount: offer.gstAmount });

    res.status(201).json({
      orderId,
      paymentSessionId: cfData.payment_session_id,
      mode: cfg.env,
      basePrice: offer.basePrice,
      gstRate: offer.gstRate,
      gstAmount: offer.gstAmount,
      amount: offer.price,
      packageName: offer.name
    });
  } catch (err) {
    console.error('Cashfree create-order exception:', err);
    res.status(500).json({ error: 'Server error creating Cashfree payment order' });
  }
});

// Verify Cashfree Payment Status Server-Side & Activate Pass
router.post('/verify-order', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'orderId is required for verification' });
    }

    const order = db.getOrderById(orderId.trim());
    if (!order) {
      return res.status(404).json({ error: 'Payment order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to verify this payment order' });
    }

    // Idempotent check if webhook already activated it
    if (order.status === 'PAID') {
      const user = db.findUserById(order.userId);
      return res.json({
        verified: true,
        message: 'Payment already verified! Pass is active.',
        package: user ? user.activePackage : null,
        user: user ? {
          id: user.id, name: user.name, email: user.email, role: user.role,
          targetExam: user.targetExam, force: user.force, rollNo: user.rollNo,
          activePackage: user.activePackage
        } : null
      });
    }

    const cfg = await getCashfreeConfig();
    if (!cfg) {
      return res.status(503).json({ error: 'Cashfree gateway credentials unavailable for verification' });
    }

    const cfRes = await fetch(`${cfg.baseUrl}/orders/${encodeURIComponent(order.orderId)}`, {
      headers: {
        'x-api-version': CF_API_VERSION,
        'x-client-id': cfg.appId,
        'x-client-secret': cfg.secretKey
      }
    });
    const cfOrder = await cfRes.json().catch(() => ({}));
    if (!cfRes.ok) {
      return res.status(502).json({ error: cfOrder.message || 'Failed to verify order with Cashfree' });
    }

    if (cfOrder.order_status !== 'PAID') {
      return res.status(402).json({
        verified: false,
        orderStatus: cfOrder.order_status || 'PENDING',
        error: `Payment not completed yet (Status: ${cfOrder.order_status || 'ACTIVE'}).`
      });
    }

    if (Number(cfOrder.order_amount) < Number(order.amount)) {
      security.logSecurityEvent('CASHFREE_AMOUNT_MISMATCH', req, { orderId, expected: order.amount, got: cfOrder.order_amount });
      return res.status(400).json({ error: 'Payment amount mismatch detected.' });
    }

    // Fetch payment transaction reference if available
    let cfPaymentId = null;
    try {
      const payRes = await fetch(`${cfg.baseUrl}/orders/${encodeURIComponent(order.orderId)}/payments`, {
        headers: {
          'x-api-version': CF_API_VERSION,
          'x-client-id': cfg.appId,
          'x-client-secret': cfg.secretKey
        }
      });
      const payments = await payRes.json().catch(() => []);
      if (Array.isArray(payments)) {
        const successPay = payments.find(p => p.payment_status === 'SUCCESS');
        if (successPay) cfPaymentId = String(successPay.cf_payment_id || successPay.bank_reference || '');
      }
    } catch {}

    const result = activatePackageForOrder(order, cfOrder, cfPaymentId);
    if (!result) {
      return res.status(404).json({ error: 'Candidate user not found for activation' });
    }

    security.logSecurityEvent('CASHFREE_PAYMENT_VERIFIED', req, {
      orderId: order.orderId,
      userId: order.userId,
      amount: order.amount,
      cfPaymentId
    });

    const u = result.updatedUser;
    res.json({
      verified: true,
      message: `Payment verified! ${result.pkgDetails.name} activated.`,
      package: result.pkgDetails,
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        targetExam: u.targetExam,
        force: u.force,
        rollNo: u.rollNo,
        activePackage: u.activePackage
      }
    });
  } catch (err) {
    console.error('Cashfree verify-order error:', err);
    res.status(500).json({ error: 'Server error verifying payment' });
  }
});

// Cashfree Server-to-Server Webhook (HMAC-SHA256 verified)
router.post('/webhook', async (req, res) => {
  try {
    const cfg = await getCashfreeConfig();
    if (!cfg) {
      return res.status(503).json({ error: 'Cashfree not configured' });
    }

    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.rawBody || JSON.stringify(req.body || {});

    if (!signature || !timestamp) {
      return res.status(400).json({ error: 'Missing Cashfree webhook signature headers' });
    }

    const expectedSig = crypto
      .createHmac('sha256', cfg.secretKey)
      .update(`${timestamp}${rawBody}`)
      .digest('base64');

    const sigBuf = Buffer.from(String(signature), 'utf8');
    const expBuf = Buffer.from(expectedSig, 'utf8');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      security.logSecurityEvent('CASHFREE_WEBHOOK_BAD_SIG', req, {});
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body || {};
    const orderObj = event.data && event.data.order;
    const paymentObj = event.data && event.data.payment;

    if (orderObj && orderObj.order_id && paymentObj && paymentObj.payment_status === 'SUCCESS') {
      const order = db.getOrderById(orderObj.order_id);
      if (order && order.status !== 'PAID' && Number(orderObj.order_amount) >= Number(order.amount)) {
        activatePackageForOrder(
          order,
          { cf_order_id: orderObj.cf_order_id || null },
          paymentObj.cf_payment_id ? String(paymentObj.cf_payment_id) : null
        );
        security.logSecurityEvent('CASHFREE_WEBHOOK_ACTIVATED', req, { orderId: order.orderId, userId: order.userId });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Cashfree webhook error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

module.exports = {
  router,
  getCashfreeConfig,
  clearCashfreeConfigCache
};
