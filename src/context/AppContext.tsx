import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase, getBusinessProfile, getIndividualProfile, signOut as supabaseSignOut } from '../lib/supabase';

interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  trn: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  vat_period: 'monthly' | 'quarterly';
}

interface IndividualProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  residency_status: 'resident' | 'tourist' | 'visitor' | null;
  nationality: string | null;
  created_at: string;
  updated_at: string;
}

interface AppUser {
  id: string;
  email: string;
  fullName: string;
  businessProfile: BusinessProfile | null;
  individualProfile: IndividualProfile | null;
  accountType?: 'business' | 'individual';
}

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showIndividualProfileSetup: boolean;
  setShowIndividualProfileSetup: (show: boolean) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, accountType?: 'business' | 'individual', residencyStatus?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshBusinessProfile: () => Promise<void>;
  refreshIndividualProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showIndividualProfileSetup, setShowIndividualProfileSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingUser = useRef(false); // Prevent multiple simultaneous fetches
  const onboardingCheckedRef = useRef(false); // Track if we've already checked for onboarding
  const individualProfileCheckedRef = useRef(false); // Track if we've already checked for individual profile

  const fetchAndSetUser = async (supabaseUser: any, shouldSetPage: boolean = true) => {
    // Prevent multiple simultaneous calls
    if (isFetchingUser.current) {
      console.log('Already fetching user, skipping...');
      return;
    }

    isFetchingUser.current = true;
    
    // Set user immediately with basic info to prevent hanging
    const fullName = supabaseUser.user_metadata?.full_name || 
                     supabaseUser.email?.split('@')[0] || 'User';
    
    const accountType = (supabaseUser.user_metadata?.account_type || 'business') as 'business' | 'individual';
    
    const basicUser: AppUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      fullName,
      businessProfile: null,
      individualProfile: null,
      accountType,
    };
    
    setUser(basicUser);
    // Only set page to dashboard on initial sign-in, not on token refresh
    if (shouldSetPage) {
      setCurrentPage('dashboard');
    }
    console.log('User set with basic info');

    // Fetch appropriate profile based on account type
    try {
      if (accountType === 'individual') {
        console.log('Fetching individual profile for user:', supabaseUser.id);
        
        const profileResult = await Promise.race([
          getIndividualProfile(supabaseUser.id),
          new Promise((resolve) => setTimeout(() => resolve({ data: null, error: null }), 5000))
        ]) as any;
        
        const { data: individualProfile } = profileResult || { data: null };

        if (individualProfile) {
          setUser({
            ...basicUser,
            individualProfile,
          });
          setShowIndividualProfileSetup(false);
          individualProfileCheckedRef.current = true;
          console.log('Individual profile loaded - setup closed');
        } else {
          // Check if profile is already complete in metadata
          const profileComplete = supabaseUser.user_metadata?.profile_complete;
          if (!profileComplete && !individualProfileCheckedRef.current) {
            setShowIndividualProfileSetup(true);
            console.log('No individual profile found - showing setup');
          } else {
            setShowIndividualProfileSetup(false);
            console.log('Individual profile already checked/skipped - not showing again');
          }
        }
      } else {
        // Business account - fetch business profile
        console.log('Fetching business profile for user:', supabaseUser.id);
        
        const profileResult = await Promise.race([
          getBusinessProfile(supabaseUser.id),
          new Promise((resolve) => setTimeout(() => resolve({ data: null, error: null }), 5000))
        ]) as any;
        
        const { data: businessProfile } = profileResult || { data: null };

        if (businessProfile) {
          setUser({
            ...basicUser,
            businessProfile,
          });
          setShowOnboarding(false);
          onboardingCheckedRef.current = true;
          console.log('Business profile loaded - onboarding closed');
        } else {
          if (!onboardingCheckedRef.current) {
            setShowOnboarding(true);
            console.log('No business profile found - showing onboarding');
          } else {
            setShowOnboarding(false);
            console.log('Onboarding already checked/skipped - not showing again');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile (non-critical):', error);
      // On error, don't show setup - let the user continue using the app
      setShowOnboarding(false);
      setShowIndividualProfileSetup(false);
    } finally {
      isFetchingUser.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Safety timeout - always set loading to false after 10 seconds max
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - forcing loading to false');
        setIsLoading(false);
      }
    }, 10000);

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session retrieved:', session ? 'exists' : 'none');
        
        if (session?.user) {
          // On initial load, set page to dashboard if no user was previously set
          await fetchAndSetUser(session.user, !user);
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          console.log('Auth initialization complete, loading set to false');
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Only set page to dashboard on actual sign-in
            await fetchAndSetUser(session.user, true);
          } catch (error) {
            console.error('Error in auth state change:', error);
          } finally {
            // Ensure loading is set to false even if there's an error
            if (mounted) {
              clearTimeout(timeoutId);
              setIsLoading(false);
              console.log('Auth state change complete, loading set to false');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCurrentPage('landing');
          setShowOnboarding(false);
          setShowIndividualProfileSetup(false);
          setIsLoading(false);
          onboardingCheckedRef.current = false; // Reset on sign out
          individualProfileCheckedRef.current = false; // Reset on sign out
        } else if (event === 'TOKEN_REFRESHED') {
          // Token was refreshed - update session but DON'T redirect or reset page
          console.log('Token refreshed - updating session without changing page');
          if (session?.user) {
            // Update user but don't change currentPage
            await fetchAndSetUser(session.user, false);
          }
          if (mounted) {
            setIsLoading(false);
          }
        } else if (event === 'USER_UPDATED' && session?.user) {
          // User metadata updated - update user but don't change page
          console.log('User updated - refreshing user data');
          await fetchAndSetUser(session.user, false);
          if (mounted) {
            setIsLoading(false);
          }
        } else if (event === 'INITIAL_SESSION') {
          // This event fires after initial session check
          if (mounted) {
            clearTimeout(timeoutId);
            setIsLoading(false);
            console.log('Initial session event, loading set to false');
          }
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      await fetchAndSetUser(data.user);
    }
    return { error };
  };

  const handleSignUp = async (email: string, password: string, fullName?: string, accountType?: 'business' | 'individual', residencyStatus?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          full_name: fullName,
          account_type: accountType || 'business',
          residency_status: residencyStatus,
        } 
      },
    });

    if (!error && data.user) {
      const userAccountType = (data.user.user_metadata?.account_type || accountType || 'business') as 'business' | 'individual';
      
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        fullName: fullName || email.split('@')[0],
        businessProfile: null,
        accountType: userAccountType,
      });
      
      // Show appropriate profile setup based on account type
      if (userAccountType === 'business') {
        setShowOnboarding(true);
      } else {
        setShowIndividualProfileSetup(true);
      }
      setCurrentPage('dashboard');
    }
    return { error };
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    await supabaseSignOut();
    setUser(null);
    setCurrentPage('landing');
    setShowOnboarding(false);
  };

  const refreshBusinessProfile = async () => {
    if (!user?.id) return;
    const { data: businessProfile } = await getBusinessProfile(user.id);
    if (businessProfile) {
      setUser(prevUser => prevUser ? { ...prevUser, businessProfile } : null);
      setShowOnboarding(false); // Close onboarding if profile is successfully refreshed
      onboardingCheckedRef.current = true; // Mark as checked
      console.log('Business profile refreshed - onboarding closed');
    } else {
      // If no profile found, don't change showOnboarding state
      // Let it stay as is to avoid flickering
      console.log('No business profile found on refresh');
    }
  };

  const refreshIndividualProfile = async () => {
    if (!user?.id) return;
    const { data: individualProfile } = await getIndividualProfile(user.id);
    if (individualProfile) {
      setUser(prevUser => prevUser ? { ...prevUser, individualProfile } : null);
      setShowIndividualProfileSetup(false); // Close setup if profile is successfully refreshed
      individualProfileCheckedRef.current = true; // Mark as checked
      console.log('Individual profile refreshed - setup closed');
    } else {
      console.log('No individual profile found on refresh');
    }
  };

  return (
    <AppContext.Provider value={{
      user, setUser, currentPage, setCurrentPage,
      showOnboarding, setShowOnboarding, 
      showIndividualProfileSetup, setShowIndividualProfileSetup,
      isLoading,
      signIn: handleSignIn, signUp: handleSignUp, signOut: handleSignOut,
      refreshBusinessProfile, refreshIndividualProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
