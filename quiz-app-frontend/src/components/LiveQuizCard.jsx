import React from 'react';
import { joinLiveQuizRoom } from '../api/api';

const LiveQuizCard = ({ room }) => {
  const handleJoinRoom = async () => {
    try {
      const response = await joinLiveQuizRoom(room.roomCode);
      window.location.href = `/live-quiz/${response.liveQuiz._id}`;
    } catch (error) {
      console.error('Failed to join room:', error);
      alert(error.response?.data?.message || 'Failed to join room');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="live-quiz-card">
      <div className="card-header">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
        <div className="room-code">#{room.roomCode}</div>
      </div>
      
      <div className="card-body">
        <h3 className="quiz-title">{room.title}</h3>
        <div className="room-info">
          <div className="host-info">
            <span className="label">Host:</span>
            <span className="value">{room.hostName}</span>
          </div>
          <div className="participant-info">
            <span className="label">Players:</span>
            <span className="value">{room.participantCount}/{room.maxParticipants}</span>
          </div>
          <div className="created-info">
            <span className="label">Created:</span>
            <span className="value">{formatTimeAgo(room.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <button 
          className="join-btn"
          onClick={handleJoinRoom}
          disabled={room.participantCount >= room.maxParticipants}
        >
          {room.participantCount >= room.maxParticipants ? 'Room Full' : 'Join Room'}
        </button>
      </div>
    </div>
  );
};

export default LiveQuizCard;