import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  return (
    <div className="quiz-card">
      <div>
        <h3>{quiz.title}</h3>
        <div className="quiz-meta">
          <p>Created by: {quiz.author}</p>
          <p>Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <Link to={`/quiz/${quiz._id}`} className="button button-primary">
        Take Quiz
      </Link>
    </div>
  );
};

export default QuizCard;