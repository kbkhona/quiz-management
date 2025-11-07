import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, getActiveRooms, createLiveQuizRoom, joinLiveQuizRoom } from '../../api/api';
import QuizCard from '../../components/QuizCard';
import LiveQuizCard from '../../components/LiveQuizCard';
import CreateLiveQuizModal from '../../components/CreateLiveQuizModal';
import JoinLiveQuizModal from '../../components/JoinLiveQuizModal';

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, roomsData] = await Promise.all([
          fetchQuizzes(),
          getActiveRooms()
        ]);
        setQuizzes(quizzesData || []);
        setActiveRooms(roomsData.activeRooms || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh active rooms every 30 seconds
    const interval = setInterval(async () => {
      try {
        const roomsData = await getActiveRooms();
        setActiveRooms(roomsData.activeRooms || []);
      } catch (err) {
        console.error('Failed to refresh active rooms:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateLiveQuiz = async (quizId, settings) => {
    try {
      const response = await createLiveQuizRoom(quizId, settings);
      setShowCreateModal(false);
      // Navigate to the created room
      navigate(`/live-quiz/${response.liveQuiz._id}`);
    } catch (error) {
      console.error('Failed to create live quiz:', error);
      alert('Failed to create live quiz room');
    }
  };

  const handleJoinLiveQuiz = async (roomCode) => {
    try {
      const response = await joinLiveQuizRoom(roomCode);
      setShowJoinModal(false);
      // Navigate to the joined room
      navigate(`/live-quiz/${response.liveQuiz._id}`);
    } catch (error) {
      console.error('Failed to join live quiz:', error);
      alert(error.response?.data?.message || 'Failed to join live quiz room');
    }
  };

  if (loading) return <div className="loading">Loading quizzes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="quiz-page">
      {/* Live Quizzes Section */}
      <section className="live-quiz-section">
        <div className="section-header">
          <h2>🔴 Live Quizzes</h2>
          <div className="live-quiz-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Live Quiz
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowJoinModal(true)}
            >
              Join with Code
            </button>
          </div>
        </div>
        
        {activeRooms.length > 0 ? (
          <div className="live-quiz-grid">
            {activeRooms.map(room => (
              <LiveQuizCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="no-live-quizzes">
            <p>No active live quiz rooms at the moment.</p>
            <p>Create one to get started!</p>
          </div>
        )}
      </section>

      {/* Regular Quizzes Section */}
      <section className="regular-quiz-section">
        <h2>📚 Available Quizzes</h2>
        {quizzes && quizzes.length > 0 ? (
          <div className="quiz-grid">
            {quizzes.map(quiz => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <p>No quizzes available.</p>
        )}
      </section>

      {/* Modals */}
      {showCreateModal && (
        <CreateLiveQuizModal 
          quizzes={quizzes}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateLiveQuiz}
        />
      )}
      
      {showJoinModal && (
        <JoinLiveQuizModal 
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinLiveQuiz}
        />
      )}
    </div>
  );
};

export default QuizList;