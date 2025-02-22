import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { CurrencyRupee, ArrowUpCircle, ArrowDownCircle, PieChart } from 'react-bootstrap-icons';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
);

export default function Dashboard({ user }) {
  const [showPieChart, setShowPieChart] = useState(false);
  const [transactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );

  // Calculate totals
  const incomeData = transactions.filter(t => t.type === 'income');
  const expenseData = transactions.filter(t => t.type === 'expense');
  const totalIncome = incomeData.reduce((a, b) => a + b.amount, 0);
  const totalExpenses = expenseData.reduce((a, b) => a + b.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  // Line Chart Data
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

  // Pie Chart Data
  const pieData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [totalIncome, totalExpenses],
      backgroundColor: ['#4CAF50', '#F44336'],
      hoverOffset: 10
    }]
  };

  // Bar Chart Data
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [65000, 59000, 80000, 81000, 56000, 55000],
        backgroundColor: '#4CAF50',
        borderRadius: 5
      },
      {
        label: 'Expenses',
        data: [45000, 49000, 60000, 51000, 46000, 45000],
        backgroundColor: '#F44336',
        borderRadius: 5
      }
    ]
  };
  

  return (
    <div className="dashboard">
      <div className="dashboard-header mb-4">
        <h2 className="text-primary">Financial Overview</h2>
        <Button 
          variant="outline-primary" 
          onClick={() => setShowPieChart(!showPieChart)}
          className="rounded-pill"
        >
          <PieChart className="me-2" />
          {showPieChart ? 'Hide' : 'Show'} Breakdown
        </Button>
      </div>

      <Row className="g-4 mb-4">
        {/* Income Card */}
        <Col md={4}>
          <Card className="h-100 shadow-sm gradient-income animate__animated animate__fadeInLeft">
            <Card.Body>
              <div className="d-flex align-items-center">
                <ArrowUpCircle size={40} className="me-3" />
                <div>
                  <h6 className="text-light mb-1">Total Income</h6>
                  <h3 className="mb-0 text-light">₹{totalIncome.toLocaleString()}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Expenses Card */}
        <Col md={4}>
          <Card className="h-100 shadow-sm gradient-expense animate__animated animate__fadeInUp">
            <Card.Body>
              <div className="d-flex align-items-center">
                <ArrowDownCircle size={40} className="me-3" />
                <div>
                  <h6 className="text-light mb-1">Total Expenses</h6>
                  <h3 className="mb-0 text-light">₹{totalExpenses.toLocaleString()}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Balance Card */}
        <Col md={4}>
          <Card className="h-100 shadow-sm gradient-balance animate__animated animate__fadeInRight">
            <Card.Body>
              <div className="d-flex align-items-center">
                <CurrencyRupee size={40} className="me-3" />
                <div>
                  <h6 className="text-light mb-1">Current Balance</h6>
                  <h3 className="mb-0 text-light">₹{currentBalance.toLocaleString()}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Line Chart */}
      <Card className="mb-4 shadow animate__animated animate__fadeInUp">
        <Card.Body>
          <h5 className="mb-4 text-secondary">Financial Trends</h5>
          <div className="line-chart-container">
            <Line 
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          </div>
        </Card.Body>
      </Card>
    
    {/* Bar Chart */}
    <Card className="mb-4 shadow animate__animated animate__fadeInUp">
    <Card.Body>
    <h5 className="mb-4 text-secondary">Monthly Comparison</h5>
    <div className="bar-chart-container">
      <Bar 
        data={barChartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
            }
        }}
        />
    </div>
    </Card.Body>
    </Card>

      {/* Pie Chart */}
      {showPieChart && (
        <Card className="shadow animate__animated animate__fadeInUp">
          <Card.Body>
            <h5 className="mb-4 text-secondary">Financial Breakdown</h5>
            <div className="pie-container">
              <Pie 
                data={pieData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}