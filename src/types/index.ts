export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  trn?: string;
  accountType: 'business' | 'individual';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerTRN?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  amount: number;
}

export interface Expense {
  id: string;
  vendor: string;
  trn?: string;
  date: string;
  amount: number;
  vat: number;
  total: number;
  category: string;
  notes?: string;
  receiptImage?: string;
}

export interface VATStats {
  vatCollected: number;
  vatPaid: number;
  netVAT: number;
  nextDeadline: string;
}
