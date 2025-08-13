import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

export default function SplashScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    // Navigate after 4 seconds
    const timer = setTimeout(() => {
      clearInterval(dotInterval);
      router.replace('/(tabs)/');
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(dotInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/bytedata.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>ByteData</Text>
        <Text style={styles.tagline}>Fast • Reliable • Affordable</Text>
      </View>
      
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingDots}>{dots}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },
  appName: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tagline: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
  },
  loadingDots: {
    color: theme.colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    minHeight: 40,
    minWidth: 60,
    textAlign: 'center',
  },
});