import React, { useState } from 'react';
import { User, MapPin, Plane, Home, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

interface IndividualProfileSetupProps {
  user: any;
  onComplete: () => void;
}

export const IndividualProfileSetup: React.FC<IndividualProfileSetupProps> = ({ user, onComplete }) => {
  const { refreshIndividualProfile } = useApp();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [residencyStatus, setResidencyStatus] = useState<'resident' | 'tourist' | null>(null);
  const [nationality, setNationality] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!fullName || !residencyStatus) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create individual profile
      const { error: profileError } = await supabase
        .from('individual_profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          email: user.email,
          residency_status: residencyStatus,
          nationality: nationality || null,
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Update user metadata to mark profile as complete
      await supabase.auth.updateUser({
        data: { 
          profile_complete: true,
          residency_status: residencyStatus,
        }
      });

      // Refresh individual profile in context
      if (refreshIndividualProfile) {
        await refreshIndividualProfile();
      }

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4B7F] to-[#0d2844] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#1B4B7F]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B4B7F]">Complete Your Profile</h1>
          <p className="text-gray-500 mt-1">Tell us a bit about yourself</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20 focus:border-[#1B4B7F]"
              placeholder="Enter your full name"
            />
          </div>

          {/* Residency Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a... <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResidencyStatus('resident')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  residencyStatus === 'resident'
                    ? 'border-[#1B4B7F] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Home className={`w-6 h-6 mb-2 ${residencyStatus === 'resident' ? 'text-[#1B4B7F]' : 'text-gray-400'}`} />
                <span className="font-medium block">UAE Resident</span>
                <p className="text-xs text-gray-500 mt-1">I live in UAE</p>
              </button>
              
              <button
                type="button"
                onClick={() => setResidencyStatus('tourist')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  residencyStatus === 'tourist'
                    ? 'border-[#1B4B7F] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plane className={`w-6 h-6 mb-2 ${residencyStatus === 'tourist' ? 'text-[#1B4B7F]' : 'text-gray-400'}`} />
                <span className="font-medium block">Tourist / Visitor</span>
                <p className="text-xs text-gray-500 mt-1">Visiting UAE</p>
              </button>
            </div>
          </div>

          {/* Nationality (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20 focus:border-[#1B4B7F]"
              placeholder="e.g., Indian, British, American"
            />
          </div>

          {/* Info Box for Tourists */}
          {residencyStatus === 'tourist' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>💡 Did you know?</strong> As a tourist, you can claim back VAT on purchases over AED 250 when leaving UAE!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !fullName || !residencyStatus}
            className="w-full py-3 bg-[#1B4B7F] text-white rounded-xl font-medium hover:bg-[#153d66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Complete Setup
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};



