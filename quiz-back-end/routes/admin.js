const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Quiz = require('../models/Quiz');

/**
Admin routes: require authentication and admin role
*/

/**
POST /api/admin/register-quiz
body:
{
  title: "Quiz Title",
  questions: [
    {
      question: "What is 2+2?",
      type: "MCQ", // or "text", "boolean"
      options: ["1","2","4","3"], // only for MCQ
      correctAnswer: "4", // optional; can be null/blank
      points: 1
    }, ...
  ]
}
*/
router.post('/register-quiz', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'title and questions array required' });
    }

    // basic validation of questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.type) return res.status(400).json({ message: `question and type required for question index ${i}` });
      if (!['MCQ', 'text', 'boolean'].includes(q.type)) return res.status(400).json({ message: `invalid type for question index ${i}` });
      if (q.type === 'MCQ' && (!Array.isArray(q.options) || q.options.length < 2)) {
        return res.status(400).json({ message: `MCQ question at index ${i} must have options array with at least 2 items` });
      }
    }

    const quiz = new Quiz({
      title,
      questions,
      author: req.user._id
    });

    await quiz.save();
    res.status(201).json({ message: 'Quiz created', quizId: quiz._id });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'A quiz with that title already exists' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
