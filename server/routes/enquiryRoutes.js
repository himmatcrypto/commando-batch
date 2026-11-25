const express = require('express');
const router = express.Router();
const db = require('../db');
const security = require('../security');
const { requireAdmin } = require('../auth');

// Public: Candidate submits enquiry (rate-limited & input-validated)
router.post('/', security.enquiryLimiter, (req, res) => {
  try {
    const { name, phone, email, targetExam, message } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone number, and email address are required' });
    }

    const cleanName = String(name).trim().slice(0, 80);
    const cleanPhone = String(phone).replace(/[^\d+\-\s]/g, '').trim().slice(0, 18);
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanName.length < 2 || cleanPhone.length < 7 || !security.isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid name, phone number, and email address' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNo = `ENQ-2026-${randomSuffix}`;

    const newEnquiry = {
      id: 'enq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ticketNo,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      targetExam: String(targetExam || 'General Defense Inquiry').trim().slice(0, 60),
      message: String(message || 'Exam guidance requested').trim().slice(0, 1000),
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    db.createEnquiry(newEnquiry);

    res.status(201).json({
      message: `Enquiry submitted successfully! Ticket #${ticketNo} has been assigned.`,
      ticketNo,
      enquiry: newEnquiry
    });
  } catch (err) {
    console.error('Enquiry submission error:', err);
    res.status(500).json({ error: 'Server error processing exam enquiry' });
  }
});

// Admin: Retrieve all candidate enquiries
router.get('/all', requireAdmin, (req, res) => {
  try {
    const enquiries = db.getEnquiries();
    res.json({ enquiries });
  } catch (err) {
    console.error('Fetch enquiries error:', err);
    res.status(500).json({ error: 'Server error fetching enquiries' });
  }
});

// Admin: Update enquiry status (e.g. RESOLVED / IN_PROGRESS)
router.patch('/:id', requireAdmin, (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const allowedStatuses = new Set(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);
    const nextStatus = status && allowedStatuses.has(String(status).toUpperCase())
      ? String(status).toUpperCase()
      : 'RESOLVED';

    const updated = db.updateEnquiry(req.params.id, {
      status: nextStatus,
      adminNotes: String(adminNotes || '').trim().slice(0, 1000)
    });

    if (!updated) {
      return res.status(404).json({ error: 'Enquiry record not found' });
    }

    res.json({
      message: 'Enquiry updated successfully',
      enquiry: updated
    });
  } catch (err) {
    console.error('Update enquiry error:', err);
    res.status(500).json({ error: 'Server error updating enquiry' });
  }
});

module.exports = router;
