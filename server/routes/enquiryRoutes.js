const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

// Public: Candidate submits enquiry
router.post('/', (req, res) => {
  try {
    const { name, phone, email, targetExam, message } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone number, and email address are required' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNo = `ENQ-2026-${randomSuffix}`;

    const newEnquiry = {
      id: 'enq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      ticketNo,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      targetExam: (targetExam || 'General Defense Inquiry').trim(),
      message: (message || 'Exam guidance requested').trim(),
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
    const updated = db.updateEnquiry(req.params.id, {
      status: status || 'RESOLVED',
      adminNotes: adminNotes || ''
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
