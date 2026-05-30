import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7B68EE',
        tabBarInactiveTintColor: '#636374',
        tabBarStyle: {
          backgroundColor: '#16162A',
          borderTopColor: '#2C2C3E',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        headerStyle: { backgroundColor: '#0f0f1a' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'AML Checker',
          tabBarLabel: 'Checker',
          tabBarIcon: ({ color, size }) => (
            <TabIcon label="🔍" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <TabIcon label="📋" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarLabel: 'About',
          tabBarIcon: ({ color, size }) => (
            <TabIcon label="ℹ" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ label, size }: { label: string; size: number }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: size - 4 }}>{label}</Text>;
}
