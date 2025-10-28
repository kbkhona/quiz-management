require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/api', authRoutes);      // register, login
app.use('/api/admin', adminRoutes); // admin actions (create quiz, approve admins)
app.use('/api', publicRoutes);    // public: quiz-list, get quiz, submit

app.get('/', (req, res) => res.send('Quiz Management API is running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
