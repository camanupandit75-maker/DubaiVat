import React, { useState, useEffect } from 'react';
import { Calculator, Check, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../context/AppContext';
import { createBusinessProfile, updateBusinessProfile, getBusinessProfile } from '../lib/supabase';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { user, refreshBusinessProfile, setShowOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);
  const justSavedRef = React.useRef(false);

  // Check if profile exists when modal opens - if it does, close immediately
  useEffect(() => {
    if (isOpen && user?.id) {
      const checkProfile = async () => {
        const { data: profile } = await getBusinessProfile(user.id);
        if (profile) {
          // Profile exists, close modal immediately
          console.log('Profile exists - closing onboarding modal');
          onComplete();
        }
      };
      // Check immediately when modal opens
      checkProfile();
    }
  }, [isOpen, user?.id, onComplete]);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [trn, setTrn] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [vatPeriod, setVatPeriod] = useState<'monthly' | 'quarterly'>('quarterly');

  // Load existing profile data if it exists
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (user?.id && step === 4 && !justSavedRef.current) {
        const { data: profile } = await getBusinessProfile(user.id);
        if (profile) {
          setExistingProfileId(profile.id);
          setBusinessName(profile.business_name || '');
          setTrn(profile.trn || '');
          setAddress(profile.address || '');
          setPhone(profile.phone || '');
          setEmail(profile.email || user.email || '');
          setVatPeriod(profile.vat_period || 'quarterly');
        }
      }
    };
    loadExistingProfile();
  }, [user?.id, step]);

  if (!isOpen) return null;

  const handleSkip = () => {
    // Allow users to skip business profile setup
    console.log('User skipped business profile setup');
    // Mark onboarding as checked so it doesn't show again
    setShowOnboarding(false);
    // Call onComplete to close the modal immediately
    onComplete();
  };

  const handleComplete = async () => {
    if (!user?.id) return;
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }

    setSaving(true);
    setError('');

    const profileData = {
      business_name: businessName,
      trn: trn || null,
      address: address || null,
      phone: phone || null,
      email: email || user.email,
      vat_period: vatPeriod,
    };

    let saveError = null;

    // If profile exists, update it; otherwise create new one
    if (existingProfileId) {
      const { error: updateError } = await updateBusinessProfile(existingProfileId, profileData);
      saveError = updateError;
    } else {
      const { error: createError } = await createBusinessProfile({
        user_id: user.id,
        ...profileData,
      });
      saveError = createError;
    }

    setSaving(false);

    if (saveError) {
      // Handle duplicate key error specifically
      if (saveError.message?.includes('duplicate key') || saveError.code === '23505') {
        // Profile was created by another process, try to update it
        const { data: existingProfile } = await getBusinessProfile(user.id);
        if (existingProfile) {
          setExistingProfileId(existingProfile.id);
          const { error: updateError } = await updateBusinessProfile(existingProfile.id, profileData);
          if (updateError) {
            setError(updateError.message || 'Failed to update business profile');
          } else {
            await refreshBusinessProfile();
            onComplete();
          }
        } else {
          setError('A business profile already exists. Please refresh the page.');
        }
      } else {
        setError(saveError.message || 'Failed to save business profile');
      }
    } else {
      // Mark as just saved to prevent immediate re-opening
      setJustSaved(true);
      
      // Refresh the business profile and wait for it to update
      await refreshBusinessProfile();
      
      // Small delay to ensure state updates propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the profile was saved by checking again
      const { data: savedProfile } = await getBusinessProfile(user.id);
      if (savedProfile) {
        // Profile exists, close the modal
        console.log('Business profile saved and verified');
        onComplete();
      } else {
        // Profile still not found, but close anyway - will be loaded on next page load
        console.warn('Profile saved but not immediately available - closing modal');
        onComplete();
      }
    }
  };

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
                  onClick={() => setStep(4)}
                >
                  Continue <Check size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1B4B7F] mb-2 text-center">
                Complete Your Business Profile
              </h2>
              <p className="text-gray-600 text-sm text-center mb-6">
                Optional - Skip if you're registering as an individual
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Business Name"
                  placeholder="Your Business LLC"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  disabled={saving}
                />

                <Input
                  label="Tax Registration Number (TRN)"
                  placeholder="100 2345 6789 1234"
                  value={trn}
                  onChange={(e) => setTrn(e.target.value)}
                  helperText="15 digit number (optional)"
                  disabled={saving}
                />

                <Input
                  label="Business Address"
                  placeholder="Enter your business address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={saving}
                />

                <Input
                  label="Phone Number"
                  placeholder="+971 XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={saving}
                />

                <Input
                  type="email"
                  label="Business Email"
                  placeholder="business@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={saving}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Filing Period
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
                    value={vatPeriod}
                    onChange={(e) => setVatPeriod(e.target.value as 'monthly' | 'quarterly')}
                    disabled={saving}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={saving}
                  onClick={handleSkip}
                >
                  Skip for Now
                </Button>
                <Button
                  size="lg"
                  disabled={!businessName.trim() || saving}
                  onClick={handleComplete}
                >
                  {saving ? 'Saving...' : 'Complete Setup'} <Check size={20} />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((i) => (
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
