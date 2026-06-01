import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { Chain } from '../types';

interface Props {
  selected: Chain;
  onSelect: (chain: Chain) => void;
}

export default function ChainSelector({ selected, onSelect }: Props) {
  return (
    <View>
      <Text style={styles.label}>NETWORK</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {SUPPORTED_CHAINS.map((chain) => {
          const isActive = chain.id === selected.id;
          return (
            <TouchableOpacity
              key={chain.id}
              onPress={() => onSelect(chain)}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{chain.icon}</Text>
              <Text style={[styles.name, isActive && styles.nameActive]}>
                {chain.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  scroll: {
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: Colors.bgInput,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#1E3A5F',
    borderColor: Colors.primary,
  },
  icon: { fontSize: 13 },
  name: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  nameActive: { color: Colors.primary, fontWeight: '700' },
});
