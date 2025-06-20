import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ExpenseChart from '../components/ExpenseChart';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import MonthlySpendingChart from '../components/SpendingTrendChart';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    const isNewUser = localStorage.getItem('isNewUser') === 'true';

    if (isNewUser) {
      localStorage.setItem('budget', '');
      localStorage.removeItem('isNewUser');
      return 0;
    }

    return saved ? parseFloat(saved) : 10000;
  });


  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditing) {
        await axios.put(`/expenses/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post('/expenses', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: '', amount: '', category: '', date: '' });
      fetchExpenses();
    } catch (err) {
      alert('Failed to save expense');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ title: '', amount: '', category: '', date: '' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEditClick = (expense) => {
    setIsEditing(true);
    setEditId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10),
    });

    document.getElementById('expense-form-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('budget');
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const exportCSV = () => {
    const csv = Papa.unparse(expenses.map(exp => ({
      Title: exp.title,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'expenses.csv');
  };

  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date).toISOString().slice(0, 10);
    return (
      (!filters.category || exp.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.startDate || expDate >= filters.startDate) &&
      (!filters.endDate || expDate <= filters.endDate)
    );
  });

  const handleBudgetChange = (e) => {
    const newBudget = parseFloat(e.target.value);
    setBudget(newBudget);
    localStorage.setItem('budget', newBudget);
  };

  const totalSpending = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const budgetPercentage = Math.min((totalSpending / budget) * 100, 100);
  const budgetWarningLevel = budgetPercentage > 90 ? 'critical' : budgetPercentage > 70 ? 'warning' : 'safe';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
            <p className="text-gray-600">Manage your finances effectively</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goToProfile}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Budget Overview Card */}
      <section className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Budget Overview</h2>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Set your monthly budget"
                min="0"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Spending Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  ₹{totalSpending.toFixed(2)} / ₹{budget.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${budgetWarningLevel === 'critical' ? 'bg-red-500' :
                      budgetWarningLevel === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-xs font-medium ${budgetWarningLevel === 'critical' ? 'text-red-500' :
                    budgetWarningLevel === 'warning' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                  {budgetPercentage.toFixed(1)}% of budget
                </span>
                {totalSpending > budget && (
                  <span className="text-xs font-medium text-red-500">Budget exceeded!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Add Expense Form */}
          <section id="expense-form-section" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {isEditing ? '✏️ Edit Expense' : '➕ Add New Expense'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Dinner with friends"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      name="amount"
                      type="number"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Food & Dining"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                  >
                    {isEditing ? 'Update Expense' : 'Add Expense'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Charts Section */}
          <section className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Expense Breakdown</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : expenses.length > 0 ? (
                <ExpenseChart expenses={expenses} />
              ) : (
                <p className="text-gray-500 text-center py-8">No expenses to display. Add some expenses to see the chart.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Spending Trend</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : expenses.length > 0 ? (
                <MonthlySpendingChart expenses={expenses} />
              ) : (
                <p className="text-gray-500 text-center py-8">No expenses to display. Add some expenses to see the trend.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Filters Section */}
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Filter Expenses</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Food, Travel"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setFilters({ category: '', startDate: '', endDate: '' })}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={exportCSV}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Expenses List */}
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">💰 Recent Expenses</h2>
                {filteredExpenses.length > 0 && (
                  <span className="text-sm font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                    Total: ₹{filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0).toFixed(2)}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {expenses.length === 0 ? 'No expenses recorded yet.' : 'No expenses match your filters.'}
                  </p>
                  <button
                    onClick={() => setFilters({ category: '', startDate: '', endDate: '' })}
                    className="text-indigo-600 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredExpenses.map((exp) => (
                    <div key={exp._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{exp.title}</h3>
                          <p className="text-sm text-gray-600">{exp.category}</p>
                        </div>
                        <span className="font-semibold text-gray-800">₹{parseFloat(exp.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          {new Date(exp.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(exp)}
                            className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}