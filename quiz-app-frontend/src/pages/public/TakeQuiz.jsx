import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuizById, submitQuiz } from '../../api/api';
import QuizForm from '../../components/QuizForm';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId);
        setQuiz(data.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    getQuiz();
  }, [quizId]);

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answer;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await submitQuiz({ quizId, answers });
      console.log('Quiz submitted:', result);
      // Handle success (e.g., show score, redirect, etc.)
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        <QuizForm questions={quiz.questions} onAnswerChange={handleAnswerChange} />
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default TakeQuiz;