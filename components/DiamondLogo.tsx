import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const SIZES = {
  sm: { outer: 36, mid: 26, inner: 18, font: 9,  label: 11, gap: 6  },
  md: { outer: 52, mid: 38, inner: 26, font: 13, label: 13, gap: 8  },
  lg: { outer: 72, mid: 54, inner: 36, font: 17, label: 15, gap: 12 },
  xl: { outer: 96, mid: 72, inner: 48, font: 22, label: 17, gap: 16 },
};

export default function DiamondLogo({ size = 'md', showLabel = false }: Props) {
  const s = SIZES[size];

  return (
    <View style={[styles.wrapper, showLabel && { gap: s.gap }]}>
      {/* Outer diamond glow */}
      <View style={[
        styles.diamond,
        {
          width: s.outer,
          height: s.outer,
          backgroundColor: Colors.primaryMuted,
          borderWidth: 1.5,
          borderColor: Colors.primaryLight + '66',
        },
      ]}>
        {/* Mid diamond ring */}
        <View style={[
          styles.diamond,
          {
            width: s.mid,
            height: s.mid,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: Colors.primaryLight + 'AA',
          },
        ]}>
          {/* Inner diamond */}
          <View style={[
            styles.diamond,
            {
              width: s.inner,
              height: s.inner,
              backgroundColor: Colors.primaryMuted,
              borderWidth: 1,
              borderColor: Colors.primaryLight,
            },
          ]}>
            {/* AML text — counter-rotate to stay upright */}
            <View style={styles.textWrap}>
              <Text style={[styles.amlText, { fontSize: s.font }]}>AML</Text>
            </View>
          </View>
        </View>
      </View>

      {showLabel && (
        <View>
          <Text style={[styles.brandName, { fontSize: s.label + 2 }]}>AML Check</Text>
          <Text style={[styles.brandSub, { fontSize: s.label - 2 }]}>Crypto Risk Analyzer</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamond: {
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  textWrap: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  amlText: {
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandName: {
    color: Colors.textPrimary,
    fontWeight: '800',
    lineHeight: 22,
  },
  brandSub: {
    color: Colors.textAccent,
    marginTop: 1,
  },
});
