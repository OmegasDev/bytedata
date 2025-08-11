import { Tabs } from 'expo-router';
import { Home, Wallet, Clock, User, Plus } from 'lucide-react-native';
import { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import { router } from 'expo-router';

const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
  >
    <View style={styles.customButtonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const { user } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.dark,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ size, color }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          title: '',
          tabBarIcon: ({ size, color }) => <Plus size={28} color={theme.colors.background} />,
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} onPress={() => router.push('/(tabs)/buy')} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});