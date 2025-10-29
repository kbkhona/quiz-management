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
    <div style={{ padding: 20 }}>
      <h1>Create Quiz</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Quiz Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter quiz title" />
      </div>

      <h2>Add Question</h2>
      <QuizForm onSubmit={handleAddQuestion} />

      <h3>Questions ({questions.length})</h3>
      <ul>
        {questions.map((q, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <strong>{i + 1}. {q.question}</strong> <em>({q.type})</em>
            <div>Points: {q.points || 1}</div>
            {q.type === 'MCQ' && (
              <div>
                Options: {Array.isArray(q.options) ? q.options.join(', ') : ''}
              </div>
            )}
            <div>
              <button onClick={() => handleRemoveQuestion(i)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSubmitQuiz} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Quiz'}</button>
      </div>
    </div>
  );
};

export default AdminQuiz;
