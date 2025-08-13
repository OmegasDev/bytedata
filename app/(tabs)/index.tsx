import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, Wifi, Smartphone, Clock } from 'lucide-react-native';
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

const networkImages = {
  mtn: require('@/assets/images/mtn.png'),
  airtel: require('@/assets/images/airtel.png'),
  glo: require('@/assets/images/glo1.jpeg'),
  '9mobile': require('@/assets/images/9mobile1.jpeg'),
};

const networkColors = {
  mtn: '#FFCB05',
  airtel: '#FF0000',
  glo: '#00A651',
  '9mobile': '#00AF50',
};

const featuredPlans = [
  {
    id: '1',
    type: 'data',
    network: 'MTN',
    name: '1GB',
    duration: '1 Day',
    ourPrice: 500,
    competitorPrice: 600,
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
  },
  {
    id: '3',
    type: 'data',
    network: 'Glo',
    name: '2GB',
    duration: '7 Days',
    ourPrice: 1000,
    competitorPrice: 1200,
  },
  {
    id: '4',
    type: 'data',
    network: '9mobile',
    name: '1.5GB',
    duration: '7 Days',
    ourPrice: 800,
    competitorPrice: 950,
  },
  {
    id: '5',
    type: 'data',
    network: 'MTN',
    name: '6GB',
    duration: '30 Days',
    ourPrice: 2500,
    competitorPrice: 3000,
  },
  {
    id: '6',
    type: 'data',
    network: 'Airtel',
    name: '11GB',
    duration: '30 Days',
    ourPrice: 3500,
    competitorPrice: 4000,
  },
  {
    id: '7',
    type: 'data',
    network: 'MTN',
    name: '3GB',
    duration: '7 Days',
    ourPrice: 1500,
    competitorPrice: 1800,
  },
  {
    id: '8',
    type: 'data',
    network: 'Glo',
    name: '5GB',
    duration: '30 Days',
    ourPrice: 2000,
    competitorPrice: 2500,
  },
  {
    id: '9',
    type: 'data',
    network: 'Airtel',
    name: '10GB',
    duration: '30 Days',
    ourPrice: 3000,
    competitorPrice: 3500,
  },
  {
    id: '10',
    type: 'data',
    network: '9mobile',
    name: '4GB',
    duration: '30 Days',
    ourPrice: 1800,
    competitorPrice: 2200,
  },
  {
    id: '11',
    type: 'data',
    network: 'MTN',
    name: '15GB',
    duration: '30 Days',
    ourPrice: 4500,
    competitorPrice: 5000,
  },
  {
    id: '12',
    type: 'data',
    network: 'Glo',
    name: '8GB',
    duration: '30 Days',
    ourPrice: 2800,
    competitorPrice: 3200,
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
  },
  {
    id: '8',
    type: 'airtime',
    network: 'Airtel',
    amount: 500,
    ourPrice: 490,
    competitorPrice: 500,
    discount: 10,
  },
  {
    id: '9',
    type: 'airtime',
    network: 'Glo',
    amount: 1000,
    ourPrice: 980,
    competitorPrice: 1000,
    discount: 20,
  },
  {
    id: '10',
    type: 'airtime',
    network: '9mobile',
    amount: 200,
    ourPrice: 196,
    competitorPrice: 200,
    discount: 4,
  },
  {
    id: '11',
    type: 'airtime',
    network: 'MTN',
    amount: 300,
    ourPrice: 294,
    competitorPrice: 300,
    discount: 6,
  },
  {
    id: '12',
    type: 'airtime',
    network: 'Airtel',
    amount: 1500,
    ourPrice: 1470,
    competitorPrice: 1500,
    discount: 30,
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
        <View style={styles.networkLogoContainer}>
          <Image 
            source={networkImages[item.network.toLowerCase() as keyof typeof networkImages]}
            style={styles.networkLogo}
            resizeMode="contain"
          />
        </View>
        {item.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
      
      <View style={styles.planContent}>
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
      <ImageBackground
        source={require('@/assets/images/bytedata.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.backgroundOverlay} />
        
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            {user ? (
              <View style={styles.userAvatar}>
                <Image 
                  source={require('@/assets/images/bytedata.jpg')} 
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.guestAvatar}>
                <Image 
                  source={require('@/assets/images/bytedata.jpg')} 
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
            )}
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>
                {user ? `Hi, ${user.name?.split(' ')[0] || 'User'}!` : 'Hi, Welcome!'}
              </Text>
            </View>
          </View>
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
            numColumns={4}
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
            numColumns={4}
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

      </ImageBackground>
      
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
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
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
    gap: 8,
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    flex: 1,
    margin: 4,
    minHeight: 140,
    maxWidth: '22%',
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  networkLogoContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  networkLogo: {
    width: 24,
    height: 24,
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
  planName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  planDuration: {
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ourPrice: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  competitorPrice: {
    color: theme.colors.error,
    fontSize: 12,
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