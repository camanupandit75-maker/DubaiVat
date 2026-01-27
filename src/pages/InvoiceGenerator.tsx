import React, { useState } from 'react';
import { Plus, Trash2, Eye, Download, Mail, Save } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export const InvoiceGenerator: React.FC = () => {
  const { user } = useApp();
  const [showPreview, setShowPreview] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-2024-004',
    invoiceDate: '2026-01-27',
    dueDate: '2026-02-27',
    customerName: '',
    customerTRN: '',
    customerEmail: '',
    customerAddress: '',
    paymentTerms: 'net30',
    notes: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 5 }
  ]);

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 5
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
    return calculateItemAmount(item) * (item.vatRate / 100);
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
                  <p className="font-medium">{user?.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">TRN</p>
                  <p className="font-medium">{user?.trn}</p>
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
                        <select
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          value={item.vatRate}
                          onChange={(e) => updateItem(item.id, 'vatRate', parseFloat(e.target.value))}
                        >
                          <option value="5">5% VAT</option>
                          <option value="0">0% VAT</option>
                          <option value="-1">Exempt</option>
                        </select>
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
                    <div className="mt-2 text-right text-sm">
                      <span className="text-gray-600">Amount: </span>
                      <span className="font-medium text-[#1B4B7F]">
                        AED {calculateItemAmount(item).toFixed(2)}
                      </span>
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
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setShowPreview(true)}>
                <Eye size={18} /> Preview Invoice
              </Button>
              <Button variant="secondary" className="w-full">
                <Download size={18} /> Download PDF
              </Button>
              <Button variant="secondary" className="w-full">
                <Mail size={18} /> Email Invoice
              </Button>
              <Button variant="tertiary" className="w-full">
                <Save size={18} /> Save Draft
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
            <h2 className="text-3xl font-bold text-[#1B4B7F]">{user?.businessName}</h2>
            <p className="text-gray-600">TRN: {user?.trn}</p>
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
