import React, { useState } from 'react';

const QuizForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('MCQ');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      question,
      type,
      options,
      correctAnswer,
    };
    onSubmit(questionData);
    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setType('MCQ');
    setOptions(['', '']);
    setCorrectAnswer('');
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div>
        <label>Options:</label>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required={type === 'MCQ'}
            />
            <button type="button" onClick={() => handleRemoveOption(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddOption}>Add Option</button>
      </div>
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