import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getLiveQuizRoomDetails, leaveLiveQuizRoom } from '../../api/api';
import socketService from '../../services/socketService';

const LiveQuiz = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questionResults, setQuestionResults] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    initializeRoom();
    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
    };
  }, [roomId, user, navigate]);

  const initializeRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Connect to socket
      socketService.connect(token);

      // Fetch room details
      const response = await getLiveQuizRoomDetails(roomId);
      setRoomData(response.liveQuiz);
      setParticipants(response.liveQuiz.participants);

      // Join the socket room
      socketService.joinLiveQuiz(roomId);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize room:', error);
      setError(error.response?.data?.message || 'Failed to load room');
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onRoomJoined((data) => {
      console.log('Room joined:', data);
      addMessage(`Welcome to the room! ${data.isHost ? '(You are the host)' : ''}`);
    });

    socketService.onParticipantJoined((data) => {
      addMessage(`${data.username} joined the room`);
      setParticipants(prev => [...prev, { username: data.username, score: 0 }]);
    });

    socketService.onParticipantDisconnected((data) => {
      addMessage(`${data.username} left the room`);
      setParticipants(prev => prev.filter(p => p.username !== data.username));
    });

    socketService.onQuizStarting((data) => {
      addMessage(data.message);
      setShowResults(false);
      setCurrentQuestion(null);
    });

    socketService.onNewQuestion((data) => {
      setCurrentQuestion(data);
      setTimeLeft(data.timeLimit);
      setSelectedAnswer('');
      setHasAnswered(false);
      setShowResults(false);
      addMessage(`Question ${data.questionIndex + 1} of ${data.totalQuestions}`);

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socketService.onAnswerSubmitted((data) => {
      setHasAnswered(true);
      if (data.isCorrect) {
        addMessage(`Correct! +${data.points} points. Total: ${data.totalScore}`);
      } else {
        addMessage(`Incorrect. Total score: ${data.totalScore}`);
      }
    });

    socketService.onQuestionEnded((data) => {
      setShowResults(true);
      setQuestionResults(data);
      setParticipants(data.leaderboard || []);
      addMessage(`Question ended. Correct answer: ${data.correctAnswer}`);
    });

    socketService.onQuizFinished((data) => {
      setFinalResults(data);
      setCurrentQuestion(null);
      addMessage('Quiz finished! Check the final leaderboard.');
    });

    socketService.onLeaderboardUpdate((data) => {
      setParticipants(data.leaderboard || []);
    });

    socketService.onError((error) => {
      console.error('Socket error:', error);
      addMessage(`Error: ${error.message}`, 'error');
    });
  };

  const addMessage = (message, type = 'info') => {
    const newMessage = {
      id: Date.now(),
      text: message,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev.slice(-9), newMessage]); // Keep last 10 messages
  };

  const handleStartQuiz = () => {
    socketService.startQuiz(roomId);
  };

  const handleAnswerSelect = (answer) => {
    if (!hasAnswered && timeLeft > 0) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer && !hasAnswered) {
      socketService.submitAnswer(roomId, selectedAnswer);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveLiveQuizRoom(roomId);
      socketService.disconnect();
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomData.roomCode);
    addMessage('Room code copied to clipboard!');
  };

  if (loading) return <div className="loading">Loading room...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="live-quiz-container">
      {/* Header */}
      <div className="live-quiz-header">
        <div className="room-info">
          <h1>{roomData.title}</h1>
          <div className="room-details">
            <span className="room-code" onClick={copyRoomCode} title="Click to copy">
              Room: {roomData.roomCode}
            </span>
            <span className="host-name">Host: {roomData.hostName}</span>
            <span className="participant-count">
              Players: {participants.length}
            </span>
          </div>
        </div>
        <button className="leave-btn" onClick={handleLeaveRoom}>
          Leave Room
        </button>
      </div>

      <div className="live-quiz-content">
        {/* Main Content Area */}
        <div className="quiz-area">
          {finalResults ? (
            /* Final Results */
            <div className="final-results">
              <h2>🏆 Quiz Complete!</h2>
              <div className="final-leaderboard">
                <h3>Final Leaderboard</h3>
                {finalResults.leaderboard.map((participant, index) => (
                  <div key={participant.userId} className={`leaderboard-item rank-${index + 1}`}>
                    <span className="rank">#{index + 1}</span>
                    <span className="username">{participant.username}</span>
                    <span className="score">{participant.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          ) : currentQuestion ? (
            /* Current Question */
            <div className="question-container">
              <div className="question-header">
                <div className="question-progress">
                  Question {currentQuestion.questionIndex + 1} of {currentQuestion.totalQuestions}
                </div>
                <div className="timer">
                  ⏱️ {timeLeft}s
                </div>
              </div>

              <div className="question-content">
                <h2>{currentQuestion.question}</h2>
                
                {currentQuestion.type === 'MCQ' && currentQuestion.options && (
                  <div className="options-grid">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                      <button
                        key={key}
                        className={`option-btn ${selectedAnswer === key ? 'selected' : ''} ${hasAnswered ? 'disabled' : ''}`}
                        onClick={() => handleAnswerSelect(key)}
                        disabled={hasAnswered || timeLeft === 0}
                      >
                        <span className="option-key">{key.toUpperCase()})</span>
                        <span className="option-text">{value}</span>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type !== 'MCQ' && (
                  <div className="text-answer">
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      disabled={hasAnswered || timeLeft === 0}
                      className="answer-input"
                    />
                  </div>
                )}

                {selectedAnswer && !hasAnswered && timeLeft > 0 && (
                  <button className="submit-answer-btn" onClick={handleSubmitAnswer}>
                    Submit Answer
                  </button>
                )}
              </div>

              {showResults && questionResults && (
                <div className="question-results">
                  <div className="correct-answer">
                    Correct Answer: <strong>{questionResults.correctAnswer}</strong>
                  </div>
                  <div className="answer-stats">
                    {questionResults.answeredCount}/{questionResults.totalParticipants} participants answered
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Waiting Room */
            <div className="waiting-room">
              <h2>Waiting Room</h2>
              <p>Waiting for the host to start the quiz...</p>
              
              {roomData.isHost && (
                <button 
                  className="start-quiz-btn"
                  onClick={handleStartQuiz}
                  disabled={participants.length < 2}
                >
                  {participants.length < 2 ? 'Need at least 2 players' : 'Start Quiz'}
                </button>
              )}
              
              <div className="room-code-share">
                <p>Share this room code with others:</p>
                <div className="shareable-code" onClick={copyRoomCode}>
                  {roomData.roomCode}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="quiz-sidebar">
          {/* Participants */}
          <div className="participants-panel">
            <h3>Participants ({participants.length})</h3>
            <div className="participants-list">
              {participants.map((participant, index) => (
                <div key={participant.userId || index} className="participant-item">
                  <span className="participant-name">{participant.username}</span>
                  <span className="participant-score">{participant.score || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="messages-panel">
            <h3>Live Updates</h3>
            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.type}`}>
                  <span className="message-text">{message.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQuiz;