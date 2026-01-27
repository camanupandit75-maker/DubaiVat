import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentPage,
        setCurrentPage,
        showOnboarding,
        setShowOnboarding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
