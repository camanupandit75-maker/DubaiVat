import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ============ AUTH ============
export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// ============ BUSINESS PROFILE ============
export const getBusinessProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no profile gracefully
    
    // If no profile exists, that's okay - return null data, no error
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      console.error('Error fetching business profile:', error);
      return { data: null, error };
    }
    
    return { data: data || null, error: null };
  } catch (error) {
    console.error('Exception fetching business profile:', error);
    return { data: null, error };
  }
};

export const createBusinessProfile = async (profile: any) => {
  const { data, error } = await supabase
    .from('business_profiles')
    .insert(profile)
    .select()
    .single();
  return { data, error };
};

export const updateBusinessProfile = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('business_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// ============ INVOICES ============
export const getInvoices = async (businessId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('business_id', businessId)
    .order('date', { ascending: false });
  return { data, error };
};

export const getInvoiceById = async (id: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createInvoice = async (invoice: any, items: any[]) => {
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single();

  if (invoiceError || !invoiceData) return { data: null, error: invoiceError };

  if (items.length > 0) {
    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoice_id: invoiceData.id,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);

    if (itemsError) {
      await supabase.from('invoices').delete().eq('id', invoiceData.id);
      return { data: null, error: itemsError };
    }
  }

  return { data: invoiceData, error: null };
};

export const updateInvoice = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteInvoice = async (id: string) => {
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  return { error };
};

// ============ EXPENSES ============
export const getExpenses = async (businessId: string) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('business_id', businessId)
    .order('date', { ascending: false });
  return { data, error };
};

export const createExpense = async (expense: any) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();
  return { data, error };
};

export const updateExpense = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  return { error };
};

// ============ CUSTOMERS ============
export const getCustomers = async (businessId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', businessId)
    .order('name');
  return { data, error };
};

export const createCustomer = async (customer: any) => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();
  return { data, error };
};

// ============ VAT SUMMARY ============
export const getVATSummary = async (businessId: string, startDate: string, endDate: string) => {
  try {
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('vat_amount, subtotal')
      .eq('business_id', businessId)
      .gte('date', startDate)
      .lte('date', endDate)
      .neq('status', 'draft');

    if (invoicesError) {
      console.error('Error fetching invoices for VAT summary:', invoicesError);
      throw invoicesError;
    }

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('vat_amount, amount')
      .eq('business_id', businessId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (expensesError) {
      console.error('Error fetching expenses for VAT summary:', expensesError);
      throw expensesError;
    }

    const vatCollected = invoices?.reduce((sum, inv) => sum + Number(inv.vat_amount || 0), 0) || 0;
    const totalSales = invoices?.reduce((sum, inv) => sum + Number(inv.subtotal || 0), 0) || 0;
    const vatPaid = expenses?.reduce((sum, exp) => sum + Number(exp.vat_amount || 0), 0) || 0;
    const totalPurchases = expenses?.reduce((sum, exp) => sum + Number(exp.amount || 0), 0) || 0;

    return { vatCollected, vatPaid, netVAT: vatCollected - vatPaid, totalSales, totalPurchases };
  } catch (error) {
    console.error('Error in getVATSummary:', error);
    // Return zeros on error to prevent hanging
    return { vatCollected: 0, vatPaid: 0, netVAT: 0, totalSales: 0, totalPurchases: 0 };
  }
};

// ============ FILE STORAGE ============
export const uploadReceipt = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from('receipts').upload(fileName, file);
  if (error) return { url: null, error };

  const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
  return { url: urlData.publicUrl, error: null };
};

// ============ VAT RATE FINDER HELPERS ============

// Get all VAT rate types
export const getVATRateTypes = async () => {
  const { data, error } = await supabase
    .from('vat_rate_types')
    .select('*')
    .order('rate', { ascending: false });
  return { data, error };
};

// Get all VAT categories with rate type info AND subcategories
export const getVATCategories = async (rateType?: string) => {
  let query = supabase
    .from('vat_categories')
    .select(`
      *,
      vat_rate_types (*),
      vat_subcategories (*)
    `)
    .eq('is_active', true)
    .order('display_order');

  if (rateType) {
    query = query.eq('rate_type', rateType);
  }

  const { data, error } = await query;
  return { data, error };
};

