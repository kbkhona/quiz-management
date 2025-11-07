require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const liveQuizRoutes = require('./routes/liveQuiz');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/api', authRoutes);      // register, login
app.use('/api/admin', adminRoutes); // admin actions (create quiz, approve admins)
app.use('/api', publicRoutes);    // public: quiz-list, get quiz, submit
app.use('/api/live', liveQuizRoutes); // live quiz management

app.get('/', (req, res) => res.send('Quiz Management API is running'));

// Socket.io configuration
require('./socket/liveQuizSocket')(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
