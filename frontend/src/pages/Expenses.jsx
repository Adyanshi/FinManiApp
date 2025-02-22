import { useState, useEffect } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

export default function Expenses() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (transaction) => {
    const newTransaction = { ...transaction, type: 'expense' };
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? newTransaction : t
      ));
    } else {
      setTransactions([...transactions, { ...newTransaction, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between mb-4">
        <h2>Expenses</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Expense
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <ExpenseList
                expenses={expenseTransactions}
                onEdit={setEditingTransaction}
                onDelete={handleDelete}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow h-100">
            <Card.Body>
              <h5 className="mb-4">Expense Breakdown</h5>
              <ExpenseChart expenses={expenseTransactions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ExpenseForm
        show={showForm || !!editingTransaction}
        onHide={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        expense={editingTransaction}
        defaultType="expense"
      />
    </div>
  );
}