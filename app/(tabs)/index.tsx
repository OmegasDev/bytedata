import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, Wifi, Smartphone, Zap, Clock } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { WalletContext } from '@/contexts/WalletContext';
import { SignupModal } from '@/components/SignupModal';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

// Mock data - will be replaced with API data
const popularSearches = [
  'MTN 1GB daily',
  'Airtel weekly data',
  'Glo monthly bundle',
  '9mobile airtime',
];

const featuredPlans = [
  {
    id: '1',
    type: 'data',
    network: 'MTN',
    name: '1GB',
    duration: '1 Day',
    ourPrice: 500,
    competitorPrice: 600,
    icon: '🟡',
    popular: true,
  },
  {
    id: '2',
    type: 'data',
    network: 'Airtel',
    name: '500MB',
    duration: '1 Day',
    ourPrice: 350,
    competitorPrice: 400,
    icon: '🔴',
  },
  {
    id: '3',
    type: 'data',
    network: 'Glo',
    name: '2GB',
    duration: '7 Days',
    ourPrice: 1000,
    competitorPrice: 1200,
    icon: '🟢',
  },
  {
    id: '4',
    type: 'data',
    network: '9mobile',
    name: '1.5GB',
    duration: '7 Days',
    ourPrice: 800,
    competitorPrice: 950,
    icon: '🟢',
  },
  {
    id: '5',
    type: 'data',
    network: 'MTN',
    name: '6GB',
    duration: '30 Days',
    ourPrice: 2500,
    competitorPrice: 3000,
    icon: '🟡',
  },
  {
    id: '6',
    type: 'data',
    network: 'Airtel',
    name: '11GB',
    duration: '30 Days',
    ourPrice: 3500,
    competitorPrice: 4000,
    icon: '🔴',
  },
];

const airtimeOffers = [
  {
    id: '7',
    type: 'airtime',
    network: 'MTN',
    amount: 100,
    ourPrice: 98,
    competitorPrice: 100,
    discount: 2,
    icon: '🟡',
  },
  {
    id: '8',
    type: 'airtime',
    network: 'Airtel',
    amount: 500,
    ourPrice: 490,
    competitorPrice: 500,
    discount: 10,
    icon: '🔴',
  },
  {
    id: '9',
    type: 'airtime',
    network: 'Glo',
    amount: 1000,
    ourPrice: 980,
    competitorPrice: 1000,
    discount: 20,
    icon: '🟢',
  },
  {
    id: '10',
    type: 'airtime',
    network: '9mobile',
    amount: 200,
    ourPrice: 196,
    competitorPrice: 200,
    discount: 4,
    icon: '🟢',
  },
];

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const { balance } = useContext(WalletContext);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setShowSignupModal(true);
      }, 45000); // 45 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handlePlanSelect = (plan: any) => {
    if (plan.type === 'data') {
      router.push({
        pathname: '/purchase/recipient',
        params: {
          service: 'data',
          network: plan.network.toLowerCase(),
          planId: plan.id,
          planName: plan.name,
          planPrice: plan.ourPrice,
        },
      });
    } else {
      router.push({
        pathname: '/purchase/recipient',
        params: {
          service: 'airtime',
          network: plan.network.toLowerCase(),
          planId: plan.id,
          planName: `₦${plan.amount}`,
          planPrice: plan.ourPrice,
        },
      });
    }
  };

  const renderPlanCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.planCard} onPress={() => handlePlanSelect(item)}>
      <View style={styles.planHeader}>
        <Text style={styles.networkIcon}>{item.icon}</Text>
        {item.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
      
      <View style={styles.planContent}>
        <Text style={styles.planNetwork}>{item.network}</Text>
        {item.type === 'data' ? (
          <>
            <Text style={styles.planName}>{item.name}</Text>
            <Text style={styles.planDuration}>{item.duration}</Text>
          </>
        ) : (
          <>
            <Text style={styles.planName}>₦{item.amount}</Text>
            <Text style={styles.planDuration}>Airtime</Text>
          </>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.ourPrice}>₦{item.ourPrice}</Text>
        <Text style={styles.competitorPrice}>₦{item.competitorPrice}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchSuggestion = (suggestion: string, index: number) => (
    <TouchableOpacity key={index} style={styles.searchSuggestion}>
      <Search size={16} color={theme.colors.textSecondary} />
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            {user ? (
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || 'U'}</Text>
              </View>
            ) : (
              <View style={styles.guestAvatar}>
                <Text style={styles.avatarText}>G</Text>
              </View>
            )}
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>
                {user ? `Hi, ${user.name?.split(' ')[0] || 'User'}` : 'Welcome to Bytedata'}
              </Text>
              {user && (
                <Text style={styles.balanceText}>Balance: ₦{balance.toFixed(2)}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for data plans or airtime"
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Search Suggestions */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularSearches.map(renderSearchSuggestion)}
          </ScrollView>
        </View>

        {/* Popular Data Plans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Data Plans</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/buy')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredPlans}
            renderItem={renderPlanCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.planGrid}
          />
        </View>

        {/* Airtime Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Airtime Offers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/buy')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={airtimeOffers}
            renderItem={renderPlanCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.planGrid}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => router.push({
                pathname: '/purchase/network-selection',
                params: { service: 'data' },
              })}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
                <Wifi size={24} color={theme.colors.background} />
              </View>
              <Text style={styles.actionTitle}>Buy Data</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => router.push({
                pathname: '/purchase/network-selection',
                params: { service: 'airtime' },
              })}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.secondary }]}>
                <Smartphone size={24} color={theme.colors.background} />
              </View>
              <Text style={styles.actionTitle}>Buy Airtime</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent }]}>
                <Zap size={24} color={theme.colors.background} />
              </View>
              <Text style={styles.actionTitle}>Pay Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => router.push('/(tabs)/history')}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.success }]}>
                <Clock size={24} color={theme.colors.background} />
              </View>
              <Text style={styles.actionTitle}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SignupModal
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
  suggestionsContainer: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  searchSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  suggestionText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  planGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    margin: 6,
    minHeight: 140,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  networkIcon: {
    fontSize: 24,
  },
  popularBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  planContent: {
    flex: 1,
  },
  planNetwork: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  planName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  planDuration: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ourPrice: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  competitorPrice: {
    color: theme.colors.error,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  quickActions: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});