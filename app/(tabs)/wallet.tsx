import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>No Wallet Needed!</Text>
          <Text style={styles.description}>
            With our new system, you don't need to maintain a wallet balance. 
            Simply pay directly for each purchase using your card via Paystack.
          </Text>
          <Text style={styles.benefits}>
            ✅ No need to pre-fund wallet{'\n'}
            ✅ Pay only when you need services{'\n'}
            ✅ Secure card payments{'\n'}
            ✅ Instant delivery after payment
          </Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => router.push('/(tabs)/buy')}>
            <Text style={styles.buyButtonText}>Buy Data or Airtime</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  benefits: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 24,
  },
  buyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buyButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});