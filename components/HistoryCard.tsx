import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, riskBorder, riskColor } from '../constants/colors';
import { truncateAddress } from '../services/amlService';
import { HistoryItem } from '../types';

interface Props {
  item: HistoryItem;
  onPress: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ item, onPress, onDelete }: Props) {
  const color = riskColor(item.riskLevel);
  const date = new Date(item.checkedAt);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const riskyCount = item.riskFactors.filter((f) => f.isRisky).length;

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.75} style={styles.card}>
      <View style={[styles.leftBar, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.chainBadge}>
            <Text style={styles.chainText}>{item.chain.symbol}</Text>
          </View>
          <Text style={styles.date}>{dateStr} · {timeStr}</Text>
          <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.deleteBtn}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.address}>{truncateAddress(item.address, 8)}</Text>
        <View style={styles.footer}>
          <View style={[styles.riskBadge, { borderColor: riskBorder(item.riskLevel) }]}>
            <View style={[styles.riskDot, { backgroundColor: color }]} />
            <Text style={[styles.riskText, { color }]}>
              {item.riskLevel} · {item.riskScore}/100
            </Text>
          </View>
          <Text style={styles.factorCount}>
            {riskyCount} risk {riskyCount === 1 ? 'factor' : 'factors'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leftBar: { width: 3 },
  content: { flex: 1, padding: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  chainBadge: {
    backgroundColor: Colors.bgHighlight,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chainText: { fontSize: 11, color: Colors.textAccent, fontWeight: '600' },
  date: { flex: 1, fontSize: 12, color: Colors.textMuted },
  deleteBtn: { fontSize: 12, color: Colors.textMuted },
  address: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    marginBottom: 10,
    letterSpacing: 0.4,
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
    borderRadius: 6,
    borderWidth: 1,
  },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskText: { fontSize: 12, fontWeight: '700' },
  factorCount: { fontSize: 12, color: Colors.textMuted },
});
