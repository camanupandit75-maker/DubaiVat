import React, { useState } from 'react';
import { Receipt, Calculator, Plane, BookOpen, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

export const IndividualDashboard: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [totalSpending, setTotalSpending] = useState(0);
  const [vatPaid, setVatPaid] = useState(0);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B4B7F]">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Track your VAT spending and learn about refunds</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month's Spending</p>
              <p className="text-2xl font-bold text-[#1B4B7F]">AED {totalSpending.toLocaleString()}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-[#1B4B7F]/30" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VAT Paid</p>
              <p className="text-2xl font-bold text-green-600">AED {vatPaid.toLocaleString()}</p>
            </div>
            <Receipt className="w-8 h-8 text-green-600/30" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VAT Rate</p>
              <p className="text-2xl font-bold text-[#C9A962]">5%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#C9A962]/30" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receipts Saved</p>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
            <Receipt className="w-8 h-8 text-purple-600/30" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setCurrentPage('calculators')}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-[#1B4B7F] transition-all text-left"
        >
          <Calculator className="w-10 h-10 text-[#1B4B7F] mb-3" />
          <h3 className="font-semibold text-gray-900">VAT Calculator</h3>
          <p className="text-sm text-gray-500 mt-1">Calculate VAT on any purchase</p>
        </button>
        
        <button 
          onClick={() => setCurrentPage('tourist-refund')}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-[#1B4B7F] transition-all text-left"
        >
          <Plane className="w-10 h-10 text-[#C9A962] mb-3" />
          <h3 className="font-semibold text-gray-900">Tourist Refund</h3>
          <p className="text-sm text-gray-500 mt-1">Check if you qualify for VAT refund</p>
        </button>
        
        <button 
          onClick={() => setCurrentPage('expenses')}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-[#1B4B7F] transition-all text-left"
        >
          <Receipt className="w-10 h-10 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Scan Receipt</h3>
          <p className="text-sm text-gray-500 mt-1">Track your purchases</p>
        </button>
        
        <button 
          onClick={() => setCurrentPage('education')}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-[#1B4B7F] transition-all text-left"
        >
          <BookOpen className="w-10 h-10 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Learn About VAT</h3>
          <p className="text-sm text-gray-500 mt-1">Consumer guides & FAQs</p>
        </button>
      </div>

      {/* Tourist Refund Info */}
      <Card className="bg-gradient-to-r from-[#1B4B7F] to-[#2a5d94] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Plane className="w-6 h-6" />
              Tourist VAT Refund
            </h3>
            <p className="text-blue-100 mt-2 text-sm">
              Tourists can claim back VAT on purchases over AED 250 when leaving UAE. 
              Use Planet Tax Free counters at airports.
            </p>
          </div>
          <button 
            onClick={() => setCurrentPage('tourist-refund')}
            className="px-6 py-3 bg-white text-[#1B4B7F] rounded-xl font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Learn More
          </button>
        </div>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Receipts</h3>
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No receipts yet</p>
          <p className="text-sm text-gray-400 mt-1">Scan a receipt to start tracking your VAT spending</p>
        </div>
      </Card>
    </div>
  );
};

