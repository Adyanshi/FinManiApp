import { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement, 
    PointElement, 
    LineElement 
} from 'chart.js';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { getMonthlySummary, getCategorySpending } from '../api/analytics';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    ArcElement, PointElement, LineElement
);

const Dashboard = () => {
    const { user } = useAuth();
    const [showBreakdown, setShowBreakdown] = useState(false);
    
    const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
        queryKey: ['analytics', 'monthly'],
        queryFn: getMonthlySummary
    });


    const { data: categoryData, isLoading: categoryLoading } = useQuery({
        queryKey: ['analytics', 'category'],
        queryFn: getCategorySpending
    });


    // Process data for charts
    const lineChartData = {
        labels: monthlyData?.map(item => `Month ${item._id}`) || [],
        datasets: [
            {
                label: 'Income',
                data: monthlyData?.map(item => item.totalIncome) || [],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Expenses',
                data: monthlyData?.map(item => item.totalExpenses) || [],
                borderColor: '#F44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const pieChartData = {
        labels: categoryData?.map(item => item.category) || [],
        datasets: [{
            data: categoryData?.map(item => item.total) || [],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#E7E9ED'
            ]
        }]
    };

    return (
        <div className="dashboard">
            <Row className="g-4 mb-4">
                <Col md={4}>
                    <Card className="glass-card shadow-sm bg-success text-white">
                        <Card.Body className="d-flex align-items-center">
                            <div>
                                <h6 className="mb-1">Total Income</h6>
                                <h3 className="mb-0">
                                    {user?.currency || '₹'}{monthlyData?.reduce((sum, m) => sum + m.totalIncome, 0).toLocaleString() || '0'}
                                </h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm bg-danger text-white">
                        <Card.Body className="d-flex align-items-center">
                            <div>
                                <h6 className="mb-1">Total Expenses</h6>
                                <h3 className="mb-0">
                                    {user?.currency || '₹'}{monthlyData?.reduce((sum, m) => sum + m.totalExpenses, 0).toLocaleString() || '0'}
                                </h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm bg-primary text-white">
                        <Card.Body className="d-flex align-items-center">
                            <div>
                                <h6 className="mb-1">Current Balance</h6>
                                <h3 className="mb-0">
                                    {user?.currency || '₹'}{(
                                        (monthlyData?.reduce((sum, m) => sum + m.totalIncome, 0) || 0) - 
                                        (monthlyData?.reduce((sum, m) => sum + m.totalExpenses, 0) || 0)
                                    ).toLocaleString()}
                                </h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4 shadow">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5>Financial Trends</h5>
                        <Button 
                            variant="outline-primary"
                            onClick={() => setShowBreakdown(!showBreakdown)}
                            className="rounded-pill"
                        >
                            {showBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
                        </Button>
                    </div>
                    
                    <div className="chart-container" style={{ height: '300px' }}>
                        <Line data={lineChartData} options={{ responsive: true }} />
                    </div>

                    {showBreakdown && (
                        <Row className="g-4 mt-4">
                            <Col md={6}>
                                <Card className="h-100 shadow">
                                    <Card.Body>
                                        <h5 className="mb-4">Category Breakdown</h5>
                                        <div className="pie-container">
                                            <Pie 
                                                data={pieChartData}
                                                options={{
                                                    plugins: {
                                                        legend: { position: 'bottom' }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;
