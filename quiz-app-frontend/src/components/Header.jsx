import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header" style={{ 
      padding: '1rem',
      borderBottom: '1px solid #eee',
      marginBottom: '1rem'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="logo">
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            Quiz App
          </Link>
        </div>

        <nav>
          <ul style={{ 
            display: 'flex',
            gap: '1rem',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {/* Always show Quiz List */}
            <li>
              <Link to="/quiz">View Quizzes</Link>
            </li>

            {user ? (
              <>
                {/* Show Admin link only for admins */}
                {user.userType === 'admin' && (
                  <li>
                    <Link to="/admin">Create Quiz</Link>
                  </li>
                )}
                {/* Show logout for any logged in user */}
                <li>
                  <button 
                    onClick={logout}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/">Login / Register</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;