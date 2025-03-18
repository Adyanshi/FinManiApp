import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Dashboard from './pages/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import Layout from './components/Layout';
import BudgetSetup from './pages/BudgetSetup';
import Transactions from './pages/Transactions';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('user'));
    if (authUser?.email && localStorage.getItem('isAuthenticated')) {
      setUser(authUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (userData) => {
    await login(userData);
    navigate(userData.budget ? '/' : '/set-budget');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={
        <LoginPage isAuthenticated={isAuthenticated}>
          <Login onLogin={handleLogin} />
        </LoginPage>
      } />
      <Route path="/register" element={
        <RegisterPage isAuthenticated={isAuthenticated}>
          <Register onLogin={handleLogin} />
        </RegisterPage>
      } />
      <Route path="/set-budget" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <BudgetSetup user={user} onComplete={() => navigate('/')} />
        </ProtectedRoute>
      } />
      <Route path="/*" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expenses />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
const LoginPage = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const RegisterPage = ({ isAuthenticated, onLogin }) => {
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Register onLogin={onLogin} />;
};

export default () => (
  <Router>
    <App/>
  </Router>
);
