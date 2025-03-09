import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Person, Envelope, Lock } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await apiClient.post('/auth/signup', {
      name,
      email,
      password
    });
    console.log('Registration Response:', response.data); // Log the response
    localStorage.setItem('token', response.data.accessToken); // Store access token
    setUser(response.data.user); // Update user state
    navigate('/dashboard'); // Redirect to dashboard
  } catch (err) {
    console.error('Registration Error:', err.response?.data); // Log the error
    setError(err.response?.data?.message || 'Registration failed');
  }
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