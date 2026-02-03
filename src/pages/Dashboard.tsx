import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, FileText, Receipt, PlusCircle, Camera, Calculator } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { getVATSummary, getInvoices, getExpenses } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user, setCurrentPage } = useApp();
  const [vatSummary, setVatSummary] = useState({
    vatCollected: 0,
    vatPaid: 0,
    netVAT: 0,
    totalSales: 0,
    totalPurchases: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.businessProfile?.id) {
        setLoading(false);
        return;
      }

      const businessId = user.businessProfile.id;
      
      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString().split('T')[0];

      try {
        const [summary, invoicesRes, expensesRes] = await Promise.all([
          getVATSummary(businessId, startOfMonth, endOfMonth),
          getInvoices(businessId),
          getExpenses(businessId),
        ]);

        setVatSummary(summary);
        setRecentInvoices(invoicesRes.data?.slice(0, 5) || []);
        setRecentExpenses(expensesRes.data?.slice(0, 5) || []);
        setAllInvoices(invoicesRes.data || []);
        setAllExpenses(expensesRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate next deadline (simplified - 28 days from end of current period)
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const deadline = new Date(endOfMonth);
  deadline.setDate(deadline.getDate() + 28);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const stats = [
    {
      title: 'VAT Collected',
      value: `AED ${vatSummary.vatCollected.toLocaleString()}`,
      change: 'This month',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'VAT Paid',
      value: `AED ${vatSummary.vatPaid.toLocaleString()}`,
      change: 'This month',
      trend: 'up',
      icon: TrendingDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Net VAT',
      value: `AED ${vatSummary.netVAT.toLocaleString()}`,
      change: vatSummary.netVAT >= 0 ? 'Owed' : 'Refund',
      trend: 'neutral',
      icon: DollarSign,
      color: 'text-[#C5A572]',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Next Deadline',
      value: `${daysUntilDeadline} Days`,
      change: deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      trend: 'neutral',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Combine invoices and expenses for recent activity
  const recentActivity = [
    ...recentInvoices.map(inv => ({
      type: 'invoice' as const,
      number: inv.invoice_number,
      customer: inv.customer_name,
      amount: `AED ${Number(inv.total || 0).toLocaleString()}`,
      date: inv.date,
      status: inv.status === 'paid' ? 'Paid' : inv.status === 'sent' ? 'Sent' : 'Draft'
    })),
    ...recentExpenses.map(exp => ({
      type: 'expense' as const,
      vendor: exp.vendor_name,
      amount: `AED ${Number(exp.total || exp.amount || 0).toLocaleString()}`,
      date: exp.date,
      status: 'Recorded'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Calculate monthly income vs expenses for last 6 months
  const calculateMonthlyData = () => {
    const now = new Date();
    const monthlyData: { month: string; income: number; expenses: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
        .toISOString().split('T')[0];
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
        .toISOString().split('T')[0];
      
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate income from invoices (non-draft)
      const monthInvoices = allInvoices.filter(inv => 
        inv.date >= monthStart && 
        inv.date <= monthEnd && 
        inv.status !== 'draft'
      );
      const income = monthInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
      
      // Calculate expenses
      const monthExpenses = allExpenses.filter(exp => 
        exp.date >= monthStart && 
        exp.date <= monthEnd
      );
      const expenses = monthExpenses.reduce((sum, exp) => sum + Number(exp.total || exp.amount || 0), 0);
      
      monthlyData.push({ month: monthName, income, expenses });
    }
    
    return monthlyData;
  };

  const chartData = calculateMonthlyData();
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expenses)),
    1 // Ensure at least 1 to prevent division by zero
  );

  // Calculate VAT trend for last 4 months
  const calculateVATTrend = () => {
    const now = new Date();
    const vatTrend: { month: string; collected: number; paid: number }[] = [];
    
    for (let i = 3; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
        .toISOString().split('T')[0];
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
        .toISOString().split('T')[0];
      
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
      
      // Calculate VAT collected from invoices
      const monthInvoices = allInvoices.filter(inv => 
        inv.date >= monthStart && 
        inv.date <= monthEnd && 
        inv.status !== 'draft'
      );
      const collected = monthInvoices.reduce((sum, inv) => sum + Number(inv.vat_amount || 0), 0);
      
      // Calculate VAT paid from expenses
      const monthExpenses = allExpenses.filter(exp => 
        exp.date >= monthStart && 
        exp.date <= monthEnd
      );
      const paid = monthExpenses.reduce((sum, exp) => sum + Number(exp.vat_amount || 0), 0);
      
      vatTrend.push({ month: monthName, collected, paid });
    }
    
    return vatTrend;
  };

  const vatTrendData = calculateVATTrend();
  const maxVATValue = Math.max(
    ...vatTrendData.map(item => Math.abs(item.collected - item.paid)),
    1
  );

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1B4B7F] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">
          Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
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
          {chartData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available. Start by creating invoices and adding expenses.
            </div>
          ) : (
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{data.month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600">AED {data.income.toLocaleString()}</span>
                      <span className="text-red-600">AED {data.expenses.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-8">
                    <div
                      className="bg-green-500 rounded"
                      style={{ width: `${maxValue > 0 ? (data.income / maxValue) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-red-500 rounded"
                      style={{ width: `${maxValue > 0 ? (data.expenses / maxValue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {vatTrendData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No VAT data available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {vatTrendData.map((item, index) => {
                const netVAT = item.collected - item.paid;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.month}</span>
                      <span className="font-medium text-[#1B4B7F]">
                        AED {netVAT.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${netVAT >= 0 ? 'bg-[#1B4B7F]' : 'bg-red-500'}`}
                        style={{ width: `${maxVATValue > 0 ? Math.min(Math.abs(netVAT / maxVATValue) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No recent activity. Start by creating an invoice or adding an expense.
                  </td>
                </tr>
              ) : (
                recentActivity.map((activity, index) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
