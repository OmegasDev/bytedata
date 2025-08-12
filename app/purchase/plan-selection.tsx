import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { vtpassService } from '@/services/vtpass';
import { theme } from '@/styles/theme';

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

const planCategories = ['All', 'DAILY', 'WEEKLY', 'MONTHLY'];

export default function PlanSelectionScreen() {
  const { service, network } = useLocalSearchParams<{ service: string; network: string }>();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [service, network]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      if (service === 'data') {
        const dataPlans = await vtpassService.getDataPlans(network || 'mtn');
        const formattedPlans = dataPlans.map(plan => ({
          id: plan.variation_code,
          name: plan.name,
          price: parseFloat(plan.fixedPrice || plan.variation_amount),
          category: getCategoryFromName(plan.name),
          variation_code: plan.variation_code,
        }));
        setPlans(formattedPlans);
      } else {
        const airtimePlans = await vtpassService.getAirtimePlans(network || 'mtn');
        const formattedPlans = airtimePlans.map(plan => ({
          id: plan.variation_code,
          amount: parseFloat(plan.fixedPrice || plan.variation_amount),
          variation_code: plan.variation_code,
        }));
        setPlans(formattedPlans);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load plans. Please try again.');
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('daily') || lowerName.includes('1 day')) return 'DAILY';
    if (lowerName.includes('weekly') || lowerName.includes('7 day')) return 'WEEKLY';
    if (lowerName.includes('monthly') || lowerName.includes('30 day')) return 'MONTHLY';
    
    // Categorize by data size for fallback
    const sizeMatch = name.match(/(\d+)(mb|gb)/i);
    if (sizeMatch) {
      const size = parseInt(sizeMatch[1]);
      const unit = sizeMatch[2].toLowerCase();
      
      if (unit === 'mb' || (unit === 'gb' && size <= 2)) return 'DAILY';
      if (unit === 'gb' && size <= 10) return 'WEEKLY';
      return 'MONTHLY';
    }
    
    return 'DAILY';
  };

  const filteredPlans = plans.filter(plan => {
    if (selectedCategory === 'All') return true;
    return plan.category === selectedCategory;
  });

  const handlePlanSelect = (plan: any) => {
    router.push({
      pathname: '/purchase/recipient',
      params: { 
        service, 
        network, 
        planId: plan.id,
        planName: service === 'data' ? plan.name : `₦${plan.amount}`,
        planPrice: service === 'data' ? plan.price : plan.amount,
        variationCode: plan.variation_code,
      },
    });
  };

  const renderPlan = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.planItem}
      onPress={() => handlePlanSelect(item)}>
      <View style={styles.planHeader}>
        <Image 
          source={networkImages[network as keyof typeof networkImages]}
          style={styles.networkLogo}
          resizeMode="contain"
        />
      </View>
      
      {service === 'data' ? (
        <>
          <Text style={styles.planName}>{item.name}</Text>
          <Text style={styles.planCategory}>{item.category}</Text>
          <Text style={styles.planPrice}>₦{item.price.toFixed(2)}</Text>
        </>
      ) : (
        <>
          <Text style={styles.planAmount}>₦{item.amount.toFixed(2)}</Text>
          <Text style={styles.airtimeLabel}>Airtime</Text>
        </>
      )}
    </TouchableOpacity>
  );

  if (loading) {
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
            <Text style={styles.title}>
              {service === 'data' ? 'Data Plans' : 'Airtime'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading {service} plans...</Text>
          </View>
        </ImageBackground>
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
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {service === 'data' ? 'Data Plans' : 'Airtime'} - {network?.toUpperCase()}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {service === 'data' && (
            <>
              <Text style={styles.subtitle}>Select Data Plan</Text>
              <View style={styles.categoryTabs}>
                {planCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryTab,
                      selectedCategory === category && styles.categoryTabActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}>
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category && styles.categoryTextActive,
                      ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {service === 'airtime' && (
            <Text style={styles.subtitle}>Select Amount</Text>
          )}

          <FlatList
            data={filteredPlans}
            keyExtractor={(item) => item.id}
            renderItem={renderPlan}
            numColumns={3}
            contentContainerStyle={styles.plansList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No plans available</Text>
              </View>
            }
          />
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
    padding: 16,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  categoryTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryTab: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryTabActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: theme.colors.background,
  },
  plansList: {
    gap: 12,
  },
  planItem: {
    backgroundColor: theme.colors.card,
    flex: 1,
    margin: 4,
    borderRadius: 12,
    minHeight: 120,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkLogo: {
    width: 24,
    height: 24,
  },
  planName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  planCategory: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  planPrice: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  planAmount: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  airtimeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 16,
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