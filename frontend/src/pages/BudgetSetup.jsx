import { useState, useEffect } from 'react';
import { Alert, Button, Form, Row, Col } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBudget } from '../api/budgets';
import { getCategories } from '../api/categories';
import { useAuth } from '../context/AuthContext';

export default function BudgetSetup({ onComplete }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [error, setError] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [allocations, setAllocations] = useState({});
    
    // Fetch user's categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    // Initialize allocations when categories load
    useEffect(() => {
        if (categories.length > 0) {
            const initialAllocations = categories.reduce((acc, category) => {
                acc[category._id] = '';
                return acc;
            }, {});
            setAllocations(initialAllocations);
        }
    }, [categories]);

    const mutation = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries(['budgets']);
            onComplete();
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to set budget');
        }
    });

    const handleAllocationChange = (categoryId, value) => {
        setAllocations(prev => ({
            ...prev,
            [categoryId]: value
        }));
    };

    const validateAllocations = () => {
        const allocatedSum = Object.values(allocations).reduce((sum, val) => {
            const num = parseFloat(val) || 0;
            return sum + num;
        }, 0);

        if (allocatedSum > totalBudget) {
            setError('Category allocations exceed total budget');
            return false;
        }

        if (allocatedSum < totalBudget) {
            setError('Please allocate the entire budget');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!totalBudget || isNaN(totalBudget)) {
            setError('Please enter a valid budget amount');
            return;
        }

        if (!validateAllocations()) return;

        const budgetData = {
            amount: parseFloat(totalBudget),
            categories: Object.entries(allocations)
                .filter(([_, value]) => value && !isNaN(value))
                .map(([categoryId, allocated]) => ({
                    category: categoryId,
                    allocated: parseFloat(allocated)
                }))
        };

        mutation.mutate(budgetData);
    };

    return (
        <div className="auth-page">
            <div className="card shadow-lg p-4" style={{ maxWidth: '800px', margin: '2rem auto' }}>
                <h2 className="text-center mb-4">Welcome {user?.name}! Set Your Monthly Budget</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Form.Label>Total Monthly Budget ({user?.currency || '₹'})</Form.Label>
                        <Form.Control
                            type="number"
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(e.target.value)}
                            required
                            min="1"
                            step="0.01"
                        />
                    </div>

                    <div className="mb-4">
                        <h5>Allocate Budget to Categories</h5>
                        <Row className="g-3">
                            {categories.map(category => (
                                <Col md={6} key={category._id}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="flex-grow-1">
                                            <Form.Label>{category.name}</Form.Label>
                                        </div>
                                        <div style={{ width: '120px' }}>
                                            <Form.Control
                                                type="number"
                                                value={allocations[category._id] || ''}
                                                onChange={(e) => 
                                                    handleAllocationChange(category._id, e.target.value)
                                                }
                                                min="0"
                                                step="0.01"
                                                placeholder="Amount"
                                            />
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-100"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Setting Budget...' : 'Save Budget'}
                    </Button>
                </Form>
            </div>
        </div>
    );
}