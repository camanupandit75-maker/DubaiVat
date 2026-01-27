import React from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const VATReturns: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">VAT Return Preparation</h1>
        <p className="text-gray-600 mt-1">Prepare your VAT return for submission to FTA</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-green-600">AED</span>
          </div>
          <p className="text-gray-600 mb-2">VAT Collected</p>
          <p className="text-3xl font-bold text-green-600">15,750.00</p>
          <p className="text-sm text-gray-500 mt-2">From Sales</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-blue-600">AED</span>
          </div>
          <p className="text-gray-600 mb-2">VAT Paid</p>
          <p className="text-3xl font-bold text-blue-600">8,420.00</p>
          <p className="text-sm text-gray-500 mt-2">From Purchases</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">AED</span>
          </div>
          <p className="text-blue-100 mb-2">Net VAT</p>
          <p className="text-3xl font-bold">7,330.00</p>
          <p className="text-sm text-blue-100 mt-2">You Owe</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-[#1B4B7F] mb-6">FTA Return Form Preview</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Box 1: Standard Rated Sales</p>
              <p className="text-2xl font-bold text-[#1B4B7F]">AED 315,000.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Box 2: Output VAT</p>
              <p className="text-2xl font-bold text-green-600">AED 15,750.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Box 3: Zero-rated Sales</p>
              <p className="text-2xl font-bold text-[#1B4B7F]">AED 0.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Box 4: Exempt Sales</p>
              <p className="text-2xl font-bold text-[#1B4B7F]">AED 0.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Box 5: Standard Rated Purchases</p>
              <p className="text-2xl font-bold text-[#1B4B7F]">AED 168,400.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Box 6: Input VAT</p>
              <p className="text-2xl font-bold text-blue-600">AED 8,420.00</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white rounded-lg">
            <p className="text-blue-100 mb-2">Box 7: Net VAT</p>
            <p className="text-4xl font-bold">AED 7,330.00</p>
            <p className="text-sm text-blue-100 mt-2">Amount to be paid to FTA</p>
          </div>
        </div>
      </Card>

      <Card className="bg-yellow-50 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
            <p className="text-yellow-800 mb-3">
              This report is for your records only. To officially file your VAT return, you must submit it through the FTA eServices portal.
            </p>
            <a href="https://eservices.tax.gov.ae" target="_blank" rel="noopener noreferrer" className="text-yellow-900 underline font-medium">
              Visit FTA eServices Portal →
            </a>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1"><Download size={20} /> Download Report</Button>
        <Button variant="secondary" className="flex-1">Save Draft</Button>
      </div>
    </div>
  );
};
