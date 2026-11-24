const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, verifyToken } = require('../auth');

// List mock tests (public / student)
router.get('/', (req, res) => {
  const { category, force } = req.query;
  const tests = db.getTests(category, force);

  // Return tests list with meta (without all questions payloads to save bandwidth)
  const summaries = tests.map(t => {
    const qCount = t.questions ? t.questions.length : (t.questionCount || 0);
    // Proportional timing: 1 minute per question (e.g. 10 Qs = 10 Min, 65 Qs = 65 Min)
    const duration = qCount > 0 ? qCount : (t.durationMinutes || 60);
    const marksPerQ = Number(t.marksPerQuestion) || 1;
    const computedTotalMarks = qCount > 0 ? (qCount * marksPerQ) : (t.totalMarks || 100);
    const passing = Math.ceil(computedTotalMarks * 0.45);

    return {
      id: t.id,
      title: t.title,
      category: t.category,
      targetExam: t.targetExam,
      force: t.force || null,
      isPaid: !!t.isPaid,
      requiredPackage: t.requiredPackage || 'pkg_100_2m',
      description: t.description,
      durationMinutes: duration,
      totalMarks: computedTotalMarks,
      passingMarks: passing,
      marksPerQuestion: marksPerQ,
      negativeMarking: t.negativeMarking,
      questionCount: qCount,
      sections: t.sections || [],
      difficulty: t.difficulty || 'Moderate',
      featured: !!t.featured
    };
  });

  res.json({ tests: summaries });
});

// Get test details for CBT examination
router.get('/:id', (req, res) => {
  const test = db.getTestById(req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Mock test not found' });
  }

  const qCount = (test.questions || []).length;
  const duration = qCount > 0 ? qCount : (test.durationMinutes || 60);
  const marksPerQ = Number(test.marksPerQuestion) || 1;
  const computedTotalMarks = qCount > 0 ? (qCount * marksPerQ) : (test.totalMarks || 100);
  const passing = Math.ceil(computedTotalMarks * 0.45);

  // Sanitize questions: strip correct answers & explanations so candidate cannot cheat via inspect element
  const sanitizedQuestions = (test.questions || []).map((q, idx) => ({
    id: q.id || `q_${idx + 1}`,
    index: idx + 1,
    section: q.section,
    textEn: q.textEn,
    textHi: q.textHi,
    options: q.options
  }));

  res.json({
    test: {
      id: test.id,
      title: test.title,
      category: test.category,
      targetExam: test.targetExam,
      force: test.force || null,
      isPaid: !!test.isPaid,
      requiredPackage: test.requiredPackage || 'pkg_100_2m',
      description: test.description,
      durationMinutes: duration,
      totalMarks: computedTotalMarks,
      passingMarks: passing,
      marksPerQuestion: marksPerQ,
      negativeMarking: test.negativeMarking !== undefined ? test.negativeMarking : 0.25,
      sections: test.sections || [],
      difficulty: test.difficulty || 'Moderate',
      questions: sanitizedQuestions
    }
  });
});

