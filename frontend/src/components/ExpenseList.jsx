import { 
  PencilSquare, 
  Trash,
  Basket, 
  CarFront, 
  House, 
  Film, 
  Lightbulb, 
  HeartPulse,
  Cash
} from 'react-bootstrap-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '../api/transactions';

const CategoryIcon = ({ category }) => {
  const iconStyle = { width: '20px', marginRight: '8px' };
  
  switch(category.toLowerCase()) {
    case 'food':
      return <Basket style={iconStyle} />;
    case 'transport':
      return <CarFront style={iconStyle} />;
    case 'housing':
      return <House style={iconStyle} />;
    case 'entertainment':
      return <Film style={iconStyle} />;
    case 'utilities':
      return <Lightbulb style={iconStyle} />;
    case 'health':
      return <HeartPulse style={iconStyle} />;
    case 'income':
      return <Cash style={iconStyle} />;
    default:
      return <Basket style={iconStyle} />;
  }
};

export default function ExpenseList({ expenses, onEdit }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      mutation.mutate(id);
    }
  };
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle glass-table">
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
                <span className="d-flex align-items-center">
                  <CategoryIcon category={expense.category} />
                  {expense.category}
                </span>
              </td>
              <td className={expense.type === 'expense' ? 'text-danger' : 'text-success'}>
                ₹{Math.abs(expense.amount).toLocaleString()}
              </td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEdit(expense)}
                  aria-label="Edit"
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(expense._id)}
                  aria-label="Delete"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? <Spinner size="sm" /> : <Trash />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mutation.isError && (
        <div className="alert alert-danger mt-3">
          {mutation.error.response?.data?.message || 'Failed to delete transaction'}
        </div>
      )}
    </div>
  );
}