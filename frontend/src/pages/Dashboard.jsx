import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { CurrencyRupee, ArrowUpCircle, ArrowDownCircle, PieChart as PieIcon, XCircle } from 'react-bootstrap-icons';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement
);

const Dashboard = ({ user }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [transactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;

  // Process data for charts
  const processChartData = () => {
    const monthlyData = {};
    const categoryData = {};

    transactions.forEach(transaction => {
      // Monthly breakdown
      const month = new Date(transaction.date)
        .toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }

      // Category breakdown
      if (transaction.type === 'expense') {
        const category = transaction.category;
        categoryData[category] = (categoryData[category] || 0) + transaction.amount;
      }
    });

    return { monthlyData, categoryData };
  };

  const { monthlyData, categoryData } = processChartData();

  // Chart configurations
  const lineChartData = {
    labels: transactions.map(t => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Income',
        data: transactions.map(t => t.type === 'income' ? t.amount : null),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expenses',
        data: transactions.map(t => t.type === 'expense' ? t.amount : null),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map(m => m.income),
        backgroundColor: '#4CAF50',
        borderRadius: 5
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyData).map(m => m.expense),
        backgroundColor: '#F44336',
        borderRadius: 5
      }
    ]
  };

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#E7E9ED'
      ]
    }]
  };

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
        <Card className="glass-card shadow-sm bg-success text-white">
            <Card.Body className="d-flex align-items-center">
              <ArrowUpCircle size={30} className="me-3" />
              <div>
                <h6 className="mb-1">Total Income</h6>
                <h3 className="mb-0">₹{income.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm bg-danger text-white">
            <Card.Body className="d-flex align-items-center">
              <ArrowDownCircle size={30} className="me-3" />
              <div>
                <h6 className="mb-1">Total Expenses</h6>
                <h3 className="mb-0">₹{expenses.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex align-items-center">
              <CurrencyRupee size={30} className="me-3" />
              <div>
                <h6 className="mb-1">Current Balance</h6>
                <h3 className="mb-0">₹{balance.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart Section */}
      <Card className="mb-4 shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Financial Trends</h5>
            <Button 
              variant="outline-primary"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="rounded-pill"
            >
              {showBreakdown ? (
                <>
                  <XCircle className="me-2" />
                  Hide Breakdown
                </>
              ) : (
                <>
                  <PieIcon className="me-2" />
                  Show Breakdown
                </>
              )}
            </Button>
          </div>
          
          <div className="chart-container">
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>

          {showBreakdown && (
            <Row className="g-4 mt-4">
              <Col md={6}>
                <Card className="h-100 shadow">
                  <Card.Body>
                    <h5 className="mb-4">Monthly Comparison</h5>
                    <div className="chart-container">
                      <Bar data={barChartData} options={{ responsive: true }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 shadow">
                  <Card.Body>
                    <h5 className="mb-4">Category Breakdown</h5>
                    <div className="chart-container">
                      <Pie 
                        data={pieChartData}
                        options={{
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { font: { size: 12 } }
                            }
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