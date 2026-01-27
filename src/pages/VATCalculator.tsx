import React, { useState } from 'react';
import { Calculator, Copy, CheckCircle, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tabs } from '../components/Tabs';

export const VATCalculator: React.FC = () => {
  const [addVATAmount, setAddVATAmount] = useState('');
  const [addVATRate, setAddVATRate] = useState(5);
  const [removeVATAmount, setRemoveVATAmount] = useState('');
  const [removeVATRate, setRemoveVATRate] = useState(5);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [touristAmount, setTouristAmount] = useState('');
  const [copied, setCopied] = useState('');

  const calculateAddVAT = () => {
    const amount = parseFloat(addVATAmount) || 0;
    const vat = amount * (addVATRate / 100);
    const total = amount + vat;
    return { amount, vat, total };
  };

  const calculateRemoveVAT = () => {
    const total = parseFloat(removeVATAmount) || 0;
    const amount = total / (1 + removeVATRate / 100);
    const vat = total - amount;
    return { amount, vat, total };
  };

  const calculateBudget = () => {
    const budget = parseFloat(budgetAmount) || 0;
    const amount = budget / 1.05;
    const vat = budget - amount;
    return { budget, amount, vat };
  };

  const calculateTouristRefund = () => {
    const spent = parseFloat(touristAmount) || 0;
    const vat = spent * 0.05;
    const processingFee = vat * 0.20;
    const refund = vat - processingFee;
    return { spent, vat, processingFee, refund };
  };

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const addVATResults = calculateAddVAT();
  const removeVATResults = calculateRemoveVAT();
  const budgetResults = calculateBudget();
  const touristResults = calculateTouristRefund();

  const tabs = [
    {
      id: 'add-vat',
      label: 'Add VAT',
      content: (
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calculator className="text-[#1B4B7F]" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1B4B7F]">Add VAT to Amount</h3>
                <p className="text-sm text-gray-600">Calculate price including VAT</p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Enter Amount (excluding VAT)"
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={addVATAmount}
                onChange={(e) => setAddVATAmount(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Rate
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAddVATRate(5)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                      addVATRate === 5
                        ? 'border-[#1B4B7F] bg-blue-50 text-[#1B4B7F]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    5% (Standard)
                  </button>
                  <button
                    onClick={() => setAddVATRate(0)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                      addVATRate === 0
                        ? 'border-[#1B4B7F] bg-blue-50 text-[#1B4B7F]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    0% (Zero-rated)
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Original Amount:</span>
                  <span className="font-semibold text-lg">AED {addVATResults.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">VAT ({addVATRate}%):</span>
                  <span className="font-semibold text-lg">AED {addVATResults.vat.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-blue-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1B4B7F] text-lg">Total (with VAT):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-2xl text-[#1B4B7F]">
                        AED {addVATResults.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(addVATResults.total.toFixed(2), 'add-vat')}
                        className="text-[#1B4B7F] hover:text-[#153d6b] transition-colors"
                      >
                        {copied === 'add-vat' ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Calculate</Button>
                <Button variant="secondary" className="flex-1" onClick={() => setAddVATAmount('')}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'remove-vat',
      label: 'Remove VAT',
      content: (
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calculator className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1B4B7F]">Remove VAT from Amount</h3>
                <p className="text-sm text-gray-600">Calculate price excluding VAT</p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Enter Amount (including VAT)"
                type="number"
                step="0.01"
                placeholder="1050.00"
                value={removeVATAmount}
                onChange={(e) => setRemoveVATAmount(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Rate
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRemoveVATRate(5)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                      removeVATRate === 5
                        ? 'border-[#1B4B7F] bg-blue-50 text-[#1B4B7F]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    5% (Standard)
                  </button>
                  <button
                    onClick={() => setRemoveVATRate(0)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                      removeVATRate === 0
                        ? 'border-[#1B4B7F] bg-blue-50 text-[#1B4B7F]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    0% (Zero-rated)
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="font-semibold text-lg">AED {removeVATResults.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">VAT ({removeVATRate}%):</span>
                  <span className="font-semibold text-lg">AED {removeVATResults.vat.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-green-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-700 text-lg">Amount (excluding VAT):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-2xl text-green-700">
                        AED {removeVATResults.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(removeVATResults.amount.toFixed(2), 'remove-vat')}
                        className="text-green-700 hover:text-green-800 transition-colors"
                      >
                        {copied === 'remove-vat' ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Calculate</Button>
                <Button variant="secondary" className="flex-1" onClick={() => setRemoveVATAmount('')}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'shopping-budget',
      label: 'Shopping Budget',
      content: (
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calculator className="text-[#C5A572]" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1B4B7F]">Shopping Budget Calculator</h3>
                <p className="text-sm text-gray-600">Plan your spending with VAT included</p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Total Budget Available"
                type="number"
                step="0.01"
                placeholder="5000.00"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Budget:</span>
                  <span className="font-semibold text-lg">AED {budgetResults.budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">VAT Portion (5%):</span>
                  <span className="font-semibold text-lg text-red-600">AED {budgetResults.vat.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-yellow-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#C5A572] text-lg">You can spend on items:</span>
                    <span className="font-bold text-2xl text-[#C5A572]">
                      AED {budgetResults.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-blue-800">
                  This calculator helps you understand how much you can actually spend on items when you have a fixed budget that needs to include VAT.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'tourist-refund',
      label: 'Tourist Refund',
      content: (
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calculator className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1B4B7F]">Tourist VAT Refund Calculator</h3>
                <p className="text-sm text-gray-600">Estimate your VAT refund amount</p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Total Amount Spent"
                type="number"
                step="0.01"
                placeholder="10000.00"
                value={touristAmount}
                onChange={(e) => setTouristAmount(e.target.value)}
              />

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Spent:</span>
                  <span className="font-semibold text-lg">AED {touristResults.spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">VAT Paid (5%):</span>
                  <span className="font-semibold text-lg">AED {touristResults.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Processing Fee (~20%):</span>
                  <span className="font-semibold text-lg text-red-600">-AED {touristResults.processingFee.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-purple-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-700 text-lg">You Get Back:</span>
                    <span className="font-bold text-2xl text-green-600">
                      AED {touristResults.refund.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• Minimum spend: AED 250 per store</li>
                    <li>• Valid passport and boarding pass</li>
                    <li>• Goods must be exported within 3 months</li>
                    <li>• Tax-free tag from participating retailers</li>
                  </ul>
                </div>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Airport Refund Desk Locations
                  </summary>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p><strong>Dubai International Airport:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Terminal 1: Departure Level</li>
                      <li>• Terminal 3: Concourse A & B</li>
                    </ul>
                    <p className="mt-2"><strong>Abu Dhabi International Airport:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Terminal 1: Departure Hall</li>
                      <li>• Terminal 3: Departure Level</li>
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">VAT Calculators</h1>
        <p className="text-gray-600 mt-1">Quick tools for all your VAT calculations</p>
      </div>

      <Tabs tabs={tabs} defaultTab="add-vat" />
    </div>
  );
};
