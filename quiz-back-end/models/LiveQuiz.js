const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * LiveQuiz Schema for real-time quiz sessions
 */

const ParticipantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  answers: [{
    questionIndex: { type: Number, required: true },
    answer: { type: String, required: true },
    answeredAt: { type: Date, default: Date.now },
    isCorrect: { type: Boolean, required: true },
    points: { type: Number, default: 0 }
  }]
}, { _id: false });

const LiveQuizSchema = new Schema({
  title: { type: String, required: true },
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  roomCode: { type: String, required: true, unique: true },
  
  // Quiz state management
  status: { 
    type: String, 
    enum: ['waiting', 'starting', 'in-progress', 'question-active', 'question-review', 'finished'], 
    default: 'waiting' 
  },
  currentQuestionIndex: { type: Number, default: -1 },
  questionStartTime: { type: Date },
  questionTimeLimit: { type: Number, default: 30 }, // seconds per question
  
  // Participants
  participants: [ParticipantSchema],
  maxParticipants: { type: Number, default: 50 },
  
  // Settings
  settings: {
    pointsForCorrect: { type: Number, default: 100 },
    speedBonus: { type: Boolean, default: true }, // Extra points for faster answers
    showLeaderboard: { type: Boolean, default: true }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date },
  finishedAt: { type: Date }
});

// Generate unique room code
LiveQuizSchema.statics.generateRoomCode = function() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Add participant to live quiz
LiveQuizSchema.methods.addParticipant = function(userId, username) {
  // Check if user already joined
  const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (existingParticipant) {
    return false; // Already joined
  }
  
  // Check room capacity
  if (this.participants.length >= this.maxParticipants) {
    throw new Error('Room is full');
  }
  
  this.participants.push({
    userId,
    username,
    score: 0,
    answers: []
  });
  
  return true;
};

// Remove participant
LiveQuizSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(p => p.userId.toString() !== userId.toString());
};

// Get leaderboard
LiveQuizSchema.methods.getLeaderboard = function() {
  return this.participants
    .sort((a, b) => b.score - a.score)
    .map((participant, index) => ({
      rank: index + 1,
      userId: participant.userId,
      username: participant.username,
      score: participant.score
    }));
};

module.exports = mongoose.model('LiveQuiz', LiveQuizSchema);