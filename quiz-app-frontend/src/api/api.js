import axios from 'axios';

// Build API URL from Vite env vars if present. Prefer VITE_API_URL, else compose from host/port/base.
const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_HOST || 'http://localhost'}:${import.meta.env.VITE_API_PORT || '4000'}${import.meta.env.VITE_API_BASE_PATH || '/api'}`;

// publicApi: for unauthenticated calls (register, login)
const publicApi = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

// authApi: attaches Authorization header automatically when token present
const authApi = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
authApi.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

// Function to register a new user (use publicApi so no auth header is attached)
export const registerUser = async (userData) => {
  const response = await publicApi.post(`/register`, userData);
  return response.data;
};

// Function to log in a user (use publicApi)
export const loginUser = async (credentials) => {
  const response = await publicApi.post(`/login`, credentials);
  return response.data;
};

// Function to fetch the list of quizzes (use authApi so token is attached when present)
export const fetchQuizzes = async () => {
  const response = await authApi.get(`/quiz-list`);
  return response.data.quizzes;
};

// Function to fetch a specific quiz by ID
export const fetchQuizById = async (quizId) => {
  console.log("Fetching quiz with ID:", quizId);
  const response = await authApi.get(`/quiz/${quizId}`);
  console.log("Fetched quiz data:", response.data);
  return response.data.quiz;
};

// Function to submit quiz answers
export const submitQuiz = async (quizData) => {
  console.log("Submitting quiz data:", quizData);
  const response = await authApi.post(`/submit-quiz`, quizData);
  console.log("Submission response:", response.data);
  return response.data;
};

// Admin: register a quiz (requires Authorization header)
export const adminRegisterQuiz = async (quizPayload) => {
  const response = await authApi.post(`/admin/register-quiz`, quizPayload);
  return response.data;
};

export { publicApi, authApi };
export default authApi;