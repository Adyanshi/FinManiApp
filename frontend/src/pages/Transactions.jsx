import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Transactions() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (transaction) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? transaction : t
      ));
    } else {
      setTransactions([...transactions, { ...transaction, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between mb-4">
        <h2>All Transactions</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Transaction
        </Button>
      </div>

      <Card className=" glass-card shadow">
        <Card.Body>
          <ExpenseList
            expenses={transactions}
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
      />
    </div>
  );
}