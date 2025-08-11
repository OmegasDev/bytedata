import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '@/styles/theme';

export const PromoCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title}>Enjoy ₦10 cashback after</Text>
          <Text style={styles.title}>each of your 3 transfers to</Text>
          <Text style={styles.title}>other banks today.</Text>
        </View>
        <View style={styles.imageContainer}>
          {/* Using emoji as placeholder for 3D illustration */}
          <Text style={styles.emoji}>💳</Text>
          <Text style={styles.emoji}>📱</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4FD1C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
  },
  title: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  emoji: {
    fontSize: 32,
    marginHorizontal: 4,
  },
});