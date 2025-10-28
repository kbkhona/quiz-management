# Quiz Management System

This is a Quiz Management System built with React. It allows users to register, log in, create quizzes, and take quizzes. The application is structured into different pages for authentication, admin functionalities, and public access.

## Project Structure

```
quiz-management-system-frontend
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── index.jsx           # Entry point of the React application
│   ├── App.jsx             # Main App component
│   ├── routes
│   │   └── AppRouter.jsx   # Routing setup for the application
│   ├── pages
│   │   ├── Auth
│   │   │   ├── Login.jsx   # Login page component
│   │   │   └── Register.jsx # Registration page component
│   │   ├── Admin
│   │   │   ├── AdminDashboard.jsx # Admin dashboard component
│   │   │   └── CreateQuiz.jsx     # Quiz creation component
│   │   └── Public
│   │       ├── QuizList.jsx # List of available quizzes
│   │       └── TakeQuiz.jsx  # Component for taking a quiz
│   ├── components
│   │   ├── QuizForm.jsx      # Component for quiz forms
│   │   ├── QuestionEditor.jsx # Component for editing questions
│   │   ├── QuizCard.jsx      # Component for displaying quiz information
│   │   └── ProtectedRoute.jsx # Component for protecting routes
│   ├── services
│   │   └── api.js           # API service for backend communication
│   ├── contexts
│   │   └── AuthContext.jsx   # Context for authentication state
│   ├── hooks
│   │   └── useFetch.js       # Custom hook for fetching data
│   └── styles
│       └── index.css         # Global styles
├── .gitignore                # Git ignore file
├── package.json              # NPM configuration file
└── README.md                 # Project documentation
```

## Getting Started

To get started with the Quiz Management System, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd quiz-management-system-frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Features

- User authentication (registration and login)
- Admin panel for creating and managing quizzes
- Public interface for users to take quizzes
- Responsive design and user-friendly interface

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.