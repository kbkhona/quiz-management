const express = require('express');
const router = express.Router();
const LiveQuiz = require('../models/LiveQuiz');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

/**
 * POST /api/live/create-room
 * Create a new live quiz room
 */
router.post('/create-room', auth, async (req, res) => {
  try {
    const { quizId, settings = {} } = req.body;
    
    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Generate unique room code
    let roomCode;
    let isUnique = false;
    while (!isUnique) {
      roomCode = LiveQuiz.generateRoomCode();
      const existing = await LiveQuiz.findOne({ roomCode });
      if (!existing) isUnique = true;
    }
    
    // Create live quiz session
    const liveQuiz = new LiveQuiz({
      title: quiz.title,
      hostId: req.user.id,
      hostName: req.user.username,
      quizId: quizId,
      roomCode: roomCode,
      questionTimeLimit: settings.questionTimeLimit || 30,
      maxParticipants: settings.maxParticipants || 50,
      settings: {
        pointsForCorrect: settings.pointsForCorrect || 100,
        speedBonus: settings.speedBonus !== false,
        showLeaderboard: settings.showLeaderboard !== false
      }
    });
    
    // Host automatically joins as participant
    liveQuiz.addParticipant(req.user.id, req.user.username);
    
    await liveQuiz.save();
    
    res.status(201).json({
      message: 'Live quiz room created successfully',
      liveQuiz: {
        _id: liveQuiz._id,
        title: liveQuiz.title,
        roomCode: liveQuiz.roomCode,
        hostName: liveQuiz.hostName,
        status: liveQuiz.status,
        participantCount: liveQuiz.participants.length,
        maxParticipants: liveQuiz.maxParticipants,
        settings: liveQuiz.settings
      }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/live/join-room
 * Join a live quiz room by room code
 */
router.post('/join-room', auth, async (req, res) => {
  try {
    const { roomCode } = req.body;
    
    if (!roomCode) {
      return res.status(400).json({ message: 'Room code is required' });
    }
    
    const liveQuiz = await LiveQuiz.findOne({ roomCode: roomCode.toUpperCase() });
    if (!liveQuiz) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (liveQuiz.status !== 'waiting') {
      return res.status(400).json({ message: 'Cannot join room - quiz already in progress or finished' });
    }
    
    try {
      const added = liveQuiz.addParticipant(req.user.id, req.user.username);
      if (!added) {
        return res.status(400).json({ message: 'You are already in this room' });
      }
      
      await liveQuiz.save();
      
      res.json({
        message: 'Successfully joined the room',
        liveQuiz: {
          _id: liveQuiz._id,
          title: liveQuiz.title,
          roomCode: liveQuiz.roomCode,
          hostName: liveQuiz.hostName,
          status: liveQuiz.status,
          participantCount: liveQuiz.participants.length,
          isHost: liveQuiz.hostId.toString() === req.user.id
        }
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/live/active-rooms
 * Get list of active live quiz rooms waiting for participants
 */
router.get('/active-rooms', async (req, res) => {
  try {
    const activeRooms = await LiveQuiz.find({ 
      status: 'waiting',
      participants: { $exists: true, $not: { $size: 0 } }
    })
    .populate('hostId', 'username')
    .select('title roomCode hostName status participantCount maxParticipants createdAt')
    .sort({ createdAt: -1 })
    .limit(20);
    
    const roomsWithParticipantCount = activeRooms.map(room => ({
      _id: room._id,
      title: room.title,
      roomCode: room.roomCode,
      hostName: room.hostName,
      status: room.status,
      participantCount: room.participants.length,
      maxParticipants: room.maxParticipants,
      createdAt: room.createdAt
    }));
    
    res.json({ activeRooms: roomsWithParticipantCount });
  } catch (error) {
    console.error('Get active rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/live/room/:roomId
 * Get details of a specific live quiz room
 */
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const liveQuiz = await LiveQuiz.findById(roomId)
      .populate('quizId', 'title questions')
      .populate('hostId', 'username');
    
    if (!liveQuiz) {
      return res.status(404).json({ message: 'Live quiz room not found' });
    }
    
    // Check if user is participant
    const isParticipant = liveQuiz.participants.some(p => p.userId.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant in this room' });
    }
    
    const isHost = liveQuiz.hostId._id.toString() === req.user.id;
    
    res.json({
      liveQuiz: {
        _id: liveQuiz._id,
        title: liveQuiz.title,
        roomCode: liveQuiz.roomCode,
        hostName: liveQuiz.hostName,
        status: liveQuiz.status,
        currentQuestionIndex: liveQuiz.currentQuestionIndex,
        totalQuestions: liveQuiz.quizId.questions.length,
        participants: liveQuiz.participants.map(p => ({
          userId: p.userId,
          username: p.username,
          score: p.score,
          joinedAt: p.joinedAt
        })),
        settings: liveQuiz.settings,
        isHost
      }
    });
  } catch (error) {
    console.error('Get room details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * DELETE /api/live/room/:roomId/leave
 * Leave a live quiz room
 */
router.delete('/room/:roomId/leave', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const liveQuiz = await LiveQuiz.findById(roomId);
    if (!liveQuiz) {
      return res.status(404).json({ message: 'Live quiz room not found' });
    }
    
    liveQuiz.removeParticipant(req.user.id);
    
    // If host leaves and there are other participants, assign new host
    if (liveQuiz.hostId.toString() === req.user.id && liveQuiz.participants.length > 0) {
      const newHost = liveQuiz.participants[0];
      liveQuiz.hostId = newHost.userId;
      liveQuiz.hostName = newHost.username;
    }
    
    // If no participants left, delete the room
    if (liveQuiz.participants.length === 0) {
      await LiveQuiz.findByIdAndDelete(roomId);
      return res.json({ message: 'Left room and room was deleted (no participants remaining)' });
    }
    
    await liveQuiz.save();
    res.json({ message: 'Successfully left the room' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;