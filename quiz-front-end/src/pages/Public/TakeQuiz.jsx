import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuiz } from '../../services/api';
import QuizForm from '../../components/QuizForm';

const TakeQuiz = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getQuiz = async () => {
            try {
                const data = await fetchQuiz(quizId);
                setQuiz(data);
            } catch (err) {
                setError('Failed to fetch quiz');
            } finally {
                setLoading(false);
            }
        };

        getQuiz();
    }, [quizId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!quiz) return <div>No quiz found</div>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <QuizForm questions={quiz.questions} />
        </div>
    );
};

export default TakeQuiz;