import React from 'react';

const QuizCard = ({ quiz, onSelect }) => {
    return (
        <div className="quiz-card" onClick={() => onSelect(quiz)}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <button className="take-quiz-button">Take Quiz</button>
        </div>
    );
};

export default QuizCard;