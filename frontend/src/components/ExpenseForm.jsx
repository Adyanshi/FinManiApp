import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from 'react-bootstrap';

export default function ExpenseForm({ show, onHide, onSubmit, expense }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date(),
    description: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        date: new Date(expense.date)
      });
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString()
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {expense ? 'Edit Transaction' : 'Add New Transaction'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="col-md-6">
            <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Date</label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                className="form-control"
                dateFormat="MM/dd/yyyy"
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                {expense ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}