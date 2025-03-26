// Import polyfills first
import './src/lib/polyfills';

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';
import { linking } from './src/utils/linking';

// Suppress specific warnings that are not relevant to the app functionality
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native',
  // Add any other warnings you want to suppress here
]);

console.log('Starting app with full authentication flow');

export default function App() {
  useEffect(() => {
    console.log('App mounted with full auth flow');
    
    // Add punycode polyfill if needed at runtime
    if (typeof window !== 'undefined' && !window.punycode) {
      console.log('Adding punycode polyfill from App.js');
      // We already have this in polyfills.js, but adding here as backup
    }
  }, []);
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}