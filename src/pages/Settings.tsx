import React, { useState } from 'react';
import { User, Building, Settings as SettingsIcon, Bell, HelpCircle, Upload } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tabs } from '../components/Tabs';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { user, setUser } = useApp();
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Profile Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-[#1B4B7F] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <Button variant="secondary" size="sm">
                <Upload size={16} /> Upload Photo
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" value={user?.name || ''} onChange={() => {}} />
              <Input label="Email" type="email" value={user?.email || ''} onChange={() => {}} />
              <Input label="Phone" type="tel" placeholder="+971 XX XXX XXXX" />
              <Input label="Language" value="English" disabled />
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Change Password</h4>
              <div className="space-y-3">
                <Input label="Current Password" type="password" placeholder="Enter current password" />
                <Input label="New Password" type="password" placeholder="Enter new password" />
                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 'business',
      label: 'Business Details',
      content: (
        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Business Information</h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Business Name" value={user?.businessName || ''} onChange={() => {}} />
              <Input label="TRN" value={user?.trn || ''} helperText="15 digit number" />
              <Input label="Trade License Number" placeholder="Enter license number" />
              <Input label="Business Type" value="Trading" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200" rows={3} placeholder="Business address" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Phone" type="tel" placeholder="+971 XX XXX XXXX" />
              <Input label="Email" type="email" placeholder="business@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT Period</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200">
                <option>Monthly</option>
                <option selected>Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
              <Button variant="secondary" size="sm"><Upload size={16} /> Upload Logo</Button>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 'preferences',
      label: 'Preferences',
      content: (
        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Application Preferences</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>English</option>
                <option>العربية (Arabic)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Currency</p>
                <p className="text-sm text-gray-600">Default currency</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg" disabled>
                <option>AED (UAE Dirham)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Date Format</p>
                <p className="text-sm text-gray-600">How dates are displayed</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Enable dark theme</p>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#1B4B7F]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Default Expense Category</p>
                <p className="text-sm text-gray-600">Pre-selected category for new expenses</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Office Supplies</option>
                <option>Fuel</option>
                <option>Meals</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <Card>
          <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Notification Settings</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Email Notifications</h4>
              <div className="space-y-3">
                {[
                  { label: 'Invoice Reminders', description: 'Get reminded about pending invoices' },
                  { label: 'Payment Received', description: 'Notification when payment is received' },
                  { label: 'Deadline Alerts', description: 'VAT filing deadline reminders' },
                  { label: 'Weekly Summary', description: 'Weekly financial summary email' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-[#1B4B7F]">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Push Notifications</h4>
              <div className="space-y-3">
                {[
                  { label: 'Invoice Updates', description: 'Status changes on invoices' },
                  { label: 'Expense Alerts', description: 'New expense recorded' },
                  { label: 'Deadline Warnings', description: 'Urgent deadline notifications' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-[#1B4B7F]">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 'help',
      label: 'Help & Support',
      content: (
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                { q: 'How do I file my VAT return?', a: 'You can prepare your VAT return in the VAT Returns section, then file it officially at eservices.tax.gov.ae' },
                { q: 'What is a TRN?', a: 'TRN (Tax Registration Number) is a 15-digit number issued by the FTA when you register for VAT' },
                { q: 'How often should I file VAT returns?', a: 'Filing frequency depends on your business. Most businesses file quarterly, while larger businesses may file monthly' },
                { q: 'Can I claim VAT on all expenses?', a: 'You can only claim VAT on expenses related to your taxable business activities. Some expenses are exempt' }
              ].map((faq, i) => (
                <details key={i} className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-medium text-gray-900 cursor-pointer">{faq.q}</summary>
                  <p className="mt-2 text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold text-[#1B4B7F] mb-6">Get Help</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full"><HelpCircle size={18} /> Contact Support</Button>
              <Button variant="secondary" className="w-full">Submit Feedback</Button>
              <Button variant="secondary" className="w-full">Report Bug</Button>
            </div>
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">App Version: 1.0.0</p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-[#1B4B7F] hover:underline">Tutorial Videos</a>
                <a href="#" className="text-[#1B4B7F] hover:underline">User Guide</a>
                <a href="#" className="text-[#1B4B7F] hover:underline">API Documentation</a>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
};
