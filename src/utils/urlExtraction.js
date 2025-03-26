import { Linking } from 'react-native';

// Register for initial URL (if app was opened via deep link)
export async function registerForInitialURL() {
  try {
    const initialURL = await Linking.getInitialURL();
    if (initialURL) {
      console.log('App opened with URL:', initialURL);
      processURL(initialURL);
    }
  } catch (error) {
    console.error('Error getting initial URL:', error);
  }
}

// Add listener for deep links received while app is running
export function addLinkingListener() {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    console.log('Received URL while app running:', url);
    processURL(url);
  });
  
  return () => {
    subscription.remove();
  };
}

// Process the URL (extract tokens, etc.)
export function processURL(url) {
  if (!url) return;
  
  try {
    // Handle auth callbacks from magic link
    if (url.includes('auth-callback')) {
      console.log('Processing auth callback URL:', url);
      // The Supabase SDK will automatically handle the token extraction
    }
  } catch (error) {
    console.error('Error processing URL:', error);
  }
}

// Additional linking configuration for React Navigation
export const linking = {
  prefixes: ['habitsapp://', 'https://habitsapp.com'],
  config: {
    screens: {
      Login: 'login',
      Dashboard: 'dashboard',
      HabitDetails: 'habit/:id',
      Chat: 'chat',
      Profile: 'profile',
    },
  },
};