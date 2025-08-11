import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Send, CircleArrowUp as ArrowUpCircle, Smartphone, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';

const actions = [
  {
    id: 'transfer',
    title: 'Transfer',
    icon: Send,
    color: theme.colors.primary,
    onPress: () => {},
  },
  {
    id: 'topup',
    title: 'Top-Up',
    icon: ArrowUpCircle,
    color: theme.colors.secondary,
    onPress: () => {},
  },
  {
    id: 'data',
    title: 'Data',
    icon: Smartphone,
    color: theme.colors.accent,
    onPress: () => router.push({
      pathname: '/purchase/network-selection',
      params: { service: 'data' },
    }),
  },
  {
    id: 'bills',
    title: 'Pay Bills',
    icon: FileText,
    color: theme.colors.success,
    onPress: () => {},
  },
];

export const QuickActions: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Payment</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={action.onPress}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <IconComponent size={24} color={theme.colors.background} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 14,
    fontWeight: '600',
  },
});