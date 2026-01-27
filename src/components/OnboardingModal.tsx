import React, { useState } from 'react';
import { Calculator, Check, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const features = [
    {
      icon: '📊',
      title: 'Track VAT Automatically',
      description: 'Monitor VAT collected and paid in real-time with automatic calculations'
    },
    {
      icon: '📄',
      title: 'Generate Compliant Invoices',
      description: 'Create FTA-compliant invoices with all required details'
    },
    {
      icon: '📸',
      title: 'Scan & Store Receipts',
      description: 'Never lose a receipt again with digital scanning and storage'
    },
    {
      icon: '📅',
      title: 'Never Miss Deadlines',
      description: 'Get reminders for VAT filing deadlines and payment dates'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
          {step === 1 && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Calculator className="text-[#C5A572]" size={64} />
              </div>
              <h2 className="text-3xl font-bold text-[#1B4B7F] mb-4">
                Welcome to Dubai Tax Assistant
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Your complete solution for UAE VAT compliance and tax management
              </p>
              <Button size="lg" onClick={() => setStep(2)}>
                Get Started
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1B4B7F] mb-6 text-center">
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-[#1B4B7F] mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-yellow-600" size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#1B4B7F] mb-6 text-center">
                Important: TRN Verification
              </h2>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  This app provides <strong>format validation for TRNs only</strong>.
                  We do <strong>NOT</strong> verify TRNs against the FTA database.
                </p>

                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-[#1B4B7F]">You are responsible for:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#C5A572] mt-1">•</span>
                      <span className="text-gray-700">Working with legitimate suppliers and verifying their credentials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#C5A572] mt-1">•</span>
                      <span className="text-gray-700">Verifying TRN authenticity through official FTA channels</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#C5A572] mt-1">•</span>
                      <span className="text-gray-700">Maintaining accurate records and tax compliance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#C5A572] mt-1">•</span>
                      <span className="text-gray-700">Filing your VAT returns correctly and on time</span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700 italic">
                  We provide tools to help organize your records, but <strong>YOU</strong> remain
                  responsible for your tax obligations.
                </p>
              </div>

              <label className="flex items-start space-x-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-[#1B4B7F] focus:ring-[#1B4B7F]"
                />
                <span className="text-gray-700">
                  I understand and agree to these terms. I acknowledge that I am responsible
                  for verifying all tax information and maintaining compliance with UAE VAT regulations.
                </span>
              </label>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  disabled={!agreed}
                  onClick={onComplete}
                >
                  Get Started <Check size={20} />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-[#1B4B7F]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
