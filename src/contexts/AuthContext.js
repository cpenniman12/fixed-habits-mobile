import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import supabase from '../lib/supabase';
import { registerForInitialURL, addLinkingListener } from '../utils/urlExtraction';

// Create the authentication context
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
});

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize: check for user session and set up deep link handling
    const initialize = async () => {
      setLoading(true);
      
      // Check for active session
      await checkUser();
      
      // Check if app was opened via deep link (for magic link auth)
      if (Platform.OS !== 'web') {
        await registerForInitialURL();
      }
      
      setLoading(false);
    };

    initialize();

    // Subscribe to auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setUser(session?.user || null);
      
      if (_event === 'SIGNED_IN') {
        console.log("User signed in:", session?.user?.email);
      } else if (_event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    // Set up listener for deep links received while app is running
    const unsubscribeDeepLinks = addLinkingListener();

    // Cleanup on unmount
    return () => {
      data.subscription.unsubscribe();
      unsubscribeDeepLinks();
    };
  }, []);

  // Check if the user is already logged in
  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error.message);
        return;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        console.log("Existing user session found:", data.session.user.email);
      }
    } catch (error) {
      console.error('Error checking user session:', error.message);
    }
  }

  // Sign in with email (magic link)
  async function signIn(email) {
    try {
      setLoading(true);
      
      // Determine appropriate redirect URL based on platform
      let redirectURL;
      
      if (Platform.OS === 'web') {
        // For web, we can use the current URL
        redirectURL = window.location.origin;
      } else {
        // For mobile, use the deep link URL
        redirectURL = 'habitsapp://auth-callback';
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectURL,
        },
      });

      if (error) throw error;

      Alert.alert(
        'Magic link sent!',
        'Check your email for the login link. If you don\\'t see it, check your spam folder.'
      );
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error.message);
      Alert.alert('Error', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  // Sign out
  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  // Return auth context provider
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;