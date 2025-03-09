import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Envelope, Lock } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    // Basic client-side validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
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
                name="email"  // Ensure name attribute exists
                required
              />
            </div>
    
            <div className="mb-4 position-relative">
              <Lock className="input-group-icon" />
              <input
                type="password"
                className="form-control ps-5"
                placeholder="Password"
                name="password"  // Ensure name attribute exists
                required
              />
            </div>
    
            <button 
              type="submit" 
              className="btn-auth mb-4"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
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