import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader2, ShieldCheck, Info } from 'lucide-react';
import { validateVATEntry } from '../lib/supabase';

interface VATVerificationButtonProps {
  vendorName?: string;
  category?: string;
  description?: string;
  selectedRateType: string;
  amount: number;
  vatAmount: number;
  onValidationComplete?: (result: ValidationResult) => void;
  onRateSuggested?: (suggestedRate: string) => void;
}

interface ValidationResult {
  isValid: boolean;
  warnings: Array<{
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    suggestedRate?: string;
    suggestedCategory?: string;
  }>;
  suggestion: any;
}

export const VATVerificationButton: React.FC<VATVerificationButtonProps> = ({
  vendorName,
  category,
  description,
  selectedRateType,
  amount,
  vatAmount,
  onValidationComplete,
  onRateSuggested,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      const validationResult = await validateVATEntry({
        vendorName,
        category,
        description,
        selectedRateType,
        amount,
        vatAmount,
      });

      setResult(validationResult);
      setShowDetails(true);
      onValidationComplete?.(validationResult);
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        isValid: false,
        warnings: [{
          code: 'ERROR',
          message: 'Failed to validate. Please try again.',
          severity: 'error',
        }],
        suggestion: null,
      });
      setShowDetails(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (suggestedRate: string) => {
    onRateSuggested?.(suggestedRate);
    setResult(null);
    setShowDetails(false);
  };

  const getStatusColor = () => {
    if (!result) return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300';
    if (result.isValid && result.warnings.length === 0) {
      return 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300';
    }
    if (result.warnings.some(w => w.severity === 'error')) {
      return 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300';
    }
    return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300';
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!result) return <ShieldCheck className="w-4 h-4" />;
    if (result.isValid && result.warnings.length === 0) {
      return <CheckCircle className="w-4 h-4" />;
    }
    if (result.warnings.some(w => w.severity === 'error')) {
      return <XCircle className="w-4 h-4" />;
    }
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getButtonText = () => {
    if (loading) return 'Verifying...';
    if (!result) return 'Verify VAT Rate';
    if (result.isValid && result.warnings.length === 0) return 'VAT rate verified correctly!';
    if (result.warnings.some(w => w.severity === 'error')) return 'VAT rate incorrect!';
    return 'Review suggested changes';
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || !amount}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${getStatusColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {getStatusIcon()}
        <span>{getButtonText()}</span>
      </button>

      {/* Validation Results */}
      {showDetails && result && (
        <div className="space-y-2">
          {/* Success - No warnings */}
          {result.isValid && result.warnings.length === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">VAT rate verified correctly!</p>
                  {result.suggestion && (
                    <p className="text-sm text-green-700 mt-1">
                      Matched: {result.suggestion.category?.name} ({Math.round(result.suggestion.confidence * 100)}% confidence)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warnings and Errors */}
          {result.warnings.map((warning, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                warning.severity === 'error'
                  ? 'bg-red-50 border-red-200'
                  : warning.severity === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {warning.severity === 'error' ? (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : warning.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm ${
                    warning.severity === 'error'
                      ? 'text-red-800'
                      : warning.severity === 'warning'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}>
                    {warning.message}
                  </p>
                  
                  {/* Apply Suggestion Button */}
                  {warning.suggestedRate && onRateSuggested && (
                    <button
                      type="button"
                      onClick={() => handleApplySuggestion(warning.suggestedRate!)}
                      className={`mt-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                        warning.severity === 'error'
                          ? 'bg-red-200 hover:bg-red-300 text-red-900'
                          : 'bg-yellow-200 hover:bg-yellow-300 text-yellow-900'
                      }`}
                    >
                      Apply suggested rate: {warning.suggestedRate === 'standard' ? '5%' : warning.suggestedRate === 'zero-rated' ? '0% Zero-Rated' : '0% Exempt'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VATVerificationButton;
