import { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';

export default function BudgetSetup({ user, onComplete }) {
    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!budget || isNaN(budget)) {
        setError('Please enter a valid budget amount');
        return;
    }
    
    const updatedUser = { ...user, budget: parseFloat(budget) };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onComplete();
};

return (
    <div className="auth-page">
        <div className="card shadow-lg p-4" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <h2 className="text-center mb-4">Welcome {user?.name}! Set Your Monthly Budget</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">Monthly Budget ($)</label>
            <input
                type="number"
                className="form-control"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                step="0.01"
            />
            </div>
            <Button type="submit" variant="primary" className="w-100">
            Set Budget
            </Button>
        </form>
        </div>
    </div>
    );
}