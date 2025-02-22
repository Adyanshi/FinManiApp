import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { Alert } from 'react-bootstrap';
import { Person, Envelope, Lock } from 'react-bootstrap-icons';

export default function Register({ onLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
        setError('Email already registered');
        return;
    }
    
    if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }

    const newUser = { name, email, password };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    onLogin(newUser);
};

return (
    <div className="auth-page">
        <div className="auth-card">
        <div className="auth-header">
            <h2 className="mb-3">Create Account 🚀</h2>
            <p className="text-muted">Start managing your finances today</p>
        </div>

        <div className="card-body p-4 pt-0">
            {error && <Alert variant="danger" className="animated fadeIn">{error}</Alert>}

            <form onSubmit={handleSubmit}>
            <div className="mb-4 position-relative">
                <Person className="input-group-icon" />
                <input
                type="text"
                className="form-control ps-5"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>

            <div className="mb-4 position-relative">
                <Envelope className="input-group-icon" />
                <input
                type="email"
                className="form-control ps-5"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="mb-4 position-relative">
                <Lock className="input-group-icon" />
                <input
                type="password"
                className="form-control ps-5"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            <button type="submit" className="btn-auth mb-4">
                Get Started
            </button>

            <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="auth-link">
                Login here
                </Link>
            </div>
            </form>
        </div>
        </div>
    </div>
    );
}