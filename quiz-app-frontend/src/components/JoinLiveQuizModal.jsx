import React, { useState } from 'react';

const JoinLiveQuizModal = ({ onClose, onJoin }) => {
  const [roomCode, setRoomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      alert('Please enter a room code');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onJoin(roomCode.trim().toUpperCase());
    } catch (error) {
      console.error('Join error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    // Auto-uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6);
    setRoomCode(value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content join-live-quiz-modal">
        <div className="modal-header">
          <h2>🔗 Join Live Quiz</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="join-instructions">
            <p>Enter the 6-character room code to join a live quiz session.</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="room-code">Room Code:</label>
            <input
              type="text"
              id="room-code"
              value={roomCode}
              onChange={handleInputChange}
              placeholder="ABC123"
              className="room-code-input"
              maxLength={6}
              required
              autoFocus
            />
            <small className="input-hint">
              Room codes are 6 characters long (letters and numbers)
            </small>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || roomCode.length < 6}
            >
              {isSubmitting ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinLiveQuizModal;