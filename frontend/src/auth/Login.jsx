import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Envelope, Lock } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth(); // Destructure login from AuthContext



  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault(); // Prevent default form submission

    try {
      await login({ email, password }); // Pass credentials to login



      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="mb-3">Login to Your Account</h2>
        </div>

        <div className="card-body p-4 pt-0">
          {error && <Alert variant="danger">{error}</Alert>}

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
              Login
            </button>

            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
