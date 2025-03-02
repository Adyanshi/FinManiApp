import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Income() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const incomeTransactions = transactions.filter(t => t.type === 'income');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (transaction) => {
    const newTransaction = { ...transaction, type: 'income' };
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
    if (window.confirm('Are you sure you want to delete this income?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between mb-4">
        <h2>Income</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Income
        </Button>
      </div>

      <Card className="glass-card shadow">
        <Card.Body>
          <ExpenseList
            expenses={incomeTransactions}
            onEdit={setEditingTransaction}
            onDelete={handleDelete}
          />
        </Card.Body>
      </Card>

      <ExpenseForm
        show={showForm || !!editingTransaction}
        onHide={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        expense={editingTransaction}
        defaultType="income"
      />
    </div>
  );
}