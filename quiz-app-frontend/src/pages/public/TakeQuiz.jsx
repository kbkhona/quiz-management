import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuizById, submitQuiz } from '../../api/api';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const q = await fetchQuizById(quizId);
        setQuiz(q);
        // initialize answers array with empty strings
        setAnswers(Array(q.questions.length).fill(''));
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    getQuiz();
  }, [quizId]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const answersPayload = answers.map((a, idx) => ({ questionIndex: idx, answer: a }));
      const res = await submitQuiz({ quizId, answers: answersPayload });
      setResult(res);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  if (result) {
    return (
      <div className="quiz-page">
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <div className="score-display">
            Score: {result.score} / {result.total}
          </div>
          <h3>Detailed Results</h3>
          <ul className="result-details">
            {result.details && result.details.map((d, i) => (
              <li key={i} className={`result-item ${d.correct ? 'correct' : 'incorrect'}`}>
                <strong>Question {d.questionIndex + 1}</strong>
                <div>{d.correct === null ? 'Not graded' : (d.correct ? '✅ Correct' : '❌ Wrong')}</div>
                <div className="answer-details">
                  {d.correctAnswer != null && <div>Correct answer: {d.correctAnswer}</div>}
                  <div>Your answer: {d.givenAnswer}</div>
                  <div>Points earned: {d.pointsEarned}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page take-quiz">
      <h1>{quiz.title}</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="question-section">
            <div className="question-text">
              <strong>{idx + 1}. {q.question}</strong>
              <em> ({q.type})</em>
            </div>
            {q.type === 'MCQ' && (
              <div className="options-group">
                {Object.keys(q.options).map((opt, oi) => (
                  <div key={oi} className="option-item">
                    <input
                      type="radio"
                      id={`q${idx}-opt${oi}`}
                      name={`q-${idx}`}
                      value={q.options[opt]}
                      checked={answers[idx] === q.options[opt]}
                      onChange={() => handleAnswerChange(idx, q.options[opt])}
                    />
                    <label htmlFor={`q${idx}-opt${oi}`}>{q.options[opt]}</label>
                  </div>
                ))}
              </div>
            )}
            {q.type === 'boolean' && (
              <div className="options-group">
                <div className="option-item">
                  <input
                    type="radio"
                    id={`q${idx}-true`}
                    name={`q-${idx}`}
                    value="true"
                    checked={answers[idx] === 'true'}
                    onChange={() => handleAnswerChange(idx, 'true')}
                  />
                  <label htmlFor={`q${idx}-true`}>True</label>
                </div>
                <div className="option-item">
                  <input
                    type="radio"
                    id={`q${idx}-false`}
                    name={`q-${idx}`}
                    value="false"
                    checked={answers[idx] === 'false'}
                    onChange={() => handleAnswerChange(idx, 'false')}
                  />
                  <label htmlFor={`q${idx}-false`}>False</label>
                </div>
              </div>
            )}
            {q.type === 'text' && (
              <div className="form-group">
                <input
                  type="text"
                  value={answers[idx] || ''}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder="Type your answer here"
                />
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button 
            type="submit" 
            className="button button-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeQuiz;