const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const { authMiddleware } = require('../middleware/auth');

/**
GET /api/quiz-list
returns array of quizzes (id and title)
*/
router.get('/quiz-list', async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title createdAt').sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
GET /api/quiz/:id
Returns quiz details but WITHOUT correctAnswer fields
*/
router.get('/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // remove correctAnswer from questions
    const publicQuiz = {
      _id: quiz._id,
      title: quiz.title,
      author: quiz.author,
      createdAt: quiz.createdAt,
      questions: quiz.questions.map(q => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        points: q.points || 1
      }))
    };

    res.json({ quiz: publicQuiz });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
POST /api/submit-quiz
body:
{
  quizId: "...",
  takenBy: optional string (username for guest),
  answers: [
    { questionIndex: 0, answer: "4" },
    { questionIndex: 1, answer: "true" },
    ...
  ]
}
If Authorization: Bearer <token> provided, will associate attempt with that user.
Returns: { score, total, details: [ { questionIndex, correct, correctAnswer, givenAnswer, pointsEarned } ] }
*/
router.post('/submit-quiz', authMiddlewareOptional, async (req, res) => {
  // function defined below to allow optional auth
});

module.exports = router;

/**
Helper middleware to allow optional authentication:
- If Authorization header present, verify and attach req.user (like authMiddleware)
- If not present or invalid, continue with req.user = null
*/
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddlewareOptional(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(payload.id).select('-password');
    req.user = user || null;
  } catch (err) {
    // invalid token: treat as anonymous
    req.user = null;
  }
  return next();
}

// implement the submit route here (replacing the earlier placeholder)
router.post('/submit-quiz', authMiddlewareOptional, async (req, res) => {
  try {
    const { quizId, answers, takenBy } = req.body;
    if (!quizId || !Array.isArray(answers)) return res.status(400).json({ message: 'quizId and answers array required' });

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const totalPoints = quiz.questions.reduce((s, q) => s + (q.points || 1), 0);
    let score = 0;
    const details = [];

    for (const ans of answers) {
      const idx = ans.questionIndex;
      const given = ans.answer;
      const question = quiz.questions[idx];
      if (!question) {
        details.push({ questionIndex: idx, error: 'Invalid question index', pointsEarned: 0 });
        continue;
      }
      const qPoints = question.points || 1;
      let correct = false;
      const correctAnswer = question.correctAnswer != null ? String(question.correctAnswer) : null;

      if (correctAnswer == null) {
        // No correct answer stored — cannot score; treat as 0
        details.push({ questionIndex: idx, correct: null, correctAnswer: null, givenAnswer: given, pointsEarned: 0, note: 'No correct answer set for this question' });
        continue;
      }

      // Normalize comparisons:
      const normalize = (v) => (v === null || v === undefined) ? '' : String(v).trim().toLowerCase();

      if (question.type === 'MCQ' || question.type === 'boolean') {
        if (normalize(given) === normalize(correctAnswer)) {
          correct = true;
        }
      } else if (question.type === 'text') {
        // simple text comparison (case-insensitive, trimmed)
        if (normalize(given) === normalize(correctAnswer)) correct = true;
      } else {
        // default strict compare
        if (normalize(given) === normalize(correctAnswer)) correct = true;
      }

      const pointsEarned = correct ? qPoints : 0;
      score += pointsEarned;
      details.push({ questionIndex: idx, correct, correctAnswer, givenAnswer: given, pointsEarned });
    }

    // persist attempt
    const attempt = new Attempt({
      quiz: quiz._id,
      takenByUser: req.user ? req.user._id : null,
      takenByName: req.user ? req.user.username : (takenBy || null),
      answers: answers.map(a => ({ questionIndex: a.questionIndex, answer: String(a.answer) })),
      score,
      total: totalPoints
    });
    await attempt.save();

    // Build response - include correct answers for each question
    const perQuestion = details.map(d => {
      // include correctAnswer only if available
      return d;
    });

    return res.json({
      message: 'Quiz submitted',
      score,
      total: totalPoints,
      details: perQuestion,
      attemptId: attempt._id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});
