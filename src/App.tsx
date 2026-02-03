import React, { useState, useEffect } from 'react';
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
import { VATRateFinder } from './pages/VATRateFinder';
import { IndividualDashboard } from './pages/IndividualDashboard';
import { TouristRefund } from './pages/TouristRefund';
import { IndividualProfileSetup } from './pages/IndividualProfileSetup';

function AppContent() {
  const { currentPage, user, showOnboarding, setShowOnboarding, showIndividualProfileSetup, setShowIndividualProfileSetup, isLoading, refreshBusinessProfile, refreshIndividualProfile } = useApp();
  const [forceShow, setForceShow] = useState(false);

  // Safety timeout - show app after 12 seconds even if still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading timeout - forcing app to show');
        setForceShow(true);
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Show loading spinner while checking auth (unless forced to show)
  if (isLoading && !forceShow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B4B7F] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-400">If this takes too long, try refreshing the page</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    const accountType = user?.accountType || 'business';
    
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        if (!user) return <LandingPage />;
        return accountType === 'individual' ? <IndividualDashboard /> : <Dashboard />;
      case 'invoices':
        return accountType === 'individual' ? <IndividualDashboard /> : <InvoiceGenerator />;
      case 'expenses':
        return <ReceiptScanner />;
      case 'expense-tracker':
        return accountType === 'individual' ? <ReceiptScanner /> : <ExpenseTracker />;
      case 'calculators':
        return <VATCalculator />;
      case 'tourist-refund':
        return <TouristRefund />;
      case 'vat-returns':
        return accountType === 'individual' ? <IndividualDashboard /> : <VATReturns />;
      case 'vat-rates':
        return <VATRateFinder />;
      case 'reports':
        return accountType === 'individual' ? <IndividualDashboard /> : <Reports />;
      case 'settings':
        return <Settings />;
      case 'education':
        return <EducationCenter />;
      case 'professionals':
        return accountType === 'individual' ? <IndividualDashboard /> : <ProfessionalDirectory />;
      default:
        return <LandingPage />;
    }
  };

  if (!user) {
    return renderPage();
  }

  // Show individual profile setup for individual users without profile
  if (user.accountType === 'individual' && showIndividualProfileSetup && !user.individualProfile) {
    return (
      <IndividualProfileSetup
        user={user}
        onComplete={async () => {
          setShowIndividualProfileSetup(false);
          // Refresh individual profile
          if (refreshIndividualProfile) {
            await refreshIndividualProfile();
          }
        }}
      />
    );
  }

  // Show business onboarding for business users without profile
  if (user.accountType === 'business' && showOnboarding && !user.businessProfile) {
    return (
      <>
        <AppLayout>{renderPage()}</AppLayout>
        <OnboardingModal
          isOpen={true}
          onComplete={async () => {
            setShowOnboarding(false);
            refreshBusinessProfile().catch(console.error);
          }}
        />
      </>
    );
  }

  return (
    <AppLayout>{renderPage()}</AppLayout>
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
