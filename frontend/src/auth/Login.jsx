import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Envelope, Lock } from 'react-bootstrap-icons';

export default function Login({onLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
    
        if (user) {
          onLogin(user); // Ensure onLogin is called with user data
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
            <div className="auth-header">
                <h2 className="mb-3">Welcome Back! 👋</h2>
                <p className="text-muted">Please sign in to continue</p>
            </div>
            
            <div className="card-body p-4 pt-0">
                {error && <Alert variant="danger" className="animated fadeIn">{error}</Alert>}

                <form onSubmit={handleSubmit}>
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
                    Sign In
                </button>
    
                <div className="text-center">
                    <span className="text-muted">New user? </span>
                    <Link to="/register" className="auth-link">
                    Create an account
                    </Link>
                </div>
                </form>
            </div>
            </div>
        </div>
    );
}