import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (showSplash || loading) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="purchase" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <WalletProvider>
        <RootNavigator />
        <StatusBar style="light" backgroundColor="#1A1F36" />
      </WalletProvider>
    </AuthProvider>
  );
}