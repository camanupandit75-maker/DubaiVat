import React, { useState } from 'react';
import { Plus, Trash2, Eye, Download, Mail, Save } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { createInvoice, validateVATEntry } from '../lib/supabase';
import { VATVerificationButton } from '../components/VATVerificationButton';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatRateType?: 'standard' | 'zero-rated' | 'exempt';
}

export const InvoiceGenerator: React.FC = () => {
  const { user } = useApp();
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveInvoice = async (status: 'draft' | 'sent' = 'draft') => {
    if (!user?.businessProfile?.id) {
      alert('Please complete your business profile first');
      return;
    }

    if (!invoiceData.customerName.trim()) {
      setSaveError('Customer name is required');
      return;
    }

    if (items.length === 0 || items.some(item => !item.description.trim() || item.unitPrice <= 0)) {
      setSaveError('Please add at least one valid invoice item');
      return;
    }

    setSaving(true);
    setSaveError('');

    const invoiceDataToSave = {
      business_id: user.businessProfile.id,
      invoice_number: invoiceData.invoiceNumber || generateInvoiceNumber(),
      customer_name: invoiceData.customerName,
      customer_email: invoiceData.customerEmail || null,
      customer_trn: invoiceData.customerTRN || null,
      customer_address: invoiceData.customerAddress || null,
      date: invoiceData.invoiceDate,
      due_date: invoiceData.dueDate || null,
      subtotal: subtotal,
      vat_amount: totalVAT,
      total: total,
      status: status,
      notes: invoiceData.notes || null,
    };

    const invoiceItems = items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      amount: item.quantity * item.unitPrice,
      vat_rate: item.vatRateType === 'standard' ? 5 : 0,
    }));

    const { data, error } = await createInvoice(invoiceDataToSave, invoiceItems);

    setSaving(false);

    if (error) {
      setSaveError(error.message || 'Failed to save invoice');
    } else {
      alert(`Invoice saved successfully as ${status === 'draft' ? 'draft' : 'sent'}!`);
      // Reset form
      setInvoiceData({
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        customerName: '',
        customerTRN: '',
        customerEmail: '',
        customerAddress: '',
        paymentTerms: 'net30',
        notes: ''
      });
      setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 5 }]);
      setSaveError('');
    }
  };

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${random}`;
  };

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    customerName: '',
    customerTRN: '',
    customerEmail: '',
    customerAddress: '',
    paymentTerms: 'net30',
    notes: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 5, vatRateType: 'standard' }
  ]);

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 5,
      vatRateType: 'standard'
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemAmount = (item: InvoiceItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateItemVAT = (item: InvoiceItem) => {
    if (item.vatRateType === 'standard') {
      return calculateItemAmount(item) * 0.05;
    }
    return 0; // zero-rated or exempt
  };

  const updateVATRateType = (id: string, rateType: 'standard' | 'zero-rated' | 'exempt') => {
    setItems(items.map(item => {
      if (item.id === id) {
        const vatRate = rateType === 'standard' ? 5 : 0;
        return { ...item, vatRateType: rateType, vatRate };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  const totalVAT = items.reduce((sum, item) => sum + calculateItemVAT(item), 0);
  const total = subtotal + totalVAT;

  const validateTRN = (trn: string) => {
    const cleaned = trn.replace(/\s/g, '');
    if (!trn) return { valid: true, message: '' };
    if (cleaned.length !== 15) return { valid: false, message: 'TRN must be 15 digits' };
    if (!/^\d+$/.test(cleaned)) return { valid: false, message: 'TRN must contain only numbers' };
    return { valid: true, message: '✓ Valid format' };
  };

  const trnValidation = validateTRN(invoiceData.customerTRN);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">Invoice Generator</h1>
        <p className="text-gray-600 mt-1">Create professional VAT-compliant invoices</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-[#1B4B7F] mb-6">Invoice Details</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Your Business Details</h3>
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium">{user?.businessProfile?.business_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">TRN</p>
                  <p className="font-medium">{user?.businessProfile?.trn || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Customer Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Customer Name"
                  placeholder="Customer name"
                  value={invoiceData.customerName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                  required
                />
                <Input
                  label="Customer TRN (Optional)"
                  placeholder="100 2345 6789 1234"
                  value={invoiceData.customerTRN}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerTRN: e.target.value })}
                  success={invoiceData.customerTRN && trnValidation.valid ? trnValidation.message : undefined}
                  error={invoiceData.customerTRN && !trnValidation.valid ? trnValidation.message : undefined}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="customer@email.com"
                  value={invoiceData.customerEmail}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                />
                <Input
                  label="Address"
                  placeholder="Customer address"
                  value={invoiceData.customerAddress}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Invoice Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Invoice Number"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                  required
                />
                <Input
                  label="Invoice Date"
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                  required
                />
                <Input
                  label="Due Date"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Line Items</h3>
                <Button variant="tertiary" size="sm" onClick={addItem}>
                  <Plus size={16} /> Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid md:grid-cols-5 gap-3">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="Unit Price"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex gap-1">
                          <button
                            type="button"
                            onClick={() => updateVATRateType(item.id, 'standard')}
                            className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-colors ${
                              item.vatRateType === 'standard'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            5%
                          </button>
                          <button
                            type="button"
                            onClick={() => updateVATRateType(item.id, 'zero-rated')}
                            className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-colors ${
                              item.vatRateType === 'zero-rated'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            0% ZR
                          </button>
                          <button
                            type="button"
                            onClick={() => updateVATRateType(item.id, 'exempt')}
                            className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-colors ${
                              item.vatRateType === 'exempt'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            0% EX
                          </button>
                        </div>
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm">
                        {item.description && item.unitPrice > 0 && (
                          <VATVerificationButton
                            vendorName={invoiceData.customerName}
                            category={item.description}
                            description={item.description}
                            selectedRateType={item.vatRateType || 'standard'}
                            amount={calculateItemAmount(item)}
                            vatAmount={calculateItemVAT(item)}
                            onValidationComplete={(result) => {
                              if (!result.isValid) {
                                console.log('VAT validation warnings for item:', item.description, result.warnings);
                              }
                            }}
                            onRateSuggested={(suggestedRate) => {
                              // Update the line item's VAT rate
                              updateVATRateType(item.id, suggestedRate as 'standard' | 'zero-rated' | 'exempt');
                            }}
                          />
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <span className="text-gray-600">Amount: </span>
                        <span className="font-medium text-[#1B4B7F]">
                          AED {calculateItemAmount(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes / Terms & Conditions
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="Additional notes or payment terms..."
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-700 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT:</span>
                <span>AED {totalVAT.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg text-[#1B4B7F]">Total:</span>
                  <span className="font-bold text-2xl text-[#1B4B7F]">AED {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-700 mb-4">Actions</h3>
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
                {saveError}
              </div>
            )}
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setShowPreview(true)}>
                <Eye size={18} /> Preview Invoice
              </Button>
              <Button variant="secondary" className="w-full">
                <Download size={18} /> Download PDF
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => handleSaveInvoice('sent')}
                disabled={saving}
              >
                <Mail size={18} /> Save & Send
              </Button>
              <Button 
                variant="tertiary" 
                className="w-full"
                onClick={() => handleSaveInvoice('draft')}
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Invoice Preview"
        size="lg"
      >
        <div className="bg-white p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B4B7F]">{user?.businessProfile?.business_name || 'Business Name'}</h2>
            <p className="text-gray-600">TRN: {user?.businessProfile?.trn || 'Not set'}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
              <p className="font-medium">{invoiceData.customerName}</p>
              {invoiceData.customerTRN && <p className="text-sm text-gray-600">TRN: {invoiceData.customerTRN}</p>}
              <p className="text-sm text-gray-600">{invoiceData.customerAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Invoice #: {invoiceData.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Date: {invoiceData.invoiceDate}</p>
              <p className="text-sm text-gray-600">Due Date: {invoiceData.dueDate}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3 text-sm">Description</th>
                <th className="text-right py-2 px-3 text-sm">Qty</th>
                <th className="text-right py-2 px-3 text-sm">Price</th>
                <th className="text-right py-2 px-3 text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-3">{item.description}</td>
                  <td className="text-right py-2 px-3">{item.quantity}</td>
                  <td className="text-right py-2 px-3">AED {item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-2 px-3">AED {calculateItemAmount(item).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <span>AED {totalVAT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoiceData.notes && (
            <div className="mt-8 pt-8 border-t">
              <h4 className="font-semibold mb-2">Notes:</h4>
              <p className="text-sm text-gray-600">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
