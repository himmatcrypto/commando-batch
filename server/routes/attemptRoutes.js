const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../auth');

// Get all attempts for the logged in student
router.get('/my', requireAuth, (req, res) => {
  const attempts = db.getAttemptsByUser(req.user.id);
  // Summarized list for dashboard
  const summaries = attempts.map(a => ({
    id: a.id,
    testId: a.testId,
    testTitle: a.testTitle,
    category: a.category,
    score: a.score,
    totalMarks: a.totalMarks,
    percentage: a.percentage,
    accuracy: a.accuracy,
    isQualified: a.isQualified,
    percentile: a.percentile,
    timeSpentSeconds: a.timeSpentSeconds,
    summary: a.summary,
    submittedAt: a.submittedAt
  }));

  res.json({ attempts: summaries });
});

// Get a single detailed scorecard by attempt ID
router.get('/:id', requireAuth, (req, res) => {
  const attempt = db.getAttemptById(req.params.id);
  if (!attempt) {
    return res.status(404).json({ error: 'Scorecard attempt not found' });
  }

  // Allow student to see their own attempt, or admin to see any attempt
  if (attempt.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to view this scorecard' });
  }

  res.json({ scorecard: attempt });
});

module.exports = router;
