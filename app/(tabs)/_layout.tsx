import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import DiamondLogo from '../../components/DiamondLogo';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        headerStyle: { backgroundColor: Colors.bg },
        headerTintColor: Colors.textPrimary,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'AML Checker',
          headerTitle: () => <DiamondLogo size="sm" showLabel />,
          tabBarLabel: 'Checker',
          tabBarIcon: () => <DiamondLogo size="sm" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarLabel: 'About',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>ℹ</Text>,
        }}
      />
    </Tabs>
  );
}
