import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { WalletContext } from '@/contexts/WalletContext';
import { paystackService } from '@/services/paystack';
import { vtpassService } from '@/services/vtpass';
import { theme } from '@/styles/theme';

export default function PaystackWebviewScreen() {
  const { service, network, planName, planPrice, phoneNumber, email } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const { addTransaction } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);

  const amount = parseFloat(planPrice as string);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Generate reference
      const reference = paystackService.generateReference();
      
      // Initialize Paystack payment
      const paymentData = {
        email: email as string || 'user@example.com',
        amount: amount,
        reference: reference,
        callback_url: 'https://example.com/paystack/callback',
        metadata: {
          service,
          network,
          planName,
          phoneNumber,
          userId: user?.id || 'guest',
        },
      };

      const paymentResponse = await paystackService.initializePayment(paymentData);
      
      if (paymentResponse.status) {
        // In a real app, you would open the authorization_url in a webview
        // For now, we'll simulate a successful payment
        setTimeout(async () => {
          try {
            // Simulate payment verification
            const verificationResponse = await paystackService.verifyPayment(reference);
            
            if (verificationResponse.status && verificationResponse.data.status === 'success') {
              // Process VTPass purchase
              const vtpassData = {
                serviceID: getServiceID(service as string, network as string),
                billersCode: phoneNumber as string,
                variation_code: getVariationCode(planName as string),
                amount: amount,
                phone: phoneNumber as string,
                request_id: reference,
              };

              const purchaseResponse = await vtpassService.makePurchase(vtpassData);
              
              if (purchaseResponse.code === '000') {
                // Add transaction record
                if (user) {
                  addTransaction({
                    amount,
                    type: 'debit',
                    category: service as string,
                    description: `${planName} - ${phoneNumber}`,
                    status: 'completed',
                  });
                }

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
                Alert.alert('Purchase Failed', 'Unable to complete the purchase. Please try again.');
              }
            } else {
              Alert.alert('Payment Failed', 'Payment was not successful. Please try again.');
            }
          } catch (error) {
            console.error('Purchase error:', error);
            Alert.alert('Error', 'An error occurred while processing your purchase.');
          } finally {
            setLoading(false);
          }
        }, 3000); // Simulate 3 second payment process
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

  const getServiceID = (service: string, network: string): string => {
    const serviceMap: { [key: string]: { [key: string]: string } } = {
      data: {
        mtn: 'mtn-data',
        airtel: 'airtel-data',
        glo: 'glo-data',
        '9mobile': 'etisalat-data',
      },
      airtime: {
        mtn: 'mtn',
        airtel: 'airtel',
        glo: 'glo',
        '9mobile': 'etisalat',
      },
    };
    return serviceMap[service]?.[network] || 'mtn-data';
  };

  const getVariationCode = (planName: string): string => {
    // This would normally come from the plan selection
    // For now, we'll use a default based on plan name
    const planCode = planName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${planCode}-code`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Pay with Card</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
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
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₦{amount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethod}>
          <View style={styles.methodIcon}>
            <CreditCard size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Secure Card Payment</Text>
            <Text style={styles.methodDescription}>
              Pay securely with your debit/credit card via Paystack
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
            {loading ? 'Processing Payment...' : `Pay ₦${amount.toFixed(2)}`}
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
    padding: 20,
  },
  summaryCard: {
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