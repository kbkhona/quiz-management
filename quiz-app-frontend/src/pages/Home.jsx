import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
	const { login, register } = useContext(AuthContext);

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
			const resp = await register({ username: rUsername, password: rPassword, isAdmin: rIsAdmin });
			setRegisterMsg(resp.message || 'Registered successfully. Please log in.');
			setRUsername('');
			setRPassword('');
			setRIsAdmin(false);
		} catch (err) {
			setRegisterError(err.response?.data?.message || err.message || 'Registration failed');
		}
	};

	return (
		<div className="container" style={{ padding: 20 }}>
			<div style={{ marginBottom: 20, textAlign: 'center' }}>
				<h1>Welcome to Quiz App</h1>
				<p>
					<Link to="/quiz" className="button">View Available Quizzes</Link>
				</p>
			</div>
			<div style={{ display: 'flex', gap: 40 }}>
				<div style={{ flex: 1 }} className="card">
					<h2>Login</h2>
					{loginError && <p style={{ color: 'red' }}>{loginError}</p>}
					<form onSubmit={handleLogin}>
						<div>
							<label>Username</label>
							<input value={lUsername} onChange={(e) => setLUsername(e.target.value)} required />
						</div>
						<div>
							<label>Password</label>
							<input type="password" value={lPassword} onChange={(e) => setLPassword(e.target.value)} required />
						</div>
						<button type="submit" className="button button-primary">Login</button>
					</form>
				</div>

				<div style={{ flex: 1 }} className="card">
					<h2>Register</h2>
					{registerMsg && <p style={{ color: 'green' }}>{registerMsg}</p>}
					{registerError && <p style={{ color: 'red' }}>{registerError}</p>}
					<form onSubmit={handleRegister}>
						<div>
							<label>Username</label>
							<input value={rUsername} onChange={(e) => setRUsername(e.target.value)} required />
						</div>
						<div>
							<label>Password</label>
							<input type="password" value={rPassword} onChange={(e) => setRPassword(e.target.value)} required />
						</div>
						<div>
							<label>
								<input type="checkbox" checked={rIsAdmin} onChange={(e) => setRIsAdmin(e.target.checked)} />
								Request admin access
							</label>
						</div>
						<button type="submit" className="button">Register</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Home;
