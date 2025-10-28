import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // Adjust the base URL as needed

// Function to register a new user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Function to log in a user
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Function to fetch the list of quizzes
export const fetchQuizzes = async () => {
  const response = await axios.get(`${API_URL}/quiz-list`);
  return response.data.quizzes;
};

// Function to fetch a specific quiz by ID
export const fetchQuizById = async (quizId) => {
  const response = await axios.get(`${API_URL}/quiz/${quizId}`);
  return response.data.quiz;
};

// Function to submit quiz answers
export const submitQuiz = async (quizData) => {
  const response = await axios.post(`${API_URL}/submit-quiz`, quizData);
  return response.data;
};