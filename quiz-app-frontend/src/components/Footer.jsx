import React from 'react';
// import './Footer.css'; // Assuming you want to add styles for the footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Quiz Management System. All rights reserved.</p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;