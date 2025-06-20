import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function SpendingTrendChart({ expenses }) {
  const [mode, setMode] = useState('daily'); // 'daily' or 'monthly'

  if (!expenses.length) return <p>No data to show.</p>;

  const grouped = {};

  expenses.forEach(exp => {
    const key = mode === 'monthly'
      ? exp.date.slice(0, 7) 
      : exp.date.slice(0, 10);
    grouped[key] = (grouped[key] || 0) + parseFloat(exp.amount);
  });

  const labels = Object.keys(grouped).sort();
  const values = labels.map(label => grouped[label]);

  const data = {
    labels,
    datasets: [
      {
        label: mode === 'monthly' ? 'Monthly Spending (₹)' : 'Daily Spending (₹)',
        data: values,
        borderColor: '#4f46e5',
        backgroundColor: '#6366f1',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: mode === 'monthly' ? 'Monthly Expense Trend' : 'Daily Expense Trend',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setMode(mode === 'monthly' ? 'daily' : 'monthly')}
          className="px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition text-sm"
        >
          View {mode === 'monthly' ? 'Daily' : 'Monthly'} Trend
        </button>
      </div>
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
