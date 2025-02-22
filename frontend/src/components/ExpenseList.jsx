import { PencilSquare, Trash } from 'react-bootstrap-icons';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.title}</td>
              <td>
                <span className="badge bg-primary">
                  {expense.category}
                </span>
              </td>
              <td className={expense.type === 'expense' ? 'text-danger' : 'text-success'}>
                ₹{Math.abs(expense.amount).toFixed(2)}
              </td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEdit(expense)}
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}