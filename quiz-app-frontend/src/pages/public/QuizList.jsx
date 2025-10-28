import React, { useEffect, useState } from 'react';
// import { fetchQuizzes } from '../../api/api';
// import QuizCard from '../../components/QuizCard';
// import './QuizList.css'; // Assuming you want to add specific styles for this component

const QuizList = () => {
  // const [quizzes, setQuizzes] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const getQuizzes = async () => {
  //     try {
  //       const data = await fetchQuizzes();
  //       setQuizzes(data.quizzes);
  //     } catch (err) {
  //       setError('Failed to fetch quizzes');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getQuizzes();
  // }, []);

  // if (loading) return <div>Loading quizzes...</div>;
  // if (error) return <div>{error}</div>;

  return (
    <div className="quiz-list">
      <h1>Available Quizzes</h1>
      {/* <div className="quiz-cards">
        {quizzes.map(quiz => (
          <QuizCard key={quiz._id} quiz={quiz} />
        ))}
      </div> */}
    </div>
  );
};

export default QuizList;