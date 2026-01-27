import React, { useState } from 'react';
import { Filter, Download, Search, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useApp } from '../context/AppContext';

export const ExpenseTracker: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('this-month');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const expenses = [
    {
      id: '1',
      date: '2026-01-25',
      vendor: 'Emirates Office Supplies',
      trn: '100234567891234',
      category: 'Office Supplies',
      amount: 1190.48,
      vat: 59.52,
      total: 1250.00
    },
    {
      id: '2',
      date: '2026-01-24',
      vendor: 'Gulf Petroleum',
      trn: '100345678912345',
      category: 'Fuel',
      amount: 809.52,
      vat: 40.48,
      total: 850.00
    },
    {
      id: '3',
      date: '2026-01-23',
      vendor: 'Al Khaleej Restaurant',
      trn: '100456789123456',
      category: 'Meals',
      amount: 285.71,
      vat: 14.29,
      total: 300.00
    },
    {
      id: '4',
      date: '2026-01-22',
      vendor: 'DEWA',
      trn: '100567891234567',
      category: 'Utilities',
      amount: 1904.76,
      vat: 95.24,
      total: 2000.00
    },
    {
      id: '5',
      date: '2026-01-21',
      vendor: 'Dubai Business Services',
      trn: '100678912345678',
      category: 'Professional Services',
      amount: 4761.90,
      vat: 238.10,
      total: 5000.00
    },
    {
      id: '6',
      date: '2026-01-20',
      vendor: 'Tech Equipment LLC',
      trn: '100789123456789',
      category: 'Equipment',
      amount: 2857.14,
      vat: 142.86,
      total: 3000.00
    }
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalVAT = expenses.reduce((sum, exp) => sum + exp.vat, 0);
  const totalCount = expenses.length;

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
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700">{expense.date}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{expense.vendor}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono">{expense.trn}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    AED {expense.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600">
                    AED {expense.vat.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-[#1B4B7F]">
                    AED {expense.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <button className="text-gray-600 hover:text-[#1B4B7F] transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-[#1B4B7F] transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600">
            Showing 1 to {expenses.length} of {expenses.length} results
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
