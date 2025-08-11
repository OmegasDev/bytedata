import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';

const networkImages = {
  mtn: require('@/assets/images/mtn1.png'),
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

const samplePlans = {
  data: [
    { id: '1', name: '110MB', duration: '1 Day', price: 100.00, category: 'DAILY' },
    { id: '2', name: '1GB', duration: '1 Day', price: 500.00, category: 'DAILY' },
    { id: '3', name: '500MB', duration: '1 Day', price: 350.00, category: 'DAILY' },
    { id: '4', name: '500MB', duration: '7 Days', price: 500.00, category: 'WEEKLY' },
    { id: '5', name: '1.5GB', duration: '7 Days', price: 1000.00, category: 'WEEKLY' },
    { id: '6', name: '1.5GB', duration: '2 Days', price: 600.00, category: 'WEEKLY' },
    { id: '7', name: '1GB', duration: '7 Days', price: 800.00, category: 'WEEKLY' },
    { id: '8', name: '6GB', duration: '7 Days', price: 2500.00, category: 'WEEKLY' },
    { id: '9', name: '11GB', duration: '7 Days', price: 3500.00, category: 'WEEKLY' },
    { id: '10', name: '2GB', duration: '30 Days', price: 1500.00, category: 'MONTHLY' },
    { id: '11', name: '2.7GB', duration: '30 Days', price: 2000.00, category: 'MONTHLY' },
    { id: '12', name: '1.8GB', duration: '7 Days', price: 1500.00, category: 'WEEKLY' },
  ],
  airtime: [
    { id: '1', amount: 100.00, discount: 2.00 },
    { id: '2', amount: 200.00, discount: 4.00 },
    { id: '3', amount: 500.00, discount: 10.00 },
    { id: '4', amount: 1000.00, discount: 20.00 },
    { id: '5', amount: 5000.00, discount: 100.00 },
    { id: '6', amount: 10000.00, discount: 200.00 },
  ],
};

export default function PlanSelectionScreen() {
  const { service, network } = useLocalSearchParams<{ service: string; network: string }>();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (service === 'data') {
      setPlans(samplePlans.data);
    } else {
      setPlans(samplePlans.airtime);
    }
  }, [service]);

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
          <Text style={styles.planDuration}>{item.duration}</Text>
          <Text style={styles.planPrice}>₦{item.price.toFixed(2)}</Text>
        </>
      ) : (
        <>
          <Text style={styles.planAmount}>₦{item.amount.toFixed(2)}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>₦{item.discount.toFixed(2)} Discount</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {service === 'data' ? 'Data Details' : 'Airtime Details'}
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
          numColumns={4}
          contentContainerStyle={styles.plansList}
          showsVerticalScrollIndicator={false}
        />
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
    backgroundColor: theme.colors.text,
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
    minHeight: 100,
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
  planDuration: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  planPrice: {
    color: theme.colors.text,
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
  discountBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: theme.colors.background,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});