import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Wallet, CreditCard } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { WalletContext } from '@/contexts/WalletContext';
import { theme } from '@/styles/theme';

export default function PaymentScreen() {
  const { service, network, planName, planPrice, phoneNumber, email } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const { balance, debitWallet, addTransaction } = useContext(WalletContext);
  const [selectedPayment, setSelectedPayment] = useState<'wallet' | 'card' | null>(null);

  const amount = parseFloat(planPrice as string);
  const canUseWallet = user && balance >= amount;

  const handleWalletPayment = () => {
    if (!canUseWallet) {
      Alert.alert('Insufficient Balance', 'Your wallet balance is too low for this purchase.');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Purchase ${planName} for ${phoneNumber}?\nAmount: ₦${amount.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: processWalletPayment,
        },
      ]
    );
  };

  const processWalletPayment = () => {
    if (debitWallet(amount)) {
      addTransaction({
        amount,
        type: 'debit',
        category: service as string,
        description: `${planName} - ${phoneNumber}`,
        status: 'completed',
      });

      router.push({
        pathname: '/purchase/success',
        params: {
          service,
          network,
          planName,
          amount: amount.toString(),
          phoneNumber,
          reference: `BYT${Date.now()}`,
        },
      });
    } else {
      Alert.alert('Payment Failed', 'Unable to process wallet payment.');
    }
  };

  const handleCardPayment = () => {
    // This would normally integrate with Paystack
    router.push({
      pathname: '/purchase/paystack-webview',
      params: {
        service,
        network,
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
        <Text style={styles.title}>Payment Method</Text>
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

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.methodsTitle}>Select Payment Method</Text>

          {user && (
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPayment === 'wallet' && styles.paymentMethodSelected,
                !canUseWallet && styles.paymentMethodDisabled,
              ]}
              onPress={() => setSelectedPayment('wallet')}
              disabled={!canUseWallet}>
              <View style={styles.methodLeft}>
                <Wallet size={24} color={canUseWallet ? theme.colors.primary : theme.colors.textSecondary} />
                <View style={styles.methodInfo}>
                  <Text style={[
                    styles.methodName,
                    !canUseWallet && { color: theme.colors.textSecondary }
                  ]}>
                    Wallet Balance
                  </Text>
                  <Text style={styles.methodBalance}>₦{balance.toFixed(2)}</Text>
                </View>
              </View>
              {canUseWallet && selectedPayment === 'wallet' && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedPayment === 'card' && styles.paymentMethodSelected,
            ]}
            onPress={() => setSelectedPayment('card')}>
            <View style={styles.methodLeft}>
              <CreditCard size={24} color={theme.colors.secondary} />
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Pay with Card</Text>
                <Text style={styles.methodDescription}>Secure payment via Paystack</Text>
              </View>
            </View>
            {selectedPayment === 'card' && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            !selectedPayment && styles.payButtonDisabled,
          ]}
          onPress={selectedPayment === 'wallet' ? handleWalletPayment : handleCardPayment}
          disabled={!selectedPayment}>
          <Text style={styles.payButtonText}>
            Pay ₦{amount.toFixed(2)}
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
  paymentMethods: {
    marginBottom: 24,
  },
  methodsTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethod: {
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: theme.colors.primary,
  },
  paymentMethodDisabled: {
    opacity: 0.5,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: 12,
  },
  methodName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodDescription: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  methodBalance: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
  footer: {
    padding: 16,
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