import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import { OnboardingModal } from './components/OnboardingModal';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { InvoiceGenerator } from './pages/InvoiceGenerator';
import { ReceiptScanner } from './pages/ReceiptScanner';
import { ExpenseTracker } from './pages/ExpenseTracker';
import { VATCalculator } from './pages/VATCalculator';
import { VATReturns } from './pages/VATReturns';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { EducationCenter } from './pages/EducationCenter';
import { ProfessionalDirectory } from './pages/ProfessionalDirectory';

function AppContent() {
  const { currentPage, user, showOnboarding, setShowOnboarding } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <InvoiceGenerator />;
      case 'expenses':
        return <ReceiptScanner />;
      case 'expense-tracker':
        return <ExpenseTracker />;
      case 'calculators':
        return <VATCalculator />;
      case 'vat-returns':
        return <VATReturns />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'education':
        return <EducationCenter />;
      case 'professionals':
        return <ProfessionalDirectory />;
      default:
        return <LandingPage />;
    }
  };

  if (!user) {
    return renderPage();
  }

  return (
    <>
      <AppLayout>{renderPage()}</AppLayout>
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
