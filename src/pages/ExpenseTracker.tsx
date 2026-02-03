import React, { useState, useEffect } from 'react';
import { Filter, Download, Search, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useApp } from '../context/AppContext';
import { getExpenses, deleteExpense } from '../lib/supabase';

export const ExpenseTracker: React.FC = () => {
  const { setCurrentPage, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('this-month');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user?.businessProfile?.id) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await getExpenses(user.businessProfile.id);
      if (!error && data) {
        setExpenses(data);
      }
      setLoading(false);
    };
    
    fetchExpenses();
  }, [user]);

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    const { error } = await deleteExpense(id);
    if (!error) {
      setExpenses(expenses.filter(e => e.id !== id));
    } else {
      alert('Failed to delete expense: ' + error.message);
    }
  };

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = !searchTerm || 
      exp.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.amount?.toString().includes(searchTerm);
    
    const matchesCategory = categoryFilter.length === 0 || 
      categoryFilter.includes(exp.category);
    
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const totalVAT = filteredExpenses.reduce((sum, exp) => sum + Number(exp.vat_amount || 0), 0);
  const totalCount = filteredExpenses.length;

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1B4B7F] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1B4B7F]">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Track and manage all your business expenses</p>
        </div>
        <Button onClick={() => setCurrentPage('expenses')}>
          <Plus size={20} /> Scan Receipt
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card hover>
          <p className="text-gray-600 text-sm mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-[#1B4B7F]">AED {totalExpenses.toFixed(2)}</p>
        </Card>
        <Card hover>
          <p className="text-gray-600 text-sm mb-1">Total VAT Paid</p>
          <p className="text-2xl font-bold text-green-600">AED {totalVAT.toFixed(2)}</p>
        </Card>
        <Card hover>
          <p className="text-gray-600 text-sm mb-1">Number of Receipts</p>
          <p className="text-2xl font-bold text-[#C5A572]">{totalCount}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search vendor, amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
            onChange={(e) => {
              const value = e.target.value;
              if (value && !categoryFilter.includes(value)) {
                setCategoryFilter([...categoryFilter, value]);
              }
            }}
          >
            <option value="">Filter by Category</option>
            <option value="office-supplies">Office Supplies</option>
            <option value="fuel">Fuel</option>
            <option value="meals">Meals</option>
            <option value="utilities">Utilities</option>
            <option value="equipment">Equipment</option>
            <option value="professional-services">Professional Services</option>
          </select>
          <Button variant="secondary">
            <Download size={20} /> Export
          </Button>
        </div>

        {categoryFilter.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryFilter.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {cat}
                <button
                  onClick={() => setCategoryFilter(categoryFilter.filter(c => c !== cat))}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vendor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">TRN</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">VAT</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    {expenses.length === 0 
                      ? 'No expenses found. Start by scanning a receipt or adding an expense.'
                      : 'No expenses match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700">{expense.date}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{expense.vendor_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono">{expense.vendor_trn || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {expense.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    AED {Number(expense.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600">
                    AED {Number(expense.vat_amount || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#1B4B7F]">
                    AED {Number(expense.total || expense.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      {expense.receipt_url && (
                        <a 
                          href={expense.receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#1B4B7F] transition-colors"
                        >
                        <Eye size={18} />
                        </a>
                      )}
                      <button className="text-gray-600 hover:text-[#1B4B7F] transition-colors">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600">
            Showing {filteredExpenses.length > 0 ? 1 : 0} to {filteredExpenses.length} of {expenses.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>

      <button
        onClick={() => setCurrentPage('expenses')}
        className="fixed bottom-24 lg:bottom-8 right-8 w-14 h-14 bg-[#1B4B7F] text-white rounded-full shadow-lg hover:bg-[#153d6b] transition-colors flex items-center justify-center"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};
