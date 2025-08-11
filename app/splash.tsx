import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/');
    }, 3000);

    return () => clearTimeout(timer);
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
        <View style={styles.loadingBar}>
          <View style={styles.loadingProgress} />
        </View>
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
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    width: '60%',
  },
  loadingBar: {
    height: 4,
    backgroundColor: theme.colors.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});