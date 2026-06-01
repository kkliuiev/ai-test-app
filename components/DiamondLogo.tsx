import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  /** Use white text (for dark backgrounds) — default false (dark text for light theme) */
  light?: boolean;
}

// Diamond dimensions in original SVG coordinate space
const DIAMOND_VIEWBOX = { x: 62, y: 0, w: 168, h: 236 };

const SIZES = {
  sm: { diamond: 28, labelSize: 13, subSize: 11 },
  md: { diamond: 40, labelSize: 15, subSize: 12 },
  lg: { diamond: 56, labelSize: 18, subSize: 13 },
  xl: { diamond: 80, labelSize: 22, subSize: 15 },
};

const DIAMOND_PATH =
  'M164.344 11.6803C154.354 -3.02213 132.447 -2.60771 123.028 12.462L66.387 103.075C63.1858 108.196 62.0584 114.193 62.9937 119.928C63.0245 120.117 63.0576 120.306 63.0929 120.494C63.6725 123.587 64.8558 126.592 66.6412 129.329L125.929 220.226C135.636 235.108 157.54 235.108 167.247 220.226L226.354 129.607C231.732 121.361 231.632 110.715 226.098 102.571L164.344 11.6803ZM171.103 65.3683C168.977 103.341 139.011 133.925 101.169 137.267L146.588 206.9L205.695 116.281L171.103 65.3683Z';

export default function DiamondLogo({ size = 'md', showLabel = false, light = false }: Props) {
  const s = SIZES[size];
  const h = s.diamond;
  const w = (DIAMOND_VIEWBOX.w / DIAMOND_VIEWBOX.h) * h;

  return (
    <View style={styles.wrapper}>
      <Svg
        width={w}
        height={h}
        viewBox={`${DIAMOND_VIEWBOX.x} ${DIAMOND_VIEWBOX.y} ${DIAMOND_VIEWBOX.w} ${DIAMOND_VIEWBOX.h}`}
      >
        <Path d={DIAMOND_PATH} fill="#7C3AED" fillRule="evenodd" clipRule="evenodd" />
      </Svg>

      {showLabel && (
        <View style={styles.labelCol}>
          <Text style={[styles.label, { fontSize: s.labelSize, color: light ? '#FFFFFF' : Colors.textPrimary }]}>
            AMLBot
          </Text>
          <Text style={[styles.sub, { fontSize: s.subSize, color: light ? 'rgba(255,255,255,0.7)' : Colors.textAccent }]}>
            Crypto Risk Analyzer
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelCol: {
    justifyContent: 'center',
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sub: {
    marginTop: 1,
  },
});
