import React, { useState } from 'react';
import QuizForm from '../../components/QuizForm';
import { adminRegisterQuiz } from '../../api/api';

const AdminQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddQuestion = (questionData) => {
    // ensure points present
    const q = { ...questionData, points: questionData.points || 1 };
    setQuestions((prev) => [...prev, q]);
    setMessage(null);
    setError(null);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitQuiz = async () => {
    setMessage(null);
    setError(null);
    if (!title.trim()) {
      setError('Quiz title is required');
      return;
    }
    if (!questions.length) {
      setError('Add at least one question');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { title, questions };
      const resp = await adminRegisterQuiz(payload);
      setMessage(resp.message || 'Quiz created');
      setTitle('');
      setQuestions([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="quiz-page">
      <div className="admin-quiz">
        <h1>Create Quiz</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="quiz-title-input">
          <label>Quiz Title</label>
          <input 
            type="text"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter quiz title"
            required 
          />
        </div>

        <h2>Add Question</h2>
        <QuizForm onSubmit={handleAddQuestion} />

        <h3>Questions ({questions.length})</h3>
        <ul className="question-list">
          {questions.map((q, i) => (
            <li key={i} className="question-item">
              <strong>{i + 1}. {q.question}</strong> 
              <em>({q.type})</em>
              <div className="question-meta">
                <div>Points: {q.points || 1}</div>
                {q.type === 'MCQ' && (
                  <div>
                    Options: {q.options ? ['a', 'b', 'c'].map((k) => q.options[k]).filter(Boolean).join(', ') : ''}
                  </div>
                )}
              </div>
              <button 
                className="remove-question"
                onClick={() => handleRemoveQuestion(i)}
                title="Remove question"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 24 }}>
          <button 
            className="button button-primary"
            onClick={handleSubmitQuiz} 
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQuiz;
