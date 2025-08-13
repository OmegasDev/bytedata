import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react-native';
import { router } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { WalletContext } from '@/contexts/WalletContext';
import { theme } from '@/styles/theme';

const quickAmounts = [100, 200, 500, 1000, 2000, 5000, 10000];

export default function TopupScreen() {
  const { user } = useContext(AuthContext);
  const { creditWallet, addTransaction } = useContext(WalletContext);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleTopup = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < 100) {
      Alert.alert('Invalid Amount', 'Minimum top-up amount is ₦100');
      return;
    }

    setLoading(true);
    try {
      // Mock Paystack integration - replace with actual Paystack
      const reference = `TOP${Date.now()}`;
      
      // Simulate payment success
      setTimeout(() => {
        creditWallet(amount);
        addTransaction({
          amount,
          type: 'credit',
          category: 'Wallet',
          description: 'Wallet Top-up',
          status: 'completed',
        });
        
        Alert.alert(
          'Top-up Successful!',
          `₦${amount.toFixed(2)} has been added to your wallet`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Top-up Failed', 'Please try again');
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Hi! Please help me fund my ByteData wallet:

Account Name: ByteData Wallet
Account Number: 1234567890
Bank: Providus Bank

Any amount you send will reflect in my wallet. Thanks! 🙏`;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/bytedata.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.backgroundOverlay} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Fund Wallet</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Select or enter amount to add</Text>

          {/* Wallet Details */}
          <View style={styles.walletDetails}>
            <Text style={styles.walletTitle}>Fund via Bank Transfer</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Name:</Text>
              <Text style={styles.detailValue}>ByteData Wallet</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number:</Text>
              <Text style={styles.detailValue}>1234567890</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank:</Text>
              <Text style={styles.detailValue}>Providus Bank</Text>
            </View>
            <Text style={styles.transferNote}>
              Transfer any amount and it will reflect in your wallet within 5 minutes
            </Text>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonSelected,
                ]}
                onPress={() => handleAmountSelect(amount)}>
                <Text
                  style={[
                    styles.amountText,
                    selectedAmount === amount && styles.amountTextSelected,
                  ]}>
                  ₦{amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.customAmountSection}>
            <Text style={styles.inputLabel}>Or enter custom amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={customAmount}
                onChangeText={(text) => {
                  setCustomAmount(text);
                  setSelectedAmount(null);
                }}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Payment Method */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share Wallet Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.topupButton,
              (!customAmount || loading) && styles.topupButtonDisabled,
            ]}
            onPress={handleTopup}
            disabled={!customAmount || loading}>
            <Text style={styles.topupButtonText}>
              {loading ? 'Processing...' : `Pay with Card - ₦${customAmount || '0'}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.03,
    resizeMode: 'cover',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 20, 25, 0.95)',
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
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 24,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  amountButton: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  amountButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  amountText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  amountTextSelected: {
    color: theme.colors.primary,
  },
  customAmountSection: {
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
  },
  currencySymbol: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 18,
    paddingVertical: 16,
  },
  paymentMethod: {
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  topupButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  topupButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  topupButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  walletDetails: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  walletTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  transferNote: {
    color: theme.colors.primary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  shareButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  shareButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});