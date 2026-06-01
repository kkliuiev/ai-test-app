import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  type: 'info' | 'warning' | 'error';
  message: string;
}

const CONFIG = {
  info:    { bg: '#0D1B3E', border: '#1D4ED8', text: '#60A5FA', icon: 'ℹ' },
  warning: { bg: '#1C1400', border: '#78350F', text: '#F59E0B', icon: '⚠' },
  error:   { bg: '#1C0A0A', border: '#7F1D1D', text: '#EF4444', icon: '✕' },
};

export default function InfoBanner({ type, message }: Props) {
  const { bg, border, text, icon } = CONFIG[type];
  return (
    <View style={[styles.container, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.icon, { color: text }]}>{icon}</Text>
      <Text style={[styles.message, { color: text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  icon: { fontSize: 14, fontWeight: '700', marginTop: 1 },
  message: { flex: 1, fontSize: 13, lineHeight: 19 },
});
