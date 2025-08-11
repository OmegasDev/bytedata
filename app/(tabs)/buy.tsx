import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Smartphone, Wifi } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

export default function BuyScreen() {
  const [selectedService, setSelectedService] = useState<'data' | 'airtime' | null>(null);

  const handleServiceSelect = (service: 'data' | 'airtime') => {
    setSelectedService(service);
    router.push({
      pathname: '/purchase/network-selection',
      params: { service },
    });
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
        <Text style={styles.title}>Buy Services</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>What would you like to purchase?</Text>

        <TouchableOpacity
          style={styles.serviceCard}
          onPress={() => handleServiceSelect('data')}>
          <View style={styles.serviceIcon}>
            <Wifi size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>Data Bundles</Text>
            <Text style={styles.serviceDescription}>
              Buy data plans for all networks
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceCard}
          onPress={() => handleServiceSelect('airtime')}>
          <View style={styles.serviceIcon}>
            <Smartphone size={32} color={theme.colors.secondary} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>Airtime</Text>
            <Text style={styles.serviceDescription}>
              Top up your phone with airtime
            </Text>
          </View>
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
    padding: 16,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});