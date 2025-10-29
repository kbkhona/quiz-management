import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
	const { login, register, user } = useContext(AuthContext);

	// Login form state
	const [lUsername, setLUsername] = useState('');
	const [lPassword, setLPassword] = useState('');
	const [loginError, setLoginError] = useState(null);

	// Register form state
	const [rUsername, setRUsername] = useState('');
	const [rPassword, setRPassword] = useState('');
	const [rIsAdmin, setRIsAdmin] = useState(false);
	const [registerMsg, setRegisterMsg] = useState(null);
	const [registerError, setRegisterError] = useState(null);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoginError(null);
		try {
			await login({ username: lUsername, password: lPassword });
			// redirect handled inside AuthContext
		} catch (err) {
			setLoginError(err.response?.data?.message || err.message || 'Login failed');
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setRegisterError(null);
		setRegisterMsg(null);
		try {
			const resp = await register({ username: rUsername, password: rPassword, asAdmin: rIsAdmin });
			setRegisterMsg(resp.message || 'Registered successfully. Please log in.');
			setRUsername('');
			setRPassword('');
			setRIsAdmin(false);
		} catch (err) {
			setRegisterError(err.response?.data?.message || err.message || 'Registration failed');
		}
	};

	return (
		<div className="container home-container">
			<div className="welcome-section">
				<h1>Welcome to Quiz App{user ? `, ${user.username}!` : '!'}</h1>
				<p className="subtitle">Test your knowledge with our interactive quizzes</p>
				<div className="welcome-actions">
					<Link to="/quiz" className="button button-primary cta-button">
						View Available Quizzes
					</Link>
					{user?.userType === 'admin' && (
						<Link to="/admin" className="button button-secondary cta-button">
							Create New Quiz
						</Link>
					)}
				</div>
			</div>

			{!user && (
				<div className="auth-section">
					<div className="auth-card card">
						<h2>Login</h2>
						{loginError && <p className="error-message">{loginError}</p>}
						<form onSubmit={handleLogin} className="auth-form">
							<div className="form-group">
								<label>Username</label>
								<input 
									type="text"
									value={lUsername} 
									onChange={(e) => setLUsername(e.target.value)}
									placeholder="Enter your username"
									required 
								/>
							</div>
							<div className="form-group">
								<label>Password</label>
								<input 
									type="password" 
									value={lPassword} 
									onChange={(e) => setLPassword(e.target.value)}
									placeholder="Enter your password"
									required 
								/>
							</div>
							<button type="submit" className="button button-primary">
								Login
							</button>
						</form>
					</div>

					<div className="auth-card card">
						<h2>Register</h2>
						{registerMsg && <p className="success-message">{registerMsg}</p>}
						{registerError && <p className="error-message">{registerError}</p>}
						<form onSubmit={handleRegister} className="auth-form">
							<div className="form-group">
								<label>Username</label>
								<input 
									type="text"
									value={rUsername} 
									onChange={(e) => setRUsername(e.target.value)}
									placeholder="Choose a username"
									required 
								/>
							</div>
							<div className="form-group">
								<label>Password</label>
								<input 
									type="password" 
									value={rPassword} 
									onChange={(e) => setRPassword(e.target.value)}
									placeholder="Choose a password"
									required 
								/>
							</div>
							<div className="form-group checkbox-group">
								<label>
									<input 
										type="checkbox" 
										checked={rIsAdmin} 
										onChange={(e) => setRIsAdmin(e.target.checked)}
									/>
									<span>Request admin access</span>
								</label>
							</div>
							<button type="submit" className="button button-primary">
								Register
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
