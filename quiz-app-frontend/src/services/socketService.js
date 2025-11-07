import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_API_HOST || 'http://localhost:4000';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Live Quiz Events
  joinLiveQuiz(roomId) {
    if (this.socket) {
      this.socket.emit('join-live-quiz', { roomId });
    }
  }

  startQuiz(roomId) {
    if (this.socket) {
      this.socket.emit('start-quiz', { roomId });
    }
  }

  submitAnswer(roomId, answer) {
    if (this.socket) {
      this.socket.emit('submit-answer', { roomId, answer });
    }
  }

  getLeaderboard(roomId) {
    if (this.socket) {
      this.socket.emit('get-leaderboard', { roomId });
    }
  }

  // Event Listeners
  onRoomJoined(callback) {
    if (this.socket) {
      this.socket.on('room-joined', callback);
    }
  }

  onParticipantJoined(callback) {
    if (this.socket) {
      this.socket.on('participant-joined', callback);
    }
  }

  onParticipantDisconnected(callback) {
    if (this.socket) {
      this.socket.on('participant-disconnected', callback);
    }
  }

  onQuizStarting(callback) {
    if (this.socket) {
      this.socket.on('quiz-starting', callback);
    }
  }

  onNewQuestion(callback) {
    if (this.socket) {
      this.socket.on('new-question', callback);
    }
  }

  onAnswerSubmitted(callback) {
    if (this.socket) {
      this.socket.on('answer-submitted', callback);
    }
  }

  onQuestionEnded(callback) {
    if (this.socket) {
      this.socket.on('question-ended', callback);
    }
  }

  onQuizFinished(callback) {
    if (this.socket) {
      this.socket.on('quiz-finished', callback);
    }
  }

  onLeaderboardUpdate(callback) {
    if (this.socket) {
      this.socket.on('leaderboard-update', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();