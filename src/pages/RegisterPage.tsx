import React, { useState } from 'react';
import { Calculator, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

export const RegisterPage: React.FC = () => {
  const { setCurrentPage, signUp } = useApp();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<'business' | 'individual'>('business');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    trn: '',
    businessType: '',
    vatPeriod: 'quarterly'
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateTRN = (trn: string) => {
    const cleaned = trn.replace(/\s/g, '');
    if (cleaned.length !== 15) return { valid: false, message: 'TRN must be 15 digits' };
    if (!/^\d+$/.test(cleaned)) return { valid: false, message: 'TRN must contain only numbers' };
    return { valid: true, message: 'Valid format' };
  };

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/\d/)) strength += 25;
    if (pwd.match(/[^a-zA-Z\d]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < (accountType === 'business' ? 4 : 3)) {
      setStep(step + 1);
      return;
    }

    // Final step - create account
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(formData.email, formData.password, formData.name);
    
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'Failed to create account');
      // Go back to step 2 to show error
      setStep(2);
    }
    // Success is handled by AppContext automatically - it will show onboarding
  };

  const trnValidation = validateTRN(formData.trn);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calculator className="text-[#C5A572]" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-[#1B4B7F] mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Step {step} of {accountType === 'business' ? 4 : 3}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[...Array(accountType === 'business' ? 4 : 3)].map((_, i) => (
              <React.Fragment key={i}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i + 1 <= step ? 'bg-[#1B4B7F] text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i + 1 < step ? <Check size={16} /> : i + 1}
                </div>
                {i < (accountType === 'business' ? 3 : 2) && (
                  <div className={`w-12 h-1 ${i + 1 < step ? 'bg-[#1B4B7F]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAccountType('business')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      accountType === 'business'
                        ? 'border-[#1B4B7F] bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-[#1B4B7F] mb-1">Business Owner</div>
                    <div className="text-sm text-gray-600">For companies and traders</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      accountType === 'individual'
                        ? 'border-[#1B4B7F] bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-[#1B4B7F] mb-1">Individual</div>
                    <div className="text-sm text-gray-600">For personal use</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                label="Email Address"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div>
                <Input
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    calculatePasswordStrength(e.target.value);
                  }}
                  required
                />
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength >= 75 ? 'bg-green-500' :
                          passwordStrength >= 50 ? 'bg-yellow-500' :
                          passwordStrength >= 25 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {passwordStrength >= 75 ? 'Strong' :
                       passwordStrength >= 50 ? 'Good' :
                       passwordStrength >= 25 ? 'Fair' : 'Weak'}
                    </span>
                  </div>
                </div>
              </div>
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
                required
              />
            </div>
          )}

          {step === 3 && accountType === 'business' && (
            <div className="space-y-4">
              <Input
                label="Business Name"
                placeholder="Your Business LLC"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
              <div>
                <Input
                  label="Tax Registration Number (TRN)"
                  placeholder="100 2345 6789 1234"
                  value={formData.trn}
                  onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                  helperText="15 digit number"
                  success={formData.trn && trnValidation.valid ? `✓ ${trnValidation.message}` : undefined}
                  error={formData.trn && !trnValidation.valid ? trnValidation.message : undefined}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  required
                >
                  <option value="">Select business type</option>
                  <option value="trading">Trading</option>
                  <option value="retail">Retail</option>
                  <option value="services">Services</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VAT Period
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
                  value={formData.vatPeriod}
                  onChange={(e) => setFormData({ ...formData, vatPeriod: e.target.value })}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
          )}

          {((step === 4 && accountType === 'business') || (step === 3 && accountType === 'individual')) && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-[#1B4B7F] mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  {accountType === 'business' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business:</span>
                        <span className="font-medium">{formData.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TRN:</span>
                        <span className="font-medium">{formData.trn}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded border-gray-300 text-[#1B4B7F] focus:ring-[#1B4B7F]"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#1B4B7F] hover:underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#1B4B7F] hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>
          )}

          <div className="flex space-x-4">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating Account...' : (step < (accountType === 'business' ? 4 : 3) ? 'Next' : 'Create Account')}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-[#1B4B7F] font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
