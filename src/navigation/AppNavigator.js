import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { Text, View, ActivityIndicator } from 'react-native';

// Placeholder screens for demo purposes
const LoginScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Login Screen</Text>
  </View>
);

const DashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Dashboard Screen</Text>
  </View>
);

const ChatScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Chat Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

// Load Screen when checking authentication
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

// Create the stacks
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

// Auth Stack Navigator (when user is not authenticated)
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

// App Stack Navigator (when user is authenticated)
const AppStackNavigator = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="Dashboard" component={DashboardScreen} />
    <AppStack.Screen name="Chat" component={ChatScreen} />
    <AppStack.Screen name="Profile" component={ProfileScreen} />
  </AppStack.Navigator>
);

// Main navigator component
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? <AppStackNavigator /> : <AuthNavigator />;
};

export default AppNavigator;