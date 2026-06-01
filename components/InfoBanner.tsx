import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  type: 'info' | 'warning' | 'error';
  message: string;
}

const CONFIG = {
  info:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', icon: 'ℹ' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', icon: '⚠' },
  error:   { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', icon: '✕' },
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
