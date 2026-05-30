import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  type: 'info' | 'warning' | 'error';
  message: string;
}

const CONFIG = {
  info: { bg: '#1A2744', border: '#3A5298', text: '#7DA1F7', icon: 'ℹ' },
  warning: { bg: '#2A1F00', border: '#6B4A00', text: '#FFB800', icon: '⚠' },
  error: { bg: '#2A0A10', border: '#7A1524', text: '#FF2D55', icon: '✕' },
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
  icon: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 1,
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
