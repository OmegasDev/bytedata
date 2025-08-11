import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { WalletContext } from '@/contexts/WalletContext';
import { theme } from '@/styles/theme';

const filterOptions = ['All', 'Data', 'Airtime', 'Wallet', 'Bills'];

export default function HistoryScreen() {
  const { user } = useContext(AuthContext);
  const { transactions } = useContext(WalletContext);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'All') return true;
    return transaction.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  const renderTransaction = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        {item.type === 'credit' ? (
          <ArrowDownLeft size={20} color={theme.colors.success} />
        ) : (
          <ArrowUpRight size={20} color={theme.colors.error} />
        )}
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.amountText,
            {
              color:
                item.type === 'credit'
                  ? theme.colors.success
                  : theme.colors.error,
            },
          ]}>
          {item.type === 'credit' ? '+' : '-'}₦{item.amount.toFixed(2)}
        </Text>
        <Text
          style={[
            styles.transactionStatus,
            {
              color:
                item.status === 'completed'
                  ? theme.colors.success
                  : item.status === 'pending'
                  ? theme.colors.warning
                  : theme.colors.error,
            },
          ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestText}>
            Please log in to view your transaction history
          </Text>
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
        
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <TouchableOpacity>
          <Filter size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filterOptions}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === item && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(item)}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.filterTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
      
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  filterContainer: {
    paddingVertical: 16,
    paddingLeft: 16,
  },
  filterTab: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: theme.colors.background,
  },
  transactionsList: {
    padding: 16,
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
    marginBottom: 2,
  },
  transactionCategory: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
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
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});