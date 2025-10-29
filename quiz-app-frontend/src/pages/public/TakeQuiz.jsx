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
      <div style={{ padding: 20 }}>
        <h2>Result</h2>
        <p>Score: {result.score} / {result.total}</p>
        <h3>Details</h3>
        <ul>
          {result.details && result.details.map((d, i) => (
            <li key={i}>
              Q{d.questionIndex}: {d.correct === null ? 'Not graded' : (d.correct ? 'Correct' : 'Wrong')}
              {d.correctAnswer != null && <div>Correct answer: {d.correctAnswer}</div>}
              <div>Your answer: {d.givenAnswer}</div>
              <div>Points earned: {d.pointsEarned}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{quiz.title}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <div><strong>{idx + 1}. {q.question}</strong> <em>({q.type})</em></div>
            {q.type === 'MCQ' && (
              <div>
                {Object.keys(q.options).map((opt, oi) => (
                  <label key={oi} style={{ display: 'block' }}>
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      value={q.options[opt]}
                      checked={answers[idx] === q.options[opt]}
                      onChange={() => handleAnswerChange(idx, q.options[opt])}
                    /> {q.options[opt]}
                  </label>
                ))}
              </div>
            )}
            {q.type === 'boolean' && (
              <div>
                <label>
                  <input type="radio" name={`q-${idx}`} value="true" checked={answers[idx] === 'true'} onChange={() => handleAnswerChange(idx, 'true')} /> True
                </label>
                <label style={{ marginLeft: 8 }}>
                  <input type="radio" name={`q-${idx}`} value="false" checked={answers[idx] === 'false'} onChange={() => handleAnswerChange(idx, 'false')} /> False
                </label>
              </div>
            )}
            {q.type === 'text' && (
              <div>
                <input type="text" value={answers[idx] || ''} onChange={(e) => handleAnswerChange(idx, e.target.value)} />
              </div>
            )}
          </div>
        ))}

        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Quiz'}</button>
      </form>
    </div>
  );
};

export default TakeQuiz;