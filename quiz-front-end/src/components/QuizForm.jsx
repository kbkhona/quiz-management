import React, { useState } from 'react';

const QuizForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', type: 'MCQ', options: ['', ''] }]);

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index][event.target.name] = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', type: 'MCQ', options: ['', ''] }]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ title, questions });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Quiz Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            {questions.map((q, index) => (
                <div key={index}>
                    <label>Question:</label>
                    <input
                        type="text"
                        name="question"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(index, e)}
                        required
                    />
                    <label>Type:</label>
                    <select
                        name="type"
                        value={q.type}
                        onChange={(e) => handleQuestionChange(index, e)}
                    >
                        <option value="MCQ">MCQ</option>
                        <option value="text">Text</option>
                        <option value="Boolean">Boolean</option>
                    </select>
                    {q.type === 'MCQ' && (
                        <div>
                            <label>Options:</label>
                            {q.options.map((option, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, i, e)}
                                    required
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button type="button" onClick={addQuestion}>Add Question</button>
            <button type="submit">Submit Quiz</button>
        </form>
    );
};

export default QuizForm;