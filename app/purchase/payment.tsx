import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { paymentService } from '@/services/payment';
import { gladtidingsService } from '@/services/gladtidings';
import { theme } from '@/styles/theme';

export default function PaymentScreen() {
  const { service, network, planName, planPrice, phoneNumber, email, planId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const amount = parseFloat(planPrice as string);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Generate payment reference
      const reference = paymentService.generateReference();
      
      // Initialize Paystack payment
      const paymentData = {
        email: (email as string) || 'user@bytedata.com',
        amount: amount,
        reference: reference,
        callback_url: 'https://bytedata.com/payment/callback',
        metadata: {
          service,
          network,
          planName,
          planId,
          phoneNumber,
        },
      };

      const paymentResponse = await paymentService.initializePayment(paymentData);
      
      if (paymentResponse.status) {
        // In a real app, you would open the authorization_url in a webview
        // For now, we'll simulate the payment process
        Alert.alert(
          'Payment Initialized',
          'In a real app, this would open Paystack payment page. Simulating payment...',
          [
            {
              text: 'Simulate Success',
              onPress: () => simulatePaymentSuccess(reference),
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setLoading(false),
            },
          ]
        );
      } else {
        Alert.alert('Payment Error', 'Unable to initialize payment. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert('Error', 'Unable to process payment. Please try again.');
      setLoading(false);
    }
  };

  const simulatePaymentSuccess = async (reference: string) => {
    try {
      // Simulate payment verification
      const verificationResponse = await paymentService.verifyPayment(reference);
      
      if (verificationResponse.status && verificationResponse.data.status === 'success') {
        // Process purchase via GladtidingsData
        let purchaseResponse;
        
        if (service === 'data') {
          purchaseResponse = await gladtidingsService.buyData({
            network: network as string,
            plan_id: planId as string,
            phone: phoneNumber as string,
            amount: amount,
            reference: reference,
          });
        } else {
          purchaseResponse = await gladtidingsService.buyAirtime({
            network: network as string,
            phone: phoneNumber as string,
            amount: amount,
            reference: reference,
          });
        }
        
        if (purchaseResponse.status) {
          // Navigate to success screen
          router.push({
            pathname: '/purchase/success',
            params: {
              service,
              network,
              planName,
              amount: amount.toString(),
              phoneNumber,
              reference,
            },
          });
        } else {
          Alert.alert('Purchase Failed', purchaseResponse.message || 'Unable to complete the purchase. Please contact support.');
        }
      } else {
        Alert.alert('Payment Failed', 'Payment was not successful. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'An error occurred while processing your purchase. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{service?.toUpperCase()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Network:</Text>
            <Text style={styles.summaryValue}>{network?.toUpperCase()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan:</Text>
            <Text style={styles.summaryValue}>{planName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phone:</Text>
            <Text style={styles.summaryValue}>{phoneNumber}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₦{amount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethod}>
          <View style={styles.methodIcon}>
            <CreditCard size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Pay with Card</Text>
            <Text style={styles.methodDescription}>
              Secure payment via Paystack
            </Text>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityText}>
            🔒 Your payment is secured by Paystack's industry-standard encryption
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}>
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : `Pay ₦${amount.toFixed(2)}`}
          </Text>
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
  orderSummary: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethod: {
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  methodIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  methodDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  securityNotice: {
    backgroundColor: theme.colors.success + '20',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  securityText: {
    color: theme.colors.success,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  payButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  payButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});