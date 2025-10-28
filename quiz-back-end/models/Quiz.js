const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
Quiz document schema:
{
  title: String,
  questions: [
    {
      question: String,
      type: 'MCQ' | 'text' | 'boolean',
      options: [String],          // optional for MCQ
      correctAnswer: String|null, // stored but not sent in public GET
      points: Number (optional)
    }
  ],
  author: ObjectId (User),
  createdAt: Date
}
*/
const QuestionSchema = new Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'text', 'boolean'], required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 }
}, { _id: false });

const QuizSchema = new Schema({
  title: { type: String, required: true, unique: true },
  questions: [QuestionSchema],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
