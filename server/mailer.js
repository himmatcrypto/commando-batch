const nodemailer = require('nodemailer');
const db = require('./db');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getEmailConfig() {
  const dbEmailCfg = (db.getDb().settings && db.getDb().settings.email) || {};
  const resendApiKey = process.env.RESEND_API_KEY || dbEmailCfg.resendApiKey || '';
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || dbEmailCfg.user || '';
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || dbEmailCfg.pass || '';
  const smtpHost = process.env.SMTP_HOST || dbEmailCfg.host || (smtpUser ? 'smtp.gmail.com' : '');
  const smtpPort = Number(process.env.SMTP_PORT || dbEmailCfg.port || 587);
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || dbEmailCfg.from || (smtpUser ? `"Commando Batch" <${smtpUser}>` : 'Commando Batch <onboarding@resend.dev>');

  return {
    configured: !!(resendApiKey || (smtpHost && smtpUser && smtpPass)),
    provider: resendApiKey ? 'resend' : (smtpHost && smtpUser && smtpPass ? (smtpHost.includes('gmail') ? 'gmail' : 'smtp') : 'none'),
    resendApiKey,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    from
  };
}

function wrapBrandedHtml({ title, bodyHtml, footerText }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #0f172a; color: #e2e8f0; border-radius: 12px; border: 1px solid #334155;">
      <h2 style="margin: 0 0 14px 0; color: #38bdf8;">${escapeHtml(title)}</h2>
      <div style="line-height: 1.6; font-size: 14px; color: #e2e8f0;">
        ${bodyHtml}
      </div>
      <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0 12px 0;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        ${escapeHtml(footerText || 'Commando Batch — Defence & SSC Examination Portal (https://commandobatch.in)')}
      </p>
    </div>
  `;
}

async function sendMail({ to, subject, text, html }) {
  const cfg = getEmailConfig();
  if (!cfg.configured) {
    const err = new Error('Email service is not configured yet. Please configure GMAIL_USER & GMAIL_APP_PASSWORD (or SMTP_* / RESEND_API_KEY) on the server.');
    err.statusCode = 503;
    throw err;
  }

  const recipients = Array.isArray(to) ? to : [to];

  if (cfg.provider === 'resend') {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfg.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: cfg.from,
        to: recipients,
        subject,
        html,
        text
      })
    });
    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      const err = new Error(`Email provider error: ${errText || r.status}`);
      err.statusCode = 502;
      throw err;
    }
    return 'RESEND';
  }

  const transporter = nodemailer.createTransport({
    host: cfg.smtpHost,
    port: cfg.smtpPort,
    secure: cfg.smtpPort === 465,
    auth: { user: cfg.smtpUser, pass: cfg.smtpPass }
  });

  await transporter.sendMail({
    from: cfg.from,
    to: recipients.join(', '),
    subject,
    text,
    html
  });
  return 'SMTP';
}

async function sendRegistrationOtpEmail(toEmail, otp) {
  const subject = `Commando Batch - Email Verification Code: ${otp}`;
  const text = `Your 6-digit verification code for Commando Batch candidate registration is ${otp}. This code is valid for 10 minutes. Do not share this code with anyone.`;
  const html = wrapBrandedHtml({
    title: 'Commando Batch — Email Verification',
    bodyHtml: `
      <p style="margin: 0 0 14px 0;">Use the verification code below to complete your candidate registration on <strong>commandobatch.in</strong>:</p>
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; text-align: center; padding: 14px 20px; background: #1e293b; color: #4ade80; border-radius: 8px; border: 1px solid #22c55e; margin-bottom: 14px;">
        ${escapeHtml(otp)}
      </div>
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
    `
  });
  return await sendMail({ to: toEmail, subject, text, html });
}

async function sendWelcomeEmail(user) {
  if (!user || !user.email) return null;
  const name = user.name || 'Candidate';
  const rollNo = user.rollNo || 'Assigned on Dashboard';
  const targetExam = user.targetExam || 'Defence / SSC';
  const force = user.force || 'Paramilitary Forces';

  const subject = `Congratulations ${name}! Welcome to Commando Batch (Roll No: ${rollNo})`;
  const text = `Congratulations ${name}! Your candidate account on Commando Batch (https://commandobatch.in) has been successfully created.\n\nRoll Number: ${rollNo}\nTarget Exam: ${targetExam}\nForce / Wing: ${force}\n\nLog in anytime at https://commandobatch.in to start your mock tests. Jai Hind!`;
  const html = wrapBrandedHtml({
    title: '🎖️ Congratulations & Welcome to Commando Batch!',
    bodyHtml: `
      <p style="margin: 0 0 12px 0;">Dear <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin: 0 0 14px 0;">Congratulations! Your candidate account on <strong>Commando Batch</strong> has been successfully registered.</p>
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px;">
        <div><strong>Roll Number:</strong> <span style="color: #4ade80; font-family: monospace;">${escapeHtml(rollNo)}</span></div>
        <div style="margin-top: 4px;"><strong>Target Exam:</strong> ${escapeHtml(targetExam)}</div>
        <div style="margin-top: 4px;"><strong>Force / Wing:</strong> ${escapeHtml(force)}</div>
      </div>
      <p style="margin: 0 0 14px 0;">You can now log in to attempt full-length CBT mock tests, track your All-India Rank, and access your candidate dashboard.</p>
      <a href="https://commandobatch.in" style="display: inline-block; background: #22c55e; color: #052e16; font-weight: 700; text-decoration: none; padding: 10px 18px; border-radius: 8px;">Open Commando Batch →</a>
    `,
    footerText: 'Jai Hind! • Commando Batch (https://commandobatch.in)'
  });

  return await sendMail({ to: user.email, subject, text, html });
}

module.exports = {
  escapeHtml,
  getEmailConfig,
  wrapBrandedHtml,
  sendMail,
  sendRegistrationOtpEmail,
  sendWelcomeEmail
};
