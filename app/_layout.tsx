import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import DiamondLogo from '../components/DiamondLogo';
import { Colors } from '../constants/colors';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { I18nProvider } from '../lib/i18n';
import { requestNotificationPermission } from '../services/notificationService';

SplashScreen.preventAutoHideAsync();

const SPLASH_MIN_MS = 15000;

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </I18nProvider>
  );
}

function AppNavigator() {
  const { session, loading, isGuest } = useAuth();
  const navigationState = useRootNavigationState();
  const [splashReady, setSplashReady] = useState(false);
  const timerFired = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      timerFired.current = true;
      setSplashReady(true);
    }, SPLASH_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && splashReady) {
      SplashScreen.hideAsync();
      requestNotificationPermission();
    }
  }, [loading, splashReady]);

  useEffect(() => {
    if (!navigationState?.key || loading || !splashReady) return;
    if (session || isGuest) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [navigationState?.key, session, isGuest, loading, splashReady]);

  if (loading || !splashReady) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <DiamondLogo size="xl" showLabel />
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.bgCard },
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
            headerStyle: { backgroundColor: Colors.bgCard },
          }}
        />
        <Stack.Screen
          name="check"
          options={{
            headerTitle: 'AML Check',
            headerBackTitle: 'Home',
            presentation: 'card',
            headerStyle: { backgroundColor: Colors.bgCard },
            headerTintColor: Colors.primary,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
