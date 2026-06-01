import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import DiamondLogo from '../components/DiamondLogo';
import { Colors } from '../constants/colors';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.bg,
    card: '#FFFFFF',
    text: Colors.textPrimary,
    border: Colors.border,
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

function AppNavigator() {
  const { session, loading, isGuest } = useAuth();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  useEffect(() => {
    if (!navigationState?.key || loading) return;
    if (session || isGuest) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [navigationState?.key, session, isGuest, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <DiamondLogo size="xl" showLabel />
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={LightTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: Colors.textPrimary,
          contentStyle: { backgroundColor: Colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="result"
          options={{
            headerTitle: () => <DiamondLogo size="sm" showLabel />,
            headerBackTitle: 'Back',
            presentation: 'card',
            headerStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
        <Stack.Screen
          name="check"
          options={{
            headerTitle: 'AML Check',
            headerBackTitle: 'Home',
            presentation: 'card',
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: Colors.primary,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
