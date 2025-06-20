import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

export default function ExpenseChart({ expenses }) {
  if (expenses.length === 0) return <p>No data to show.</p>;

  const dataMap = expenses.reduce((acc, item) => {
    const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
    acc[item.category] = (acc[item.category] || 0) + amount;
    return acc;
  }, {});

  const labels = Object.keys(dataMap);
  const dataValues = Object.values(dataMap);
  const backgroundColors = labels.map(() => getRandomColor());

  const data = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ₹${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-xl h-[400px] mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
}