// Search VAT categories
export const searchVATCategories = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('vat_categories')
    .select(`
      *,
      vat_rate_types (*)
    `)
    .eq('is_active', true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`)
    .order('display_order');
  return { data, error };
};

// Get suggested VAT rate based on vendor name/description
export const suggestVATRate = async (text: string) => {
  const searchText = text.toLowerCase().trim();
  
  // First, try to find matching keywords
  const { data: keywords, error } = await supabase
    .from('vat_keywords')
    .select(`
      *,
      vat_categories (
        *,
        vat_rate_types (*)
      )
    `)
    .order('confidence_score', { ascending: false });
  
  if (error || !keywords) return { suggestion: null, confidence: 0 };
  
  // Find best matching keyword
  let bestMatch = null;
  let highestConfidence = 0;
  
  for (const kw of keywords) {
    if (searchText.includes(kw.keyword.toLowerCase())) {
      if (kw.confidence_score > highestConfidence) {
        highestConfidence = kw.confidence_score;
        bestMatch = kw;
      }
    }
  }
  
  if (bestMatch && bestMatch.vat_categories) {
    return {
      suggestion: {
        category: bestMatch.vat_categories,
        rateType: bestMatch.vat_categories.vat_rate_types,
        matchedKeyword: bestMatch.keyword,
      },
      confidence: highestConfidence,
    };
  }
  
  return { suggestion: null, confidence: 0 };
};

// Validate VAT rate entry against keywords database
export const validateVATEntry = async (entry: {
  vendorName?: string;
  category?: string;
  description?: string;
  selectedRateType: string;
  amount: number;
  vatAmount: number;
}) => {
  const warnings: Array<{
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    suggestedRate?: string;
    suggestedCategory?: string;
  }> = [];

  // Combine all text fields for searching
  const searchText = [entry.vendorName, entry.category, entry.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .trim();

  if (!searchText) {
    // No text to validate - just check VAT calculation
    const expectedRate = entry.selectedRateType === 'standard' ? 0.05 : 0;
    const expectedVAT = entry.amount * expectedRate;
    const tolerance = 1;
    
    if (Math.abs(entry.vatAmount - expectedVAT) > tolerance) {
      warnings.push({
        code: 'VAT_CALCULATION_ERROR',
        message: `VAT amount (AED ${entry.vatAmount.toFixed(2)}) doesn't match expected (AED ${expectedVAT.toFixed(2)}).`,
        severity: 'error',
      });
    }
    
    return { isValid: warnings.length === 0, warnings, suggestion: null };
  }

  // Get all keywords with their categories
  const { data: keywords, error } = await supabase
    .from('vat_keywords')
    .select(`
      keyword,
      confidence_score,
      vat_categories (
        id,
        code,
        name,
        rate_type,
        description,
        conditions,
        common_mistakes
      )
    `)
    .order('confidence_score', { ascending: false });

  if (error || !keywords) {
    console.error('Error fetching keywords:', error);
    return { isValid: true, warnings: [], suggestion: null };
  }

  // Find ALL matching keywords
  const matches: Array<{
    keyword: string;
    confidence: number;
    category: any;
  }> = [];

  for (const kw of keywords) {
    if (!kw.vat_categories) continue;
    const kwLower = kw.keyword.toLowerCase();
    // Check if keyword is found in the search text
    if (searchText.includes(kwLower)) {
      matches.push({
        keyword: kw.keyword,
        confidence: kw.confidence_score,
        category: kw.vat_categories,
      });
    }
  }

  // Get the best match (highest confidence)
  const bestMatch = matches.length > 0 
    ? matches.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      )
    : null;

  // If we found a match, check if selected rate matches
  if (bestMatch && bestMatch.category) {
    const expectedRateType = bestMatch.category.rate_type;
    const selectedRate = entry.selectedRateType;

    // Check if rates match
    if (expectedRateType !== selectedRate) {
      // Determine severity based on the mismatch
      let severity: 'error' | 'warning' | 'info' = 'warning';
      
      // Critical errors
      if (expectedRateType === 'exempt' && selectedRate === 'standard') {
        severity = 'error'; // Charging VAT on exempt item
      } else if (expectedRateType === 'standard' && selectedRate !== 'standard') {
        severity = 'error'; // Not charging VAT when should
      } else if (expectedRateType === 'zero-rated' && selectedRate === 'exempt') {
        severity = 'warning'; // Both 0% but different recovery rules
      }

      const rateNames: Record<string, string> = {
        'standard': 'Standard Rate (5%)',
        'zero-rated': 'Zero-Rated (0%)',
        'exempt': 'Exempt (0%)',
      };

      warnings.push({
        code: 'RATE_MISMATCH',
        message: `"${bestMatch.keyword}" matches "${bestMatch.category.name}" which should be ${rateNames[expectedRateType]}. You selected ${rateNames[selectedRate]}.`,
        severity,
        suggestedRate: expectedRateType,
        suggestedCategory: bestMatch.category.name,
      });

      // Add common mistake info if available
      if (bestMatch.category.common_mistakes) {
        warnings.push({
          code: 'COMMON_MISTAKE',
          message: `Common mistake: ${bestMatch.category.common_mistakes}`,
          severity: 'info',
        });
      }
    }
  }

  // Validate VAT calculation
  const expectedRate = entry.selectedRateType === 'standard' ? 0.05 : 0;
  const expectedVAT = entry.amount * expectedRate;
  const tolerance = 1; // 1 AED tolerance for rounding

  if (Math.abs(entry.vatAmount - expectedVAT) > tolerance) {
    const ratePercent = entry.selectedRateType === 'standard' ? '5%' : '0%';
    warnings.push({
      code: 'VAT_CALCULATION_ERROR',
      message: `VAT amount (AED ${entry.vatAmount.toFixed(2)}) doesn't match ${ratePercent} of AED ${entry.amount.toFixed(2)} (expected AED ${expectedVAT.toFixed(2)}).`,
      severity: 'error',
    });
  }

  return {
    isValid: !warnings.some(w => w.severity === 'error'),
    warnings,
    suggestion: bestMatch ? {
      category: bestMatch.category,
      matchedKeyword: bestMatch.keyword,
      confidence: bestMatch.confidence,
    } : null,
  };
};

// Get category by code
export const getVATCategoryByCode = async (code: string) => {
  const { data, error } = await supabase
    .from('vat_categories')
    .select(`
      *,
      vat_rate_types (*),
      vat_subcategories (*)
    `)
    .eq('code', code)
    .single();
  return { data, error };
};

