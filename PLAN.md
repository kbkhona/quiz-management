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




