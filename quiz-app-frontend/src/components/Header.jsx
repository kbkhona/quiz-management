import React from 'react';
import { Link } from 'react-router-dom';
// import './Header.css'; // Assuming you will create a Header.css for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Quiz App</Link>
      </div>
      {/* <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>
            <Link to="/quizzes">Quizzes</Link>
          </li>
        </ul>
      </nav> */}
    </header>
  );
};

export default Header;