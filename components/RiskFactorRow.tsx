import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
          <View
            style={[
              styles.dot,
              { backgroundColor: factor.isRisky ? '#FF2D55' : '#00C896' },
            ]}
          />
          <Text style={[styles.label, factor.isRisky && styles.labelRisky]}>
            {factor.label}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.value, factor.isRisky && styles.valueRisky]}>
            {typeof factor.value === 'number' && factor.value > 1
              ? factor.value
              : factor.isRisky
              ? 'YES'
              : 'No'}
          </Text>
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
    backgroundColor: '#16162A',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2C2C3E',
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
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: '#AEAEC0',
    flex: 1,
  },
  labelRisky: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 13,
    color: '#636374',
    fontWeight: '500',
  },
  valueRisky: {
    color: '#FF2D55',
  },
  chevron: {
    fontSize: 10,
    color: '#636374',
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    paddingLeft: 18,
  },
});
