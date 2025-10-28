// src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL as needed

// User authentication
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

// Quiz management
export const createQuiz = async (quizData) => {
    const response = await axios.post(`${API_URL}/register-quiz`, quizData);
    return response.data;
};

export const getQuizList = async () => {
    const response = await axios.get(`${API_URL}/quiz-list`);
    return response.data;
};

export const getQuizById = async (quizId) => {
    const response = await axios.get(`${API_URL}/quiz/${quizId}`);
    return response.data;
};

export const submitQuiz = async (quizData) => {
    const response = await axios.post(`${API_URL}/submit-quiz`, quizData);
    return response.data;
};