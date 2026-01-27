import React from 'react';
import { FileText, TrendingUp, DollarSign, PieChart, BarChart3, Download } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const Reports: React.FC = () => {
  const reportCards = [
    { icon: DollarSign, title: 'Income Report', value: 'AED 315,000', change: '+15.2%', color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: TrendingUp, title: 'Expense Report', value: 'AED 168,400', change: '+8.5%', color: 'text-red-600', bgColor: 'bg-red-100' },
    { icon: FileText, title: 'VAT Report', value: 'AED 7,330', change: 'Net Owed', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: BarChart3, title: 'Profit & Loss', value: 'AED 146,600', change: '+12.8%', color: 'text-[#C5A572]', bgColor: 'bg-yellow-100' }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1B4B7F]">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial insights and reports</p>
        </div>
        <Button><Download size={20} /> Export All</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((report, i) => {
          const Icon = report.icon;
          return (
            <Card key={i} hover>
              <div className="flex items-start justify-between mb-4">
                <div className={`${report.bgColor} ${report.color} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{report.title}</p>
              <p className="text-2xl font-bold text-[#1B4B7F] mb-1">{report.value}</p>
              <p className={`text-sm ${report.color}`}>{report.change}</p>
              <Button variant="tertiary" size="sm" className="mt-4 w-full">View Details</Button>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Monthly Income vs Expenses</h3>
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
              const income = [52000, 48000, 55000, 51000, 58000, 62000][i];
              const expense = [28000, 32000, 29000, 31000, 35000, 34000][i];
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600">AED {income.toLocaleString()}</span>
                      <span className="text-red-600">AED {expense.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-8">
                    <div className="bg-green-500 rounded" style={{ width: `${income / 1000}%` }} />
                    <div className="bg-red-500 rounded" style={{ width: `${expense / 1000}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Expense Breakdown</h3>
          <div className="space-y-4">
            {[
              { category: 'Professional Services', amount: 45000, percent: 27, color: 'bg-blue-500' },
              { category: 'Equipment', amount: 38000, percent: 23, color: 'bg-green-500' },
              { category: 'Utilities', amount: 32000, percent: 19, color: 'bg-yellow-500' },
              { category: 'Office Supplies', amount: 28000, percent: 17, color: 'bg-purple-500' },
              { category: 'Fuel', amount: 15000, percent: 9, color: 'bg-red-500' },
              { category: 'Other', amount: 10400, percent: 5, color: 'bg-gray-500' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <span className="text-[#1B4B7F] font-semibold">AED {item.amount.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
