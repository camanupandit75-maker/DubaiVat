import React, { useState } from 'react';
import { Camera, Upload, Check, AlertCircle, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ReceiptScanner: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState({
    vendor: '',
    trn: '',
    date: '',
    amount: '',
    vat: '',
    category: '',
    notes: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setTimeout(() => {
          setExtractedData({
            vendor: 'Emirates Office Supplies',
            trn: '100234567891234',
            date: '2026-01-27',
            amount: '1250.00',
            vat: '59.52',
            category: 'office-supplies',
            notes: ''
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateTRN = (trn: string) => {
    const cleaned = trn.replace(/\s/g, '');
    if (!trn) return { valid: false, message: '', color: 'text-gray-400' };
    if (cleaned.length !== 15) return { valid: false, message: '❌ Invalid format - TRN must be 15 digits', color: 'text-red-600' };
    if (!/^\d+$/.test(cleaned)) return { valid: false, message: '❌ Invalid format - TRN must contain only numbers', color: 'text-red-600' };
    return { valid: true, message: '✓ Format valid', color: 'text-green-600' };
  };

  const trnValidation = validateTRN(extractedData.trn);

  const handleSave = () => {
    alert('Expense saved successfully!');
    setUploadedImage(null);
    setExtractedData({
      vendor: '',
      trn: '',
      date: '',
      amount: '',
      vat: '',
      category: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">Receipt Scanner</h1>
        <p className="text-gray-600 mt-1">Upload or scan receipts to automatically extract expense data</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-[#1B4B7F] mb-6">Upload Receipt</h2>

          {!uploadedImage ? (
            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#1B4B7F] transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">Click to upload or drag receipt image</p>
                  <p className="text-sm text-gray-400">Supports JPG, PNG, PDF</p>
                </div>
              </label>

              <div className="text-center">
                <span className="text-gray-500">or</span>
              </div>

              <label htmlFor="file-upload">
                <Button variant="secondary" className="w-full" as="span">
                  <Camera size={20} /> Take Photo
                </Button>
              </label>

              <Button variant="secondary" className="w-full">
                <Upload size={20} /> Upload File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Receipt"
                  className="w-full rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {extractedData.vendor ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <Check className="text-green-600" size={24} />
                  <span className="text-green-700 font-medium">Data extracted successfully!</span>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1B4B7F]"></div>
                  <span className="text-blue-700">Processing receipt...</span>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#1B4B7F] mb-6">Expense Details</h2>

          <div className="space-y-4">
            <Input
              label="Vendor Name"
              placeholder="Vendor name"
              value={extractedData.vendor}
              onChange={(e) => setExtractedData({ ...extractedData, vendor: e.target.value })}
              required
            />

            <div>
              <Input
                label="Tax Registration Number (TRN)"
                placeholder="100 2345 6789 1234"
                value={extractedData.trn}
                onChange={(e) => setExtractedData({ ...extractedData, trn: e.target.value })}
                helperText="15 digit number"
              />
              {extractedData.trn && (
                <div className={`mt-2 flex items-center space-x-2 ${trnValidation.color}`}>
                  {trnValidation.valid ? (
                    <Check size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span className="text-sm font-medium">{trnValidation.message}</span>
                </div>
              )}
            </div>

            <Input
              label="Date"
              type="date"
              value={extractedData.date}
              onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (excluding VAT)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={extractedData.amount}
                onChange={(e) => setExtractedData({ ...extractedData, amount: e.target.value })}
                required
              />

              <Input
                label="VAT Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={extractedData.vat}
                onChange={(e) => setExtractedData({ ...extractedData, vat: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
                value={extractedData.category}
                onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                <option value="office-supplies">Office Supplies</option>
                <option value="fuel">Fuel & Transportation</option>
                <option value="meals">Meals & Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="equipment">Equipment</option>
                <option value="professional-services">Professional Services</option>
                <option value="marketing">Marketing & Advertising</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="Additional notes..."
                value={extractedData.notes}
                onChange={(e) => setExtractedData({ ...extractedData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={handleSave}>
                <Check size={18} /> Save Expense
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setUploadedImage(null);
                  setExtractedData({
                    vendor: '',
                    trn: '',
                    date: '',
                    amount: '',
                    vat: '',
                    category: '',
                    notes: ''
                  });
                }}
              >
                Scan Another
              </Button>
            </div>

            <Button variant="tertiary" className="w-full">
              Discard
            </Button>
          </div>
        </Card>
      </div>

      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">About TRN Verification</h3>
            <p className="text-blue-800 text-sm">
              The validation indicator shows whether the TRN format is correct (15 digits).
              However, this does not verify if the TRN is registered with the FTA.
              Always verify supplier credentials through official FTA channels at eservices.tax.gov.ae
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
