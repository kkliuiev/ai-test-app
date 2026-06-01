import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, riskColor } from '../constants/colors';
import { RiskLevel } from '../types';

interface Props {
  score: number;
  level: RiskLevel;
  size?: number;
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  CRITICAL: 'Critical Risk',
  UNKNOWN: 'Unknown',
};

export default function RiskGauge({ score, level, size = 140 }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const color = riskColor(level);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: score,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { width: size * 1.8 }]}>
      <View style={styles.scoreRow}>
        <Text style={[styles.scoreText, { color }]}>{score}</Text>
        <Text style={styles.scoreMax}>/100</Text>
      </View>
      <Text style={[styles.levelText, { color }]}>{LEVEL_LABELS[level]}</Text>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
      </View>
      <View style={styles.scaleRow}>
        <Text style={styles.scaleLabel}>Safe</Text>
        <Text style={styles.scaleLabel}>Dangerous</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 60,
    fontWeight: '800',
    lineHeight: 64,
  },
  scoreMax: {
    fontSize: 18,
    color: Colors.textMuted,
    marginBottom: 10,
    marginLeft: 4,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  scaleLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
