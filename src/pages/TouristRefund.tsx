import React, { useState } from 'react';
import { Plane, CheckCircle, XCircle, MapPin, Clock, CreditCard, Info } from 'lucide-react';
import { Card } from '../components/Card';

export const TouristRefund: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  
  const vatAmount = purchaseAmount * 0.05;
  const refundAmount = vatAmount * 0.85; // Planet charges ~15% fee
  const meetsMinimum = purchaseAmount >= 250;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B4B7F]">Tourist VAT Refund</h1>
        <p className="text-gray-600 mt-1">Find out how to claim back VAT when leaving UAE</p>
      </div>

      {/* Eligibility Checker */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Check Your Refund</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Amount (AED)
            </label>
            <input
              type="number"
              value={purchaseAmount || ''}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20"
              placeholder="Enter total purchase amount"
            />
          </div>
          
          {purchaseAmount > 0 && (
            <div className={`p-4 rounded-xl ${meetsMinimum ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                {meetsMinimum ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  {meetsMinimum ? (
                    <>
                      <p className="font-medium text-green-800">Eligible for VAT Refund!</p>
                      <div className="mt-2 text-sm text-green-700">
                        <p>VAT Paid: <strong>AED {vatAmount.toFixed(2)}</strong></p>
                        <p>Estimated Refund: <strong>AED {refundAmount.toFixed(2)}</strong></p>
                        <p className="text-xs mt-1">(After ~15% processing fee)</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-red-800">Below Minimum Amount</p>
                      <p className="text-sm text-red-700 mt-1">
                        Minimum purchase of AED 250 required per receipt for VAT refund.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Eligibility Criteria */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Who Can Claim?</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Non-UAE Residents</p>
              <p className="text-sm text-gray-600">Tourists and visitors not holding UAE residence visa</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Minimum AED 250 per receipt</p>
              <p className="text-sm text-gray-600">Each individual receipt must be at least AED 250</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Within 90 days of purchase</p>
              <p className="text-sm text-gray-600">Must claim refund within 90 days of buying</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Goods must leave UAE</p>
              <p className="text-sm text-gray-600">Items must be exported - take them with you when leaving</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-2 border-t">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">NOT Eligible</p>
              <p className="text-sm text-gray-600">
                UAE residents, GCC nationals, items consumed in UAE, motor vehicles, services
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Claim */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">How to Claim Your Refund</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">1</div>
            <div>
              <p className="font-medium text-gray-900">Shop at Tax Free Stores</p>
              <p className="text-sm text-gray-600">Look for "Tax Free Shopping" or Planet Tax Free signs. Ask for a Tax Free form at checkout.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">2</div>
            <div>
              <p className="font-medium text-gray-900">Keep Your Receipts</p>
              <p className="text-sm text-gray-600">Get the Tax Free form with your original receipt. Don't use or open the items.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">3</div>
            <div>
              <p className="font-medium text-gray-900">Validate at Airport</p>
              <p className="text-sm text-gray-600">Before check-in, go to the Planet Tax Free counter. Present goods, receipts, and passport.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#1B4B7F] text-white rounded-full flex items-center justify-center font-semibold">4</div>
            <div>
              <p className="font-medium text-gray-900">Get Your Refund</p>
              <p className="text-sm text-gray-600">Choose cash (AED), credit card refund, or Alipay/WeChat Pay.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Refund Locations */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">
          <MapPin className="w-5 h-5 inline mr-2" />
          Refund Locations
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900">Dubai International Airport (DXB)</p>
            <p className="text-sm text-gray-600 mt-1">Terminal 1, 2, 3 - Departures area</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Open 24 hours
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900">Abu Dhabi International Airport</p>
            <p className="text-sm text-gray-600 mt-1">Terminal 1 - Departures area</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Open 24 hours
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900">Sharjah International Airport</p>
            <p className="text-sm text-gray-600 mt-1">Departures area</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Check operating hours
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900">Land Borders & Seaports</p>
            <p className="text-sm text-gray-600 mt-1">Major exit points have validation counters</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Limited hours
            </p>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="bg-yellow-50 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>• Arrive at airport 4+ hours early to allow time for refund processing</li>
          <li>• Keep items unused and in original packaging for inspection</li>
          <li>• Credit card refunds take 5-10 business days to process</li>
          <li>• Cash refunds have lower limits - check current caps</li>
          <li>• Download the Planet Tax Free app to track your refunds</li>
        </ul>
      </Card>
    </div>
  );
};

