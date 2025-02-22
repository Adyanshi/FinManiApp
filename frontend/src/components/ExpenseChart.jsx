import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {
  const categories = [...new Set(expenses.map(exp => exp.category))];
  const categoryTotals = categories.map(category => 
    expenses.filter(exp => exp.category === category)
           .reduce((sum, exp) => sum + exp.amount, 0)
  );

  const data = {
    labels: categories,
    datasets: [{
      data: categoryTotals,
      backgroundColor: [
        '#4a90e2', '#50b83c', '#f49342', '#f85656', '#9c6ade',
        '#00bcd4', '#8bc34a', '#ff9800', '#e91e63', '#673ab7'
      ],
      hoverOffset: 10
    }]
  };

  return (
    <div style={{ maxWidth: '250px', margin: '0 auto' }}>
      <Doughnut 
        data={data}
        options={{
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                  size: 12
                }
              }
            }
          },
          maintainAspectRatio: false
        }}
      />
    </div>
  );
}