import React, { useState } from 'react';
import QuizForm from '../../components/QuizForm';

const CreateQuiz = () => {
    const [quizData, setQuizData] = useState({
        title: '',
        questions: []
    });

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        // Logic to submit quizData to the backend
    };

    return (
        <div>
            <h1>Create a New Quiz</h1>
            <QuizForm quizData={quizData} setQuizData={setQuizData} onSubmit={handleQuizSubmit} />
        </div>
    );
};

export default CreateQuiz;