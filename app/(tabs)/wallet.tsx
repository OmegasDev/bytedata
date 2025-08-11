import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { WalletContext } from '@/contexts/WalletContext';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

export default function WalletScreen() {
  const { user } = useContext(AuthContext);
  const { balance, transactions } = useContext(WalletContext);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestText}>
            Please log in to access your wallet
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/bytedata.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.backgroundOverlay} />
        
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <TouchableOpacity>
            <Eye size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.fundButton}
            onPress={() => router.push('/wallet/topup')}>
            <Plus size={20} color={theme.colors.background} />
            <Text style={styles.fundButtonText}>Fund Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          {transactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {transaction.type === 'credit' ? (
                  <ArrowDownLeft size={20} color={theme.colors.success} />
                ) : (
                  <ArrowUpRight size={20} color={theme.colors.error} />
                )}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.amountText,
                    {
                      color:
                        transaction.type === 'credit'
                          ? theme.colors.success
                          : theme.colors.error,
                    },
                  ]}>
                  {transaction.type === 'credit' ? '+' : '-'}₦
                  {transaction.amount.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.transactionStatus,
                    {
                      color:
                        transaction.type === 'credit'
                          ? theme.colors.success
                          : theme.colors.error,
                    },
                  ]}>
                  {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
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
  content: {
    flex: 1,
    padding: 16,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  guestTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guestText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    color: theme.colors.background,
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    color: theme.colors.background,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fundButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  fundButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMoreText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
});