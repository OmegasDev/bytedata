import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Mail } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';

export default function RecipientScreen() {
  const { service, network, planId, planName, planPrice } = useLocalSearchParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter phone number');
      return;
    }

    router.push({
      pathname: '/purchase/payment',
      params: {
        service,
        network,
        planId,
        planName,
        planPrice,
        phoneNumber,
        email,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Recipient Details</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Plan Summary */}
        <View style={styles.planSummary}>
          <Text style={styles.planName}>{planName}</Text>
          <Text style={styles.planNetwork}>{network?.toUpperCase()}</Text>
          <Text style={styles.planPrice}>₦{planPrice}</Text>
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter recipient phone number"
              placeholderTextColor={theme.colors.textSecondary}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address (Optional)</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter email for receipt (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !phoneNumber.trim() && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!phoneNumber.trim()}>
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
    padding: 16,
  },
  planSummary: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  planName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planNetwork: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  planPrice: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  footer: {
    padding: 16,
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