import React, { useEffect, useState } from 'react';
import { fetchQuizzes } from '../../api/api';
import QuizCard from '../../components/QuizCard';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    getQuizzes();
  }, []);

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div>{error}</div>;

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="quiz-list">
        <h1>Available Quizzes</h1>
        <p>No quizzes available.</p>
      </div>
    );
  }

  return (
    <div className="quiz-list">
      <h1>Available Quizzes</h1>
      <div className="quiz-cards">
        {quizzes.map(quiz => (
          <QuizCard key={quiz._id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

export default QuizList;