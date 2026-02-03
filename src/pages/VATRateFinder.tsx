import React, { useState, useEffect } from 'react';
import { Search, Info, AlertTriangle, CheckCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getVATCategories, searchVATCategories, suggestVATRate } from '../lib/supabase';

interface VATCategory {
  id: string;
  code: string;
  name: string;
  name_ar: string;
  rate_type: string;
  description: string;
  conditions: string;
  common_mistakes: string;
  vat_rate_types: {
    id: string;
    name: string;
    rate: number;
    can_recover_input_vat: boolean;
    color: string;
  };
}

export const VATRateFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<VATCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<VATCategory[]>([]);
  const [selectedRateType, setSelectedRateType] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load all categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await getVATCategories();
        if (error) {
          console.error('Error loading VAT categories:', error);
          // Show helpful error message
        }
        if (data && data.length > 0) {
          setCategories(data);
          setFilteredCategories(data);
        } else {
          console.warn('No VAT categories found. Please run the SQL schema in Supabase.');
        }
      } catch (error) {
        console.error('Exception loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Filter categories based on search and rate type
  useEffect(() => {
    let filtered = categories;
    
    if (selectedRateType) {
      filtered = filtered.filter(c => c.rate_type === selectedRateType);
    }
    
    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(c => {
        const nameMatch = c.name?.toLowerCase().includes(term);
        const descMatch = c.description?.toLowerCase().includes(term);
        const codeMatch = c.code?.toLowerCase().includes(term);
        return nameMatch || descMatch || codeMatch;
      });
    }
    
    setFilteredCategories(filtered);
  }, [searchTerm, selectedRateType, categories]);

  // Get smart suggestion when search term changes
  useEffect(() => {
    const getSuggestion = async () => {
      if (searchTerm.length >= 3) {
        const result = await suggestVATRate(searchTerm);
        setSuggestion(result);
      } else {
        setSuggestion(null);
      }
    };
    getSuggestion();
  }, [searchTerm]);

  const rateTypeColors: Record<string, string> = {
    'standard': 'bg-green-100 text-green-800 border-green-200',
    'zero-rated': 'bg-blue-100 text-blue-800 border-blue-200',
    'exempt': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'out-of-scope': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const rateTypeIcons: Record<string, React.ReactNode> = {
    'standard': <CheckCircle className="w-4 h-4" />,
    'zero-rated': <Info className="w-4 h-4" />,
    'exempt': <AlertTriangle className="w-4 h-4" />,
    'out-of-scope': <HelpCircle className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">VAT Rate Finder</h1>
        <p className="text-gray-600 mt-1">
          Find the correct VAT rate for any product or service in the UAE
        </p>
      </div>

      {/* Search Box */}
      <Card>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by vendor name, product, or service (e.g., 'DEWA', 'restaurant', 'hospital')..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20 focus:border-[#1B4B7F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Smart Suggestion */}
        {suggestion?.suggestion && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  Smart Suggestion ({Math.round(suggestion.confidence * 100)}% confidence)
                </p>
                <p className="text-blue-800 mt-1">
                  "{searchTerm}" matches <strong>{suggestion.suggestion.category.name}</strong> which is{' '}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium ${rateTypeColors[suggestion.suggestion.rateType.id]}`}>
                    {suggestion.suggestion.rateType.name} ({suggestion.suggestion.rateType.rate}%)
                  </span>
                </p>
                {suggestion.suggestion.category.conditions && (
                  <p className="text-sm text-blue-700 mt-2">
                    <strong>Conditions:</strong> {suggestion.suggestion.category.conditions}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Rate Type Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedRateType(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedRateType 
              ? 'bg-[#1B4B7F] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Rates
        </button>
        <button
          onClick={() => setSelectedRateType('standard')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            selectedRateType === 'standard' 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Standard (5%)
        </button>
        <button
          onClick={() => setSelectedRateType('zero-rated')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            selectedRateType === 'zero-rated' 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          <Info className="w-4 h-4" />
          Zero-Rated (0%)
        </button>
        <button
          onClick={() => setSelectedRateType('exempt')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            selectedRateType === 'exempt' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Exempt (0%)
        </button>
      </div>

      {/* Quick Reference Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Standard Rate (5%)</h3>
          </div>
          <p className="text-sm text-green-800">
            Most goods and services. Can recover input VAT on business purchases.
          </p>
        </Card>
        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Zero-Rated (0%)</h3>
          </div>
          <p className="text-sm text-blue-800">
            VAT = 0% but CAN still recover input VAT. Exports, healthcare, education.
          </p>
        </Card>
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Exempt (0%)</h3>
          </div>
          <p className="text-sm text-yellow-800">
            VAT = 0% but CANNOT recover input VAT. Residential rent, local transport.
          </p>
        </Card>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredCategories.length} Categories Found
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-[#1B4B7F] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold text-yellow-900 mb-2">No VAT Categories Found</h3>
              <p className="text-yellow-800 text-sm mb-4">
                The VAT Rate Finder database hasn't been set up yet. Please run the SQL schema in Supabase.
              </p>
              <p className="text-yellow-700 text-xs">
                File location: <code className="bg-yellow-100 px-2 py-1 rounded">supabase_vat_rate_finder_schema.sql</code>
              </p>
              <p className="text-yellow-700 text-xs mt-2">
                Copy the SQL and run it in Supabase SQL Editor to populate the database.
              </p>
            </div>
          </Card>
        ) : filteredCategories.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No categories match your search.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category: any) => {
              const isExpanded = expandedCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                    isExpanded ? 'ring-2 ring-[#1B4B7F] shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    console.log('Clicked category:', category.id, category.name);
                    setExpandedCategory(isExpanded ? null : category.id);
                  }}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        category.rate_type === 'standard' ? 'bg-green-100' :
                        category.rate_type === 'zero-rated' ? 'bg-blue-100' :
                        category.rate_type === 'exempt' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {category.rate_type === 'standard' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {category.rate_type === 'zero-rated' && <Info className="w-4 h-4 text-blue-600" />}
                        {category.rate_type === 'exempt' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        category.rate_type === 'standard' ? 'bg-green-100 text-green-800 border-green-200' :
                        category.rate_type === 'zero-rated' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        category.rate_type === 'exempt' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {category.vat_rate_types?.rate || (category.rate_type === 'standard' ? 5 : 0)}%
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4" onClick={(e) => e.stopPropagation()}>
                      {/* Description */}
                      {category.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Description:</p>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                      )}

                      {/* Qualifying Conditions */}
                      {category.conditions && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">✓ Qualifying Conditions:</p>
                          <p className="text-sm text-blue-700 mt-1">{category.conditions}</p>
                        </div>
                      )}

                      {/* Common Mistakes */}
                      {category.common_mistakes && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium text-red-800">⚠️ Common Mistake:</p>
                          <p className="text-sm text-red-700 mt-1">{category.common_mistakes}</p>
                        </div>
                      )}

                      {/* Subcategories / Examples */}
                      {category.vat_subcategories && category.vat_subcategories.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Examples & Subcategories:</p>
                          <div className="grid gap-2">
                            {category.vat_subcategories.map((sub: any) => (
                              <div key={sub.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-800 text-sm">{sub.name}</p>
                                {sub.examples && (
                                  <p className="text-xs text-gray-600 mt-1">{sub.examples}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            This category covers: {category.description}
                          </p>
                        </div>
                      )}

                      {/* Input VAT Recovery Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm pt-2 border-t border-gray-100">
                        <span className="text-gray-600">
                          Input VAT Recovery:{' '}
                          {category.vat_rate_types?.can_recover_input_vat || category.rate_type === 'standard' || category.rate_type === 'zero-rated' ? (
                            <span className="text-green-600 font-medium">✓ Yes</span>
                          ) : (
                            <span className="text-red-600 font-medium">✗ No</span>
                          )}
                        </span>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="text-gray-400 text-xs">Code: {category.code}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Not Sure Which Rate?</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>5% Standard Rate:</strong> Use for most business expenses like office supplies, equipment, professional services, commercial rent, restaurants, hotels.</p>
          <p><strong>0% Zero-Rated:</strong> Exports outside GCC, international flights, healthcare from licensed providers, government-funded education, first residential property sale.</p>
          <p><strong>0% Exempt:</strong> Residential rent, financial services without explicit fees, local bus/taxi/metro transport, bare land.</p>
          <p className="pt-2 text-gray-500">When in doubt, use 5% Standard Rate — it's the most common for business expenses.</p>
        </div>
      </Card>
    </div>
  );
};

