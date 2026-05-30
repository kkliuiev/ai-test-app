import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RiskLevel } from '../types';
import { getRiskColor } from '../services/amlService';

interface Props {
  score: number;
  level: RiskLevel;
  size?: number;
}

export default function RiskGauge({ score, level, size = 140 }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const color = getRiskColor(level);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const levelLabels: Record<RiskLevel, string> = {
    LOW: 'Low Risk',
    MEDIUM: 'Medium Risk',
    HIGH: 'High Risk',
    CRITICAL: 'Critical Risk',
    UNKNOWN: 'Unknown',
  };

  return (
    <View style={[styles.container, { width: size * 1.8 }]}>
      <View style={styles.scoreRow}>
        <Text style={[styles.scoreText, { color }]}>{score}</Text>
        <Text style={styles.scoreMax}>/100</Text>
      </View>
      <Text style={[styles.levelText, { color }]}>{levelLabels[level]}</Text>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            { width: barWidth, backgroundColor: color },
          ]}
        />
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
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 60,
  },
  scoreMax: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 4,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  barBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#2C2C3E',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#636374',
  },
});
