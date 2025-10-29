import React, { useState } from 'react';

const QuizForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('MCQ');
    const [options, setOptions] = useState(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // backend expects options as an object { a, b, c } for MCQ questions
    let optionsPayload = {};
    if (type === 'MCQ') {
      optionsPayload = {
        a: options[0] || '',
        b: options[1] || '',
        c: options[2] || ''
      };
    }

    const questionData = {
      question,
      type,
      options: optionsPayload,
      correctAnswer,
    };
    onSubmit(questionData);
    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setType('MCQ');
      setOptions(['', '', '']);
    setCorrectAnswer('');
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div>
        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="MCQ">Multiple Choice</option>
          <option value="boolean">True/False</option>
          <option value="text">Text</option>
        </select>
      </div>
      {type === 'MCQ' && (
        <div>
          <label>Options:</label>
          {options.map((option, index) => (
            <div className="option-row" key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <label>Correct Answer:</label>
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Question</button>
    </form>
  );
};

export default QuizForm;