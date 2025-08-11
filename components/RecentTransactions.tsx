import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { WalletContext } from '@/contexts/WalletContext';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

export const RecentTransactions: React.FC = () => {
  const { transactions } = useContext(WalletContext);
  const recentTransactions = transactions.slice(0, 2);

  if (recentTransactions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      </View>

      {recentTransactions.map((transaction) => (
        <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
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
            <Text style={styles.transactionCategory}>
              {transaction.category}
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
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  seeMore: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
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
    marginBottom: 2,
  },
  transactionCategory: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
});