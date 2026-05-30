import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chain } from '../types';
import { SUPPORTED_CHAINS } from '../constants/chains';

interface Props {
  selected: Chain;
  onSelect: (chain: Chain) => void;
}

export default function ChainSelector({ selected, onSelect }: Props) {
  return (
    <View>
      <Text style={styles.label}>Blockchain Network</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SUPPORTED_CHAINS.map((chain) => {
          const isActive = chain.id === selected.id;
          return (
            <TouchableOpacity
              key={chain.id}
              onPress={() => onSelect(chain)}
              style={[
                styles.chip,
                isActive && {
                  backgroundColor: chain.color + '22',
                  borderColor: chain.color,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{chain.icon}</Text>
              <Text
                style={[
                  styles.name,
                  isActive && { color: chain.color, fontWeight: '600' },
                ]}
              >
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
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  scroll: {
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#16162A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  icon: {
    fontSize: 14,
  },
  name: {
    fontSize: 13,
    color: '#AEAEC0',
  },
});
