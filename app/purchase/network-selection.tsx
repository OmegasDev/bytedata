import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';

const networks = [
  { id: 'mtn', name: 'MTN', color: '#FFCB05', logo: '🟡' },
  { id: 'airtel', name: 'Airtel', color: '#FF0000', logo: '🔴' },
  { id: 'glo', name: 'Glo', color: '#00A651', logo: '🟢' },
  { id: '9mobile', name: '9mobile', color: '#00AF50', logo: '🟢' },
];

export default function NetworkSelectionScreen() {
  const { service } = useLocalSearchParams<{ service: string }>();
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
    router.push({
      pathname: '/purchase/plan-selection',
      params: { service, network: networkId },
    });
  };

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
        <Text style={styles.subtitle}>Select Network</Text>

        <FlatList
          data={networks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.networkItem}
              onPress={() => handleNetworkSelect(item.id)}>
              <View style={styles.networkLeft}>
                <View style={[styles.networkLogo, { backgroundColor: item.color }]}>
                  <Text style={styles.logoText}>{item.logo}</Text>
                </View>
                <Text style={styles.networkName}>{item.name}</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
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
  networkItem: {
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  networkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
  },
  networkName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});