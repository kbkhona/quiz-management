import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchQuizzes } from '../../services/api';
import QuizCard from '../../components/QuizCard';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getQuizzes = async () => {
            try {
                const data = await fetchQuizzes();
                setQuizzes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getQuizzes();
    }, []);

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Available Quizzes</h1>
            <div className="quiz-list">
                {quizzes.map(quiz => (
                    <Link key={quiz._id} to={`/take-quiz/${quiz._id}`}>
                        <QuizCard quiz={quiz} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuizList;