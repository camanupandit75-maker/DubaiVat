import React, { useState } from 'react';
import {
  Home,
  FileText,
  Receipt,
  Calculator,
  PlusCircle,
  BarChart3,
  Settings,
  Bell,
  User,
  Menu,
  X,
  BookOpen,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageToggle } from './LanguageToggle';
import { UserMenu } from './UserMenu';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentPage, setCurrentPage, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'expense-tracker', label: 'Expenses', icon: Receipt },
    { id: 'vat-returns', label: 'VAT Returns', icon: Calculator },
    { id: 'vat-rates', label: 'VAT Rate Finder', icon: Calculator },
    { id: 'calculators', label: 'Calculators', icon: PlusCircle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'professionals', label: 'Professionals', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2">
                <Calculator className="text-[#C5A572]" size={28} />
                <span className="text-lg font-bold text-[#1B4B7F] hidden sm:block">
                  Dubai Tax Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <button className="relative text-gray-600 hover:text-[#1B4B7F] transition-colors">
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-sm transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 z-40`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                    ? 'bg-[#1B4B7F] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${currentPage === item.id
                  ? 'text-[#1B4B7F] bg-blue-50'
                  : 'text-gray-600'
                  }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
