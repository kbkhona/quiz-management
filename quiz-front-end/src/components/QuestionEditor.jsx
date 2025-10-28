import React, { useState } from 'react';

const QuestionEditor = ({ question, onUpdate, onDelete }) => {
    const [updatedQuestion, setUpdatedQuestion] = useState(question.question);
    const [updatedType, setUpdatedType] = useState(question.type);
    const [updatedOptions, setUpdatedOptions] = useState(question.options || []);

    const handleUpdate = () => {
        onUpdate({ ...question, question: updatedQuestion, type: updatedType, options: updatedOptions });
    };

    const handleDelete = () => {
        onDelete(question.id);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...updatedOptions];
        newOptions[index] = value;
        setUpdatedOptions(newOptions);
    };

    const addOption = () => {
        setUpdatedOptions([...updatedOptions, '']);
    };

    return (
        <div className="question-editor">
            <input
                type="text"
                value={updatedQuestion}
                onChange={(e) => setUpdatedQuestion(e.target.value)}
                placeholder="Question"
            />
            <select value={updatedType} onChange={(e) => setUpdatedType(e.target.value)}>
                <option value="MCQ">Multiple Choice</option>
                <option value="text">Text</option>
                <option value="Boolean">Boolean</option>
            </select>
            {updatedType === 'MCQ' && (
                <div>
                    {updatedOptions.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                        />
                    ))}
                    <button onClick={addOption}>Add Option</button>
                </div>
            )}
            <button onClick={handleUpdate}>Update Question</button>
            <button onClick={handleDelete}>Delete Question</button>
        </div>
    );
};

export default QuestionEditor;