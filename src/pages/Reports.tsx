import React, { useEffect, useState } from 'react';
import { FileText, TrendingUp, DollarSign, PieChart, BarChart3, Download, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { getVATSummary, getInvoices, getExpenses } from '../lib/supabase';

export const Reports: React.FC = () => {
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [vatSummary, setVatSummary] = useState({
    vatCollected: 0,
    vatPaid: 0,
    netVAT: 0,
    totalSales: 0,
    totalPurchases: 0,
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      if (!user?.businessProfile?.id) {
        setLoading(false);
        return;
      }

      const businessId = user.businessProfile.id;
      
      // Get all-time data for comprehensive reports
      const now = new Date();
      // Use a very early date to get all historical data
      const startDate = '2020-01-01'; // Start from 2020 to get all data
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      try {
        // Fetch all invoices and expenses (no date filter for complete data)
        const [summary, invoicesRes, expensesRes] = await Promise.all([
          getVATSummary(businessId, startDate, endDate),
          getInvoices(businessId),
          getExpenses(businessId),
        ]);

        setVatSummary(summary);
        setInvoices(invoicesRes.data || []);
        setExpenses(expensesRes.data || []);

        // Calculate monthly data for last 6 months
        const monthlyStats: any[] = [];
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
          const monthStartStr = monthStart.toISOString().split('T')[0];
          const monthEndStr = monthEnd.toISOString().split('T')[0];

          const monthInvoices = invoicesRes.data?.filter((inv: any) => 
            inv.date >= monthStartStr && inv.date <= monthEndStr && inv.status !== 'draft'
          ) || [];
          const monthExpenses = expensesRes.data?.filter((exp: any) => 
            exp.date >= monthStartStr && exp.date <= monthEndStr
          ) || [];

          const monthIncome = monthInvoices.reduce((sum: number, inv: any) => sum + Number(inv.total || 0), 0);
          const monthExpense = monthExpenses.reduce((sum: number, exp: any) => sum + Number(exp.total || exp.amount || 0), 0);

          monthlyStats.push({
            month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
            income: monthIncome,
            expense: monthExpense,
          });
        }
        setMonthlyData(monthlyStats);

        // Calculate expense breakdown by category
        const categoryMap: Record<string, number> = {};
        expensesRes.data?.forEach((exp: any) => {
          const category = exp.category || 'Other';
          const amount = Number(exp.amount || 0);
          categoryMap[category] = (categoryMap[category] || 0) + amount;
        });

        const totalExpensesAmount = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
        const breakdown = Object.entries(categoryMap)
          .map(([category, amount]) => ({
            category,
            amount,
            percent: totalExpensesAmount > 0 ? Math.round((amount / totalExpensesAmount) * 100) : 0,
            color: getCategoryColor(category),
          }))
          .sort((a, b) => b.amount - a.amount);

        setExpenseBreakdown(breakdown);
      } catch (error) {
        console.error('Error fetching reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [user]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Professional Services': 'bg-blue-500',
      'Equipment': 'bg-green-500',
      'Utilities': 'bg-yellow-500',
      'Office Supplies': 'bg-purple-500',
      'Fuel': 'bg-red-500',
      'Meals': 'bg-pink-500',
      'Rent': 'bg-indigo-500',
      'Marketing': 'bg-orange-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const profit = vatSummary.totalSales - vatSummary.totalPurchases;
  const maxMonthlyValue = Math.max(...monthlyData.map(m => Math.max(m.income, m.expense)), 1);

  const reportCards = [
    { icon: DollarSign, title: 'Income Report', value: `AED ${vatSummary.totalSales.toLocaleString()}`, change: 'Total Sales', color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: TrendingUp, title: 'Expense Report', value: `AED ${vatSummary.totalPurchases.toLocaleString()}`, change: 'Total Purchases', color: 'text-red-600', bgColor: 'bg-red-100' },
    { icon: FileText, title: 'VAT Report', value: `AED ${vatSummary.netVAT.toLocaleString()}`, change: vatSummary.netVAT >= 0 ? 'Net Owed' : 'Refund', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: BarChart3, title: 'Profit & Loss', value: `AED ${profit.toLocaleString()}`, change: profit >= 0 ? 'Profit' : 'Loss', color: 'text-[#C5A572]', bgColor: 'bg-yellow-100' }
  ];

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1B4B7F] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <Button 
                variant="tertiary" 
                size="sm" 
                className="mt-4 w-full"
                onClick={() => {
                  // Show detailed report modal
                  const reportTypes = ['income', 'expense', 'vat', 'profit'];
                  setSelectedReport(reportTypes[i]);
                }}
              >
                View Details
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Monthly Income vs Expenses</h3>
          {monthlyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available for the last 6 months
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyData.map((data, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600">AED {data.income.toLocaleString()}</span>
                      <span className="text-red-600">AED {data.expense.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-8">
                    <div 
                      className="bg-green-500 rounded" 
                      style={{ width: `${maxMonthlyValue > 0 ? (data.income / maxMonthlyValue) * 100 : 0}%` }} 
                    />
                    <div 
                      className="bg-red-500 rounded" 
                      style={{ width: `${maxMonthlyValue > 0 ? (data.expense / maxMonthlyValue) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Expense Breakdown</h3>
          {expenseBreakdown.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {expenseBreakdown.map((item, i) => (
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
          )}
        </Card>
      </div>

      {/* Income Report Modal */}
      <Modal
        isOpen={selectedReport === 'income'}
        onClose={() => setSelectedReport(null)}
        title="Income Report - Detailed Breakdown"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Total Income</span>
              <span className="text-2xl font-bold text-green-600">
                AED {vatSummary.totalSales.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-green-600">
              From {invoices.filter(inv => inv.status !== 'draft').length} invoices
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Invoice #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.filter(inv => inv.status !== 'draft').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices
                    .filter(inv => inv.status !== 'draft')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{inv.invoice_number}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{inv.customer_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{inv.date}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-green-600">
                          AED {Number(inv.total || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                            inv.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Expense Report Modal */}
      <Modal
        isOpen={selectedReport === 'expense'}
        onClose={() => setSelectedReport(null)}
        title="Expense Report - Detailed Breakdown"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-medium">Total Expenses</span>
              <span className="text-2xl font-bold text-red-600">
                AED {vatSummary.totalPurchases.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-red-600">
              From {expenses.length} expense records
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vendor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  expenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((exp) => (
                      <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">{exp.date}</td>
                        <td className="py-3 px-4 text-sm font-medium">{exp.vendor_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{exp.category || 'Uncategorized'}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-red-600">
                          AED {Number(exp.total || exp.amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* VAT Report Modal */}
      <Modal
        isOpen={selectedReport === 'vat'}
        onClose={() => setSelectedReport(null)}
        title="VAT Report - Detailed Breakdown"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">VAT Collected</div>
              <div className="text-2xl font-bold text-green-600">
                AED {vatSummary.vatCollected.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 mt-1">
                From {invoices.filter(inv => inv.status !== 'draft').length} invoices
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">VAT Paid</div>
              <div className="text-2xl font-bold text-blue-600">
                AED {vatSummary.vatPaid.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                From {expenses.length} expenses
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white rounded-lg p-6">
            <div className="text-sm text-blue-100 mb-2">Net VAT</div>
            <div className="text-4xl font-bold">
              AED {vatSummary.netVAT.toLocaleString()}
            </div>
            <div className="text-sm text-blue-100 mt-2">
              {vatSummary.netVAT >= 0 ? 'Amount to be paid to FTA' : 'Amount to be refunded by FTA'}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">VAT Collected by Invoice</h4>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Invoice</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Date</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">VAT Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices
                    .filter(inv => inv.status !== 'draft' && Number(inv.vat_amount || 0) > 0)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-xs">{inv.invoice_number}</td>
                        <td className="py-2 px-3 text-xs text-gray-600">{inv.date}</td>
                        <td className="py-2 px-3 text-xs text-right font-medium">
                          AED {Number(inv.vat_amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">VAT Paid by Expense</h4>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Vendor</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Date</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">VAT Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses
                    .filter(exp => Number(exp.vat_amount || 0) > 0)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((exp) => (
                      <tr key={exp.id} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-xs">{exp.vendor_name}</td>
                        <td className="py-2 px-3 text-xs text-gray-600">{exp.date}</td>
                        <td className="py-2 px-3 text-xs text-right font-medium">
                          AED {Number(exp.vat_amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      {/* Profit & Loss Modal */}
      <Modal
        isOpen={selectedReport === 'profit'}
        onClose={() => setSelectedReport(null)}
        title="Profit & Loss Report"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600">
                AED {vatSummary.totalSales.toLocaleString()}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-700 mb-1">Total Expenses</div>
              <div className="text-2xl font-bold text-red-600">
                AED {vatSummary.totalPurchases.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white rounded-lg p-6">
            <div className="text-sm text-blue-100 mb-2">{profit >= 0 ? 'Net Profit' : 'Net Loss'}</div>
            <div className="text-4xl font-bold">
              AED {profit.toLocaleString()}
            </div>
            <div className="text-sm text-blue-100 mt-2">
              {profit >= 0 ? 'Your business is profitable' : 'Your expenses exceed revenue'}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Monthly Profit/Loss Trend</h4>
            <div className="space-y-2">
              {monthlyData.map((data, i) => {
                const monthlyProfit = data.income - data.expense;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{data.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">Revenue</div>
                        <div className="text-sm font-medium text-green-600">
                          AED {data.income.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">Expenses</div>
                        <div className="text-sm font-medium text-red-600">
                          AED {data.expense.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="text-xs text-gray-600">Net</div>
                        <div className={`text-sm font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          AED {monthlyProfit.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
