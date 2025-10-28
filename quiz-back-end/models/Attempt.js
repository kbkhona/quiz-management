const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
Attempt:
{
  quiz: ObjectId,
  takenBy: { username or userId } (if user not logged in, allow null or a string),
  answers: [{ questionIndex, answer }],
  score: Number,
  total: Number,
  createdAt: Date
}
*/
const AnswerSchema = new Schema({
  questionIndex: { type: Number, required: true },
  answer: { type: String } // normalize all answers to strings for comparison
}, { _id: false });

const AttemptSchema = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  takenByUser: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  takenByName: { type: String, default: null }, // fallback username/email for guest
  answers: [AnswerSchema],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', AttemptSchema);
