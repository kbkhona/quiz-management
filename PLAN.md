

# Initial Blueprint
# Back-end --

## Routes --
## -- Register/Login
    -- POST api/register (username: string(90), password(string(12)), isAdmin:Boolean)
        isAdmin(approval system)
        password (hashed)
    -- POST api/login (username, password)
        jwt

## -- Admin (Quiz creation)
    -- POST api/register-quiz (title, data: [{
        question: 
        type: MCQ || text || Boolean
        options: []
        }],
        author: registeredAdmin
        correct-answer : (blank)
    )

## -- Public (Take Quiz)
    -- Get quiz-list ()
    -- GET quiz(title/_id)
    -- POST api/submit-quiz (title, takenBy: registeredUser, answers: same as data with answer filed instead of correct-answer)




# Front-end -- 

## Views --
    -- Register/Login
        
    -- Admin (Quiz creation)
        -- create question functionality with answer type (MCQ, text, Boolean)

    -- Public (Take Quiz)
        -- Select Quiz to take
        -- take quiz page


---

# Documentation

## Setup & Installation

### Prerequisites
- Node.js >= 16
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
```bash
cd quiz-back-end
npm install
```

Create a `.env` file in the `quiz-back-end` directory:
```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
PORT=5000
```

**Run Backend:**
```bash
npm run dev          # development with nodemon
npm start            # production
```

Backend will run on `http://localhost:5000`

### Frontend Setup
```bash
cd quiz-app-frontend
npm install
```

**Run Frontend:**
```bash
npm run dev          # development server
npm run build        # production build
```

Frontend will run on `http://localhost:5173` (Vite default)

---

## Database Schemas

### User Schema
- `username` (String, unique, max 90 chars) - user identifier
- `password` (String) - bcrypt hashed
- `isAdmin` (Boolean) - true if approved admin
- `isPendingAdmin` (Boolean) - true if requested admin privileges
- `createdAt` (Date) - account creation timestamp

### Quiz Schema
- `title` (String, unique) - quiz name
- `questions` (Array)
  - `question` (String) - question text
  - `type` (String) - "MCQ" | "text" | "boolean"
  - `options` (Object) - only for MCQ {a, b, c}
  - `correctAnswer` (String) - stored but not sent publicly
  - `points` (Number, default: 1)
- `author` (ObjectId) - reference to User
- `createdAt` (Date)

### Attempt Schema
- `quiz` (ObjectId) - reference to Quiz
- `takenByUser` (ObjectId) - reference to User (null for guests)
- `takenByName` (String) - fallback for guest name
- `answers` (Array) - {questionIndex, answer}
- `score` (Number) - points earned
- `total` (Number) - total possible points
- `createdAt` (Date)

---

## API Routes

### Authentication (`/api`)
- `POST /register` - Register new user (optional admin request)
- `POST /login` - Login, returns JWT token

### Admin Routes (`/api/admin`, requires auth + admin role)
- `POST /register-quiz` - Create a new quiz
- `GET /pending-admins` - View pending admin requests
- `POST /approve-admin` - Approve admin user

### Public Routes (`/api`)
- `GET /quiz-list` - Get all quiz titles
- `GET /quiz/:id` - Get quiz details (without answers)
- `POST /submit-quiz` - Submit quiz attempt, get score

---

## Frontend Pages

- **Login/Register** (`/auth/login`, `/auth/register`) - User authentication
- **Home** (`/`) - Dashboard/landing page
- **Quiz List** (`/public/quizzes`) - Browse available quizzes
- **Take Quiz** (`/public/quiz/:id`) - Take quiz interface
- **Admin Dashboard** (`/admin/quiz`) - Create/manage quizzes (protected)




