import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  return (
    <div className="quiz-card">
      <h3>{quiz.title}</h3>
      <p>Created by: {quiz.author}</p>
      <p>Created at: {new Date(quiz.createdAt).toLocaleDateString()}</p>
      <Link to={`/quiz/${quiz._id}`} className="take-quiz-button">
        Take Quiz
      </Link>
    </div>
  );
};

export default QuizCard;