// Submit mock test responses & generate scorecard
router.post('/:id/submit', (req, res) => {
  try {
    const test = db.getTestById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Mock test not found' });
    }

    // Optional auth: if token provided and valid, attach user; otherwise create guest cadet
    let currentUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded) currentUser = decoded;
    }

    if (!currentUser) {
      currentUser = {
        id: 'cadet_' + Date.now(),
        name: 'Cadet Aspirant',
        rollNo: 'CB-2026-' + Math.floor(1000 + Math.random() * 9000),
        force: 'CAPF / Competitive Candidate',
        role: 'student'
      };
    }

    const { answers = {}, timeSpentSeconds = 0, questionStatuses = {} } = req.body;
    const questions = test.questions || [];

    const marksPerQ = Number(test.marksPerQuestion) || 1;
    const negMark = Number(test.negativeMarking) || 0;

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const sectionBreakdown = {};

    // Initialize section breakdown
    (test.sections || []).forEach(sec => {
      sectionBreakdown[sec] = {
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        positiveMarks: 0,
        negativeMarks: 0,
        marksObtained: 0
      };
    });

    const detailedAnalysis = questions.map((q, idx) => {
      const qId = q.id || `q_${idx + 1}`;
      const sec = q.section || 'General';

      if (!sectionBreakdown[sec]) {
        sectionBreakdown[sec] = {
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          unattempted: 0,
          positiveMarks: 0,
          negativeMarks: 0,
          marksObtained: 0
        };
      }

      sectionBreakdown[sec].totalQuestions += 1;

      const studentAnswer = answers[qId];
      const isAttempted = studentAnswer !== undefined && studentAnswer !== null && studentAnswer !== -1;
      let isCorrect = false;
      let marksForThisQ = 0;

      if (isAttempted) {
        sectionBreakdown[sec].attempted += 1;
        if (Number(studentAnswer) === Number(q.correctAnswer)) {
          isCorrect = true;
          correctCount += 1;
          marksForThisQ = marksPerQ;
          sectionBreakdown[sec].correct += 1;
          sectionBreakdown[sec].positiveMarks += marksPerQ;
          sectionBreakdown[sec].marksObtained += marksPerQ;
        } else {
          incorrectCount += 1;
          marksForThisQ = -negMark;
          sectionBreakdown[sec].incorrect += 1;
          sectionBreakdown[sec].negativeMarks += negMark;
          sectionBreakdown[sec].marksObtained -= negMark;
        }
      } else {
        unattemptedCount += 1;
        sectionBreakdown[sec].unattempted += 1;
      }

      return {
        id: qId,
        index: idx + 1,
        section: sec,
        textEn: q.textEn,
        textHi: q.textHi,
        options: q.options,
        studentAnswer: isAttempted ? Number(studentAnswer) : null,
        correctAnswer: Number(q.correctAnswer),
        isCorrect,
        isAttempted,
        marksAwarded: marksForThisQ,
        explanationEn: q.explanationEn,
        explanationHi: q.explanationHi
      };
    });

    // Compute distinct positive, negative, and net scores
    const positiveMarks = Math.round(correctCount * marksPerQ * 100) / 100;
    const negativeMarks = Math.round(incorrectCount * negMark * 100) / 100;
    const netMarksObtained = Math.max(0, Math.round((positiveMarks - negativeMarks) * 100) / 100);
    totalScore = netMarksObtained;

    // Clean section rounding
    Object.keys(sectionBreakdown).forEach(sec => {
      sectionBreakdown[sec].positiveMarks = Math.round(sectionBreakdown[sec].positiveMarks * 100) / 100;
      sectionBreakdown[sec].negativeMarks = Math.round(sectionBreakdown[sec].negativeMarks * 100) / 100;
      sectionBreakdown[sec].marksObtained = Math.round(sectionBreakdown[sec].marksObtained * 100) / 100;
    });

    const totalQuestions = questions.length;
    const attemptedCount = correctCount + incorrectCount;
    const accuracyPercent = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const percentageMarks = test.totalMarks > 0 ? Math.round((totalScore / test.totalMarks) * 100) : 0;
    const isQualified = totalScore >= (test.passingMarks || (test.totalMarks * 0.45));

    // Calculate All-India Rank & Percentile relative to all test attempts
    const allAttemptsForTest = db.getAllAttempts().filter(a => a.testId === test.id);
    const higherScoreCount = allAttemptsForTest.filter(a => a.score > totalScore).length;
    const rank = higherScoreCount + 1;
    const totalAspirants = allAttemptsForTest.length + 1;

    const belowCount = allAttemptsForTest.filter(a => a.score < totalScore).length;
    const percentile = totalAspirants > 1
      ? Math.round(((belowCount + 1) / totalAspirants) * 1000) / 10
      : (totalScore >= test.passingMarks ? 92.5 : 74.0);

    const attemptRecord = {
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      userId: currentUser.id,
      userName: currentUser.name,
      userRollNo: currentUser.rollNo,
      userForce: currentUser.force || 'Defense Force',
      testId: test.id,
      testTitle: test.title,
      category: test.category,
      totalMarks: test.totalMarks,
      passingMarks: test.passingMarks,
      marksPerQuestion: marksPerQ,
      negativeMarking: negMark,
      score: totalScore,
      positiveMarks,
      negativeMarks,
      rank,
      totalAspirants,
      percentage: percentageMarks,
      accuracy: accuracyPercent,
      percentile,
      isQualified,
      timeSpentSeconds,
      summary: {
        totalQuestions,
        attempted: attemptedCount,
        correct: correctCount,
        incorrect: incorrectCount,
        unattempted: unattemptedCount
      },
      sectionBreakdown,
      detailedAnalysis,
      submittedAt: new Date().toISOString()
    };

    db.createAttempt(attemptRecord);

    res.status(201).json({
      message: 'Test submitted successfully! Scorecard generated.',
      attemptId: attemptRecord.id,
      scorecard: attemptRecord
    });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Failed to process test submission' });
  }
});

module.exports = router;
