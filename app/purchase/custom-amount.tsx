import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, DollarSign } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';

export default function CustomAmountScreen() {
  const { service, network } = useLocalSearchParams<{ service: string; network: string }>();
  const [amount, setAmount] = useState('');

  const minAmount = service === 'data' ? 50 : 50;
  const maxAmount = service === 'data' ? 50000 : 10000;

  const handleContinue = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount.trim() || isNaN(numAmount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (numAmount < minAmount) {
      Alert.alert('Amount Too Low', `Minimum amount is ₦${minAmount}`);
      return;
    }

    if (numAmount > maxAmount) {
      Alert.alert('Amount Too High', `Maximum amount is ₦${maxAmount}`);
      return;
    }

    router.push({
      pathname: '/purchase/recipient',
      params: {
        service,
        network,
        planId: `custom-${Date.now()}`,
        planName: `₦${numAmount} ${service === 'data' ? 'Data' : 'Airtime'}`,
        planPrice: numAmount.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Custom Amount</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>
            {service === 'data' ? 'Custom Data Purchase' : 'Custom Airtime Purchase'}
          </Text>
          <Text style={styles.networkText}>{network?.toUpperCase()}</Text>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.inputLabel}>Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.limitInfo}>
            <Text style={styles.limitText}>
              Min: ₦{minAmount} • Max: ₦{maxAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.quickAmounts}>
          <Text style={styles.quickTitle}>Quick Select</Text>
          <View style={styles.quickGrid}>
            {[100, 200, 500, 1000, 2000, 5000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickButton}
                onPress={() => setAmount(quickAmount.toString())}>
                <Text style={styles.quickButtonText}>₦{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !amount.trim() && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!amount.trim()}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  serviceInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  serviceTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  networkText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  amountSection: {
    marginBottom: 32,
  },
  inputLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  currencySymbol: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 20,
    paddingVertical: 16,
    fontWeight: '600',
  },
  limitInfo: {
    marginTop: 8,
  },
  limitText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  quickAmounts: {
    marginBottom: 32,
  },
  quickTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  continueButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});