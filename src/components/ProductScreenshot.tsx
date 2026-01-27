import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Camera, Calculator, Receipt, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

interface ProductScreenshotProps {
  type: 'dashboard' | 'invoice' | 'receipt' | 'calculator' | 'returns' | 'expenses';
  className?: string;
  animated?: boolean;
}

export const ProductScreenshot: React.FC<ProductScreenshotProps> = ({ type, className = '', animated = false }) => {
  const renderDashboard = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">VAT OVERVIEW</h3>
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            initial={animated ? { opacity: 0, y: 20 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-gray-500 mb-1">VAT Collected</p>
            <p className="text-2xl font-bold text-green-600">AED 15,750</p>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp size={12} className="mr-1" />
              <span>+12.5%</span>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            initial={animated ? { opacity: 0, y: 20 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-gray-500 mb-1">VAT Paid</p>
            <p className="text-2xl font-bold text-red-600">AED 8,420</p>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <TrendingUp size={12} className="mr-1" />
              <span>+8.2%</span>
            </div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md"
            initial={animated ? { opacity: 0, y: 20 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-blue-100 mb-1">Net VAT Owed</p>
            <p className="text-2xl font-bold">AED 7,330</p>
            <div className="flex items-center mt-1 text-xs text-blue-100">
              <CheckCircle size={12} className="mr-1" />
              <span>Ready to file</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Recent Invoices</span>
            <span className="text-[10px] text-blue-600 font-medium">View All</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'INV-042', client: 'Dubai Tech', amount: '12,500', status: 'paid' },
              { id: 'INV-041', client: 'Al Maktoum', amount: '8,750', status: 'pending' },
              { id: 'INV-040', client: 'Emirates Co.', amount: '5,200', status: 'paid' },
            ].map((inv, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between py-1.5 px-2 rounded bg-gray-50"
                initial={animated ? { opacity: 0 } : {}}
                animate={animated ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span className="text-[10px] font-medium text-gray-700">{inv.id}</span>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span className="text-[10px] text-gray-500">{inv.client}</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-800">AED {inv.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoice = () => (
    <div className="w-full h-full bg-white p-6">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">TAX INVOICE</h3>
            <p className="text-xs text-gray-500">INV-2024-001</p>
          </div>
          <FileText className="text-[#1B4B7F]" size={32} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Consulting Services</span>
          <span className="font-semibold">AED 5,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">VAT (5%)</span>
          <span className="font-semibold">AED 250</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-[#1B4B7F] text-lg">AED 5,250</span>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-center text-green-700 text-xs">
          <CheckCircle size={14} className="mr-2" />
          <span>FTA Compliant Invoice</span>
        </div>
      </div>
    </div>
  );

  const renderReceipt = () => (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
          <Camera className="text-white" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Receipt Scanner</h3>
          <p className="text-xs text-gray-500">Organize & Extract VAT</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <Camera className="mx-auto text-gray-400 mb-2" size={40} />
        <p className="text-sm text-gray-600 mb-1">Scan or Upload Receipt</p>
        <p className="text-xs text-gray-500">Auto-extract VAT amounts</p>
      </div>
      <div className="mt-4 space-y-2">
        {['Restaurant - AED 125', 'Office Supplies - AED 340', 'Taxi - AED 45'].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between"
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <span className="text-xs text-gray-700">{item}</span>
            <CheckCircle className="text-green-500" size={16} />
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-white p-6">
      <div className="flex items-center mb-4">
        <Calculator className="text-[#1B4B7F] mr-3" size={32} />
        <h3 className="font-bold text-gray-900">VAT Calculator</h3>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <label className="text-xs text-gray-500 mb-2 block">Amount (Excluding VAT)</label>
        <div className="text-3xl font-bold text-gray-900 mb-1">AED 10,000</div>
      </div>
      <div className="space-y-3">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">VAT Amount (5%)</p>
          <p className="text-xl font-bold text-blue-700">AED 500</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-600 mb-1">Total Including VAT</p>
          <p className="text-xl font-bold text-green-700">AED 10,500</p>
        </div>
      </div>
    </div>
  );

  const renderReturns = () => (
    <div className="w-full h-full bg-gradient-to-br from-pink-50 to-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">VAT Return</h3>
          <p className="text-xs text-gray-500">Q1 2024</p>
        </div>
        <Receipt className="text-[#1B4B7F]" size={32} />
      </div>
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Standard Rated Sales</span>
            <span className="font-semibold text-gray-900">AED 315,000</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Input VAT Claimed</span>
            <span className="font-semibold text-gray-900">AED 168,400</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-xs text-blue-100 mb-1">Net VAT Payable</p>
          <p className="text-2xl font-bold">AED 7,330</p>
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-white p-6">
      <div className="flex items-center mb-4">
        <DollarSign className="text-[#1B4B7F] mr-3" size={32} />
        <h3 className="font-bold text-gray-900">Expense Tracker</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'This Month', amount: '12,450', color: 'blue' },
          { label: 'Last Month', amount: '10,320', color: 'gray' }
        ].map((item, i) => (
          <div key={i} className={`bg-white rounded-lg p-3 border border-gray-200`}>
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className={`text-lg font-bold text-${item.color}-600`}>AED {item.amount}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { cat: 'Office Rent', amt: '5,000', pct: 40 },
          { cat: 'Marketing', amt: '3,200', pct: 26 },
          { cat: 'Software', amt: '2,100', pct: 17 },
          { cat: 'Travel', amt: '2,150', pct: 17 }
        ].map((exp, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg p-3 border border-gray-200"
            initial={animated ? { opacity: 0, y: 10 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-700">{exp.cat}</span>
              <span className="text-xs font-semibold text-gray-900">AED {exp.amt}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${exp.pct}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'dashboard': return renderDashboard();
      case 'invoice': return renderInvoice();
      case 'receipt': return renderReceipt();
      case 'calculator': return renderCalculator();
      case 'returns': return renderReturns();
      case 'expenses': return renderExpenses();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border border-gray-200 ${className}`}>
      {renderContent()}
    </div>
  );
};
