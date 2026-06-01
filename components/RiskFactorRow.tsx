import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { RiskFactor } from '../types';

interface Props {
  factor: RiskFactor;
}

export default function RiskFactorRow({ factor }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.75}
      style={styles.container}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.dot, { backgroundColor: factor.isRisky ? Colors.critical : Colors.low }]} />
          <Text style={[styles.label, factor.isRisky && styles.labelRisky]}>
            {factor.label}
          </Text>
        </View>
        <View style={styles.right}>
          <View style={[
            styles.badge,
            { backgroundColor: factor.isRisky ? Colors.criticalBg : Colors.lowBg,
              borderColor: factor.isRisky ? Colors.criticalBorder : Colors.lowBorder },
          ]}>
            <Text style={[styles.badgeText, { color: factor.isRisky ? Colors.critical : Colors.low }]}>
              {typeof factor.value === 'number' && factor.value > 1
                ? factor.value
                : factor.isRisky ? 'YES' : 'No'}
            </Text>
          </View>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </View>
      {expanded && factor.description ? (
        <Text style={styles.description}>{factor.description}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  labelRisky: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    paddingLeft: 17,
  },
});
