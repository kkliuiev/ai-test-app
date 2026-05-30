import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HistoryItem } from '../types';
import { getRiskColor, truncateAddress } from '../services/amlService';

interface Props {
  item: HistoryItem;
  onPress: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ item, onPress, onDelete }: Props) {
  const color = getRiskColor(item.riskLevel);
  const date = new Date(item.checkedAt);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.75}
      style={styles.card}
    >
      <View style={styles.leftBar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.chainBadge}>
            <Text style={styles.chainText}>{item.chain.symbol}</Text>
          </View>
          <Text style={styles.date}>
            {dateStr} · {timeStr}
          </Text>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteBtn}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.address}>{truncateAddress(item.address, 8)}</Text>
        <View style={styles.footer}>
          <View style={[styles.riskBadge, { backgroundColor: color + '22' }]}>
            <View style={[styles.riskDot, { backgroundColor: color }]} />
            <Text style={[styles.riskText, { color }]}>
              {item.riskLevel} · {item.riskScore}/100
            </Text>
          </View>
          <Text style={styles.factorCount}>
            {item.riskFactors.filter((f) => f.isRisky).length} risk{' '}
            {item.riskFactors.filter((f) => f.isRisky).length === 1
              ? 'factor'
              : 'factors'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#16162A',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  leftBar: {
    width: 3,
    backgroundColor: '#627EEA',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  chainBadge: {
    backgroundColor: '#2C2C3E',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chainText: {
    fontSize: 11,
    color: '#AEAEC0',
    fontWeight: '600',
  },
  date: {
    flex: 1,
    fontSize: 12,
    color: '#636374',
  },
  deleteBtn: {
    fontSize: 12,
    color: '#636374',
  },
  address: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  factorCount: {
    fontSize: 12,
    color: '#636374',
  },
});
