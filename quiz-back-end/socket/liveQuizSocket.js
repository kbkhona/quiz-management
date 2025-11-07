const jwt = require('jsonwebtoken');
const LiveQuiz = require('../models/LiveQuiz');
const Quiz = require('../models/Quiz');

/**
 * Socket.io handler for live quiz functionality
 */
module.exports = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.username = decoded.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.username} (${socket.userId})`);

    /**
     * Join a live quiz room
     */
    socket.on('join-live-quiz', async (data) => {
      try {
        const { roomId } = data;
        const liveQuiz = await LiveQuiz.findById(roomId).populate('quizId');
        
        if (!liveQuiz) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = liveQuiz.participants.some(p => p.userId.toString() === socket.userId);
        if (!isParticipant) {
          socket.emit('error', { message: 'You are not a participant in this room' });
          return;
        }

        // Join socket room
        socket.join(roomId);
        socket.currentRoomId = roomId;
        
        // Send room state to user
        socket.emit('room-joined', {
          roomId,
          status: liveQuiz.status,
          currentQuestionIndex: liveQuiz.currentQuestionIndex,
          totalQuestions: liveQuiz.quizId.questions.length,
          participants: liveQuiz.participants.map(p => ({
            username: p.username,
            score: p.score
          })),
          isHost: liveQuiz.hostId.toString() === socket.userId
        });

        // Notify other participants
        socket.to(roomId).emit('participant-joined', {
          username: socket.username,
          participantCount: liveQuiz.participants.length
        });

      } catch (error) {
        console.error('Join live quiz error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    /**
     * Start the quiz (host only)
     */
    socket.on('start-quiz', async (data) => {
      try {
        const { roomId } = data;
        const liveQuiz = await LiveQuiz.findById(roomId).populate('quizId');
        
        if (!liveQuiz) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is host
        if (liveQuiz.hostId.toString() !== socket.userId) {
          socket.emit('error', { message: 'Only the host can start the quiz' });
          return;
        }

        if (liveQuiz.status !== 'waiting') {
          socket.emit('error', { message: 'Quiz already started or finished' });
          return;
        }

        // Update status to starting
        liveQuiz.status = 'starting';
        liveQuiz.startedAt = new Date();
        await liveQuiz.save();

        // Notify all participants that quiz is starting
        io.to(roomId).emit('quiz-starting', {
          message: 'Quiz starting in 3 seconds...',
          countdown: 3
        });

        // Start countdown and then begin first question
        setTimeout(() => {
          startNextQuestion(roomId);
        }, 3000);

      } catch (error) {
        console.error('Start quiz error:', error);
        socket.emit('error', { message: 'Failed to start quiz' });
      }
    });

    /**
     * Submit answer to current question
     */
    socket.on('submit-answer', async (data) => {
      try {
        const { roomId, answer } = data;
        const liveQuiz = await LiveQuiz.findById(roomId).populate('quizId');
        
        if (!liveQuiz || liveQuiz.status !== 'question-active') {
          socket.emit('error', { message: 'Cannot submit answer at this time' });
          return;
        }

        const participant = liveQuiz.participants.find(p => p.userId.toString() === socket.userId);
        if (!participant) {
          socket.emit('error', { message: 'You are not a participant' });
          return;
        }

        // Check if already answered this question
        const alreadyAnswered = participant.answers.some(a => a.questionIndex === liveQuiz.currentQuestionIndex);
        if (alreadyAnswered) {
          socket.emit('error', { message: 'You already answered this question' });
          return;
        }

        const currentQuestion = liveQuiz.quizId.questions[liveQuiz.currentQuestionIndex];
        const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
        
        // Calculate points
        let points = 0;
        if (isCorrect) {
          points = liveQuiz.settings.pointsForCorrect;
          
          // Speed bonus - extra points for faster answers
          if (liveQuiz.settings.speedBonus) {
            const timeTaken = (new Date() - liveQuiz.questionStartTime) / 1000; // seconds
            const timeLimit = liveQuiz.questionTimeLimit;
            const speedBonusPoints = Math.max(0, Math.floor((timeLimit - timeTaken) / timeLimit * 50));
            points += speedBonusPoints;
          }
        }

        // Record answer
        participant.answers.push({
          questionIndex: liveQuiz.currentQuestionIndex,
          answer,
          answeredAt: new Date(),
          isCorrect,
          points
        });

        // Update score
        participant.score += points;

        await liveQuiz.save();

        // Notify user of their answer result
        socket.emit('answer-submitted', {
          isCorrect,
          points,
          totalScore: participant.score
        });

        // Check if all participants have answered
        const answeredCount = liveQuiz.participants.filter(p => 
          p.answers.some(a => a.questionIndex === liveQuiz.currentQuestionIndex)
        ).length;

        if (answeredCount === liveQuiz.participants.length) {
          // All answered, move to next question immediately
          setTimeout(() => {
            endCurrentQuestion(roomId);
          }, 2000); // Give 2 seconds to show results
        }

      } catch (error) {
        console.error('Submit answer error:', error);
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    /**
     * Get current leaderboard
     */
    socket.on('get-leaderboard', async (data) => {
      try {
        const { roomId } = data;
        const liveQuiz = await LiveQuiz.findById(roomId);
        
        if (!liveQuiz) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const leaderboard = liveQuiz.getLeaderboard();
        socket.emit('leaderboard-update', { leaderboard });

      } catch (error) {
        console.error('Get leaderboard error:', error);
        socket.emit('error', { message: 'Failed to get leaderboard' });
      }
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.username}`);
      
      if (socket.currentRoomId) {
        socket.to(socket.currentRoomId).emit('participant-disconnected', {
          username: socket.username
        });
      }
    });
  });

  /**
   * Start next question in the quiz
   */
  async function startNextQuestion(roomId) {
    try {
      const liveQuiz = await LiveQuiz.findById(roomId).populate('quizId');
      if (!liveQuiz) return;

      const nextQuestionIndex = liveQuiz.currentQuestionIndex + 1;
      
      // Check if quiz is finished
      if (nextQuestionIndex >= liveQuiz.quizId.questions.length) {
        await endQuiz(roomId);
        return;
      }

      // Update to next question
      liveQuiz.currentQuestionIndex = nextQuestionIndex;
      liveQuiz.status = 'question-active';
      liveQuiz.questionStartTime = new Date();
      await liveQuiz.save();

      const currentQuestion = liveQuiz.quizId.questions[nextQuestionIndex];
      
      // Send question to all participants (without correct answer)
      const questionData = {
        questionIndex: nextQuestionIndex,
        question: currentQuestion.question,
        type: currentQuestion.type,
        options: currentQuestion.options,
        timeLimit: liveQuiz.questionTimeLimit,
        totalQuestions: liveQuiz.quizId.questions.length
      };

      io.to(roomId).emit('new-question', questionData);

      // Set timer for question timeout
      setTimeout(() => {
        endCurrentQuestion(roomId);
      }, liveQuiz.questionTimeLimit * 1000);

    } catch (error) {
      console.error('Start next question error:', error);
    }
  }

  /**
   * End current question and show results
   */
  async function endCurrentQuestion(roomId) {
    try {
      const liveQuiz = await LiveQuiz.findById(roomId).populate('quizId');
      if (!liveQuiz || liveQuiz.status !== 'question-active') return;

      liveQuiz.status = 'question-review';
      await liveQuiz.save();

      const currentQuestion = liveQuiz.quizId.questions[liveQuiz.currentQuestionIndex];
      
      // Prepare results
      const results = {
        correctAnswer: currentQuestion.correctAnswer,
        answeredCount: liveQuiz.participants.filter(p => 
          p.answers.some(a => a.questionIndex === liveQuiz.currentQuestionIndex)
        ).length,
        totalParticipants: liveQuiz.participants.length,
        leaderboard: liveQuiz.getLeaderboard().slice(0, 5) // Top 5
      };

      io.to(roomId).emit('question-ended', results);

      // Wait 5 seconds before next question
      setTimeout(() => {
        startNextQuestion(roomId);
      }, 5000);

    } catch (error) {
      console.error('End current question error:', error);
    }
  }

  /**
   * End the quiz and show final results
   */
  async function endQuiz(roomId) {
    try {
      const liveQuiz = await LiveQuiz.findById(roomId);
      if (!liveQuiz) return;

      liveQuiz.status = 'finished';
      liveQuiz.finishedAt = new Date();
      await liveQuiz.save();

      const finalResults = {
        leaderboard: liveQuiz.getLeaderboard(),
        totalQuestions: liveQuiz.currentQuestionIndex + 1,
        quizTitle: liveQuiz.title
      };

      io.to(roomId).emit('quiz-finished', finalResults);

      // Clean up room after 5 minutes
      setTimeout(async () => {
        await LiveQuiz.findByIdAndDelete(roomId);
      }, 5 * 60 * 1000);

    } catch (error) {
      console.error('End quiz error:', error);
    }
  }
};