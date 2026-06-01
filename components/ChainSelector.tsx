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
      <Text style={styles.label}>Blockchain Network</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {SUPPORTED_CHAINS.map((chain) => {
          const isActive = chain.id === selected.id;
          return (
            <TouchableOpacity
              key={chain.id}
              onPress={() => onSelect(chain)}
              style={[styles.chip, isActive && { backgroundColor: Colors.bgHighlight, borderColor: Colors.primaryLight }]}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{chain.icon}</Text>
              <Text style={[styles.name, isActive && { color: Colors.textAccent, fontWeight: '600' }]}>
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
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
    paddingVertical: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { fontSize: 13 },
  name: { fontSize: 13, color: Colors.textSecondary },
});
