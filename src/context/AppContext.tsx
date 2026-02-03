import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase, getBusinessProfile, signOut as supabaseSignOut } from '../lib/supabase';

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

interface AppUser {
  id: string;
  email: string;
  fullName: string;
  businessProfile: BusinessProfile | null;
  accountType?: 'business' | 'individual';
}

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, accountType?: 'business' | 'individual', residencyStatus?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshBusinessProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingUser = useRef(false); // Prevent multiple simultaneous fetches
  const onboardingCheckedRef = useRef(false); // Track if we've already checked for onboarding

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
      accountType,
    };
    
    setUser(basicUser);
    // Only set page to dashboard on initial sign-in, not on token refresh
    if (shouldSetPage) {
      setCurrentPage('dashboard');
    }
    console.log('User set with basic info');

    // Then try to fetch business profile (non-blocking)
    try {
      console.log('Fetching business profile for user:', supabaseUser.id);
      
      // Use a simpler approach - just call it directly with a timeout wrapper
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
        setShowOnboarding(false); // Ensure onboarding is closed if profile exists
        onboardingCheckedRef.current = true; // Mark as checked
        console.log('Business profile loaded - onboarding closed');
      } else {
        // Only show onboarding if we haven't already checked and closed it
        // But also check if user explicitly skipped it
        if (!onboardingCheckedRef.current) {
          setShowOnboarding(true);
          console.log('No business profile found - showing onboarding');
        } else {
          // Already checked or skipped, don't show again
          setShowOnboarding(false);
          console.log('Onboarding already checked/skipped - not showing again');
        }
      }
    } catch (error) {
      console.error('Error fetching business profile (non-critical):', error);
      // On error, don't show onboarding - let the user continue using the app
      // They can manually complete profile if needed
      setShowOnboarding(false);
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
          setIsLoading(false);
          onboardingCheckedRef.current = false; // Reset on sign out
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
      
      // Only show onboarding for business accounts
      if (userAccountType === 'business') {
        setShowOnboarding(true);
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

  return (
    <AppContext.Provider value={{
      user, setUser, currentPage, setCurrentPage,
      showOnboarding, setShowOnboarding, isLoading,
      signIn: handleSignIn, signUp: handleSignUp, signOut: handleSignOut,
      refreshBusinessProfile,
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
