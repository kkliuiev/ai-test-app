import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AmlCheckResult } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function notifyCheckComplete(result: AmlCheckResult): Promise<void> {
  if (Platform.OS === 'web') return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  const emoji = result.riskScore === 0 ? '✅' : result.riskLevel === 'LOW' ? '🟡' : result.riskLevel === 'MEDIUM' ? '🟠' : '🔴';
  const addr = `${result.address.slice(0, 6)}…${result.address.slice(-4)}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${emoji} AML Check Complete`,
      body: `${addr} — ${result.riskLevel} RISK (${result.riskScore}/100)`,
    },
    trigger: null,
  });
}
