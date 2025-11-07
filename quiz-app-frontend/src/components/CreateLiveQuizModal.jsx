import React, { useState } from 'react';

const CreateLiveQuizModal = ({ quizzes, onClose, onCreate }) => {
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [settings, setSettings] = useState({
    questionTimeLimit: 30,
    maxParticipants: 50,
    pointsForCorrect: 100,
    speedBonus: true,
    showLeaderboard: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedQuizId) {
      alert('Please select a quiz');
      return;
    }
    onCreate(selectedQuizId, settings);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content create-live-quiz-modal">
        <div className="modal-header">
          <h2>🚀 Create Live Quiz Room</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="quiz-select">Select Quiz:</label>
            <select
              id="quiz-select"
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              required
            >
              <option value="">Choose a quiz...</option>
              {quizzes.map(quiz => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title} ({quiz.questions?.length || 0} questions)
                </option>
              ))}
            </select>
          </div>

          <div className="settings-section">
            <h3>Room Settings</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="time-limit">Time per Question (seconds):</label>
                <input
                  type="number"
                  id="time-limit"
                  min="10"
                  max="300"
                  value={settings.questionTimeLimit}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    questionTimeLimit: parseInt(e.target.value)
                  }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="max-participants">Max Participants:</label>
                <input
                  type="number"
                  id="max-participants"
                  min="2"
                  max="100"
                  value={settings.maxParticipants}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value)
                  }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="points">Points per Correct Answer:</label>
              <input
                type="number"
                id="points"
                min="10"
                max="1000"
                step="10"
                value={settings.pointsForCorrect}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  pointsForCorrect: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.speedBonus}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    speedBonus: e.target.checked
                  }))}
                />
                <span>Speed Bonus (extra points for faster answers)</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.showLeaderboard}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    showLeaderboard: e.target.checked
                  }))}
                />
                <span>Show Leaderboard</span>
              </label>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLiveQuizModal;