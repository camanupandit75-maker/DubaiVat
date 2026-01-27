import React from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, FileText, Receipt, PlusCircle, Camera, Calculator } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { user, setCurrentPage } = useApp();

  const stats = [
    {
      title: 'VAT Collected',
      value: 'AED 15,750',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'VAT Paid',
      value: 'AED 8,420',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Net VAT',
      value: 'AED 7,330',
      change: 'Owed',
      trend: 'neutral',
      icon: DollarSign,
      color: 'text-[#C5A572]',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Next Deadline',
      value: '18 Days',
      change: 'Feb 28, 2026',
      trend: 'neutral',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivity = [
    { type: 'invoice', number: 'INV-2024-001', customer: 'Al Maktoum Trading', amount: 'AED 5,250', date: '2026-01-25', status: 'Paid' },
    { type: 'expense', vendor: 'Emirates Office Supplies', amount: 'AED 1,250', date: '2026-01-24', status: 'Recorded' },
    { type: 'invoice', number: 'INV-2024-002', customer: 'Dubai Retail Co.', amount: 'AED 8,500', date: '2026-01-23', status: 'Sent' },
    { type: 'expense', vendor: 'Gulf Petroleum', amount: 'AED 850', date: '2026-01-22', status: 'Recorded' },
    { type: 'invoice', number: 'INV-2024-003', customer: 'Sharjah Imports', amount: 'AED 12,300', date: '2026-01-21', status: 'Draft' }
  ];

  const chartData = {
    months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    income: [12500, 15200, 14800, 16500, 18200, 19500],
    expenses: [8200, 9500, 8800, 9200, 10500, 11200]
  };

  const maxValue = Math.max(...chartData.income, ...chartData.expenses);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your VAT overview for this month</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#1B4B7F] mb-1">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Button size="lg" onClick={() => setCurrentPage('invoices')}>
          <FileText size={20} />
          New Invoice
        </Button>
        <Button variant="secondary" size="lg" onClick={() => setCurrentPage('expenses')}>
          <Camera size={20} />
          Scan Receipt
        </Button>
        <Button variant="secondary" size="lg" onClick={() => setCurrentPage('calculators')}>
          <Calculator size={20} />
          Calculate VAT
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-[#1B4B7F] mb-6">Income vs Expenses</h2>
          <div className="space-y-4">
            {chartData.months.map((month, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{month}</span>
                  <div className="flex gap-4">
                    <span className="text-green-600">AED {chartData.income[index].toLocaleString()}</span>
                    <span className="text-red-600">AED {chartData.expenses[index].toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-green-500 rounded"
                    style={{ width: `${(chartData.income[index] / maxValue) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 rounded"
                    style={{ width: `${(chartData.expenses[index] / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-gray-600">Expenses</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#1B4B7F] mb-4">VAT Trend</h2>
          <div className="space-y-3">
            {[
              { month: 'January', collected: 15750, paid: 8420 },
              { month: 'December', collected: 18200, paid: 10500 },
              { month: 'November', collected: 16500, paid: 9200 },
              { month: 'October', collected: 14800, paid: 8800 }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.month}</span>
                  <span className="font-medium text-[#1B4B7F]">
                    AED {(item.collected - item.paid).toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B4B7F] rounded-full"
                    style={{ width: `${((item.collected - item.paid) / 10000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1B4B7F]">Recent Activity</h2>
          <Button variant="tertiary" size="sm">View All</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {activity.type === 'invoice' ? (
                        <FileText size={16} className="text-green-600" />
                      ) : (
                        <Receipt size={16} className="text-red-600" />
                      )}
                      <span className="text-sm font-medium capitalize">{activity.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {activity.type === 'invoice' ? (
                      <div>
                        <div className="font-medium">{activity.number}</div>
                        <div className="text-gray-500">{activity.customer || activity.vendor}</div>
                      </div>
                    ) : (
                      <div className="font-medium">{activity.vendor}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-[#1B4B7F]">
                    {activity.amount}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{activity.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      activity.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      activity.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                      activity.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
