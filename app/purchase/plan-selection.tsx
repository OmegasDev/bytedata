import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { gladtidingsService } from '@/services/gladtidings';
import { theme } from '@/styles/theme';

const networkImages = {
  mtn: require('@/assets/images/mtn.png'),
  airtel: require('@/assets/images/airtel.png'),
  glo: require('@/assets/images/glo1.jpeg'),
  '9mobile': require('@/assets/images/9mobile1.jpeg'),
};

export default function PlanSelectionScreen() {
  const { service, network } = useLocalSearchParams<{ service: string; network: string }>();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [service, network]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      if (service === 'data') {
        const dataPlans = await gladtidingsService.getDataPlans(network);
        const filteredPlans = dataPlans.filter(plan => 
          plan.network.toLowerCase() === network?.toLowerCase()
        );
        setPlans(filteredPlans);
      } else {
        const airtimePlans = await gladtidingsService.getAirtimePlans();
        setPlans(airtimePlans);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load plans. Please try again.');
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: any) => {
    router.push({
      pathname: '/purchase/recipient',
      params: { 
        service, 
        network, 
        planId: plan.id,
        planName: service === 'data' ? `${plan.size} - ${plan.validity}` : `₦${plan.amount}`,
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
          <Text style={styles.planSize}>{item.size}</Text>
          <Text style={styles.planValidity}>{item.validity}</Text>
          <Text style={styles.planPrice}>₦{item.price}</Text>
        </>
      ) : (
        <>
          <Text style={styles.planAmount}>₦{item.amount}</Text>
          <Text style={styles.airtimeLabel}>Airtime</Text>
        </>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.subtitle}>
          {service === 'data' ? 'Select Data Plan' : 'Select Amount'}
        </Text>

        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={renderPlan}
          numColumns={3}
          contentContainerStyle={styles.plansList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No plans available</Text>
            </View>
          }
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
  plansList: {
    gap: 12,
  },
  planItem: {
    backgroundColor: theme.colors.card,
    flex: 1,
    margin: 4,
    borderRadius: 12,
    minHeight: 120,
    maxWidth: '31%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  planSize: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  planValidity: {
    color: theme.colors.textSecondary,
    fontSize: 12,
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