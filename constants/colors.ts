// AMLBot-inspired color palette
export const Colors = {
  // Backgrounds
  bg: '#0B0F1C',
  bgCard: '#111827',
  bgInput: '#0D1421',
  bgHighlight: '#1A2744',

  // Brand
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryMuted: '#1D4ED833',

  // Borders
  border: '#1F2937',
  borderActive: '#3B82F6',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#4B5563',
  textAccent: '#60A5FA',

  // Risk levels
  low: '#10B981',
  lowBg: '#10B98118',
  lowBorder: '#10B98144',

  medium: '#F59E0B',
  mediumBg: '#F59E0B18',
  mediumBorder: '#F59E0B44',

  high: '#F97316',
  highBg: '#F9731618',
  highBorder: '#F9731644',

  critical: '#EF4444',
  criticalBg: '#EF444418',
  criticalBorder: '#EF444444',

  unknown: '#6B7280',
} as const;

export type RiskColorKey = 'low' | 'medium' | 'high' | 'critical' | 'unknown';

import { RiskLevel } from '../types';

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':      return Colors.low;
    case 'MEDIUM':   return Colors.medium;
    case 'HIGH':     return Colors.high;
    case 'CRITICAL': return Colors.critical;
    default:         return Colors.unknown;
  }
}

export function riskBg(level: RiskLevel): string {
  switch (level) {
    case 'LOW':      return Colors.lowBg;
    case 'MEDIUM':   return Colors.mediumBg;
    case 'HIGH':     return Colors.highBg;
    case 'CRITICAL': return Colors.criticalBg;
    default:         return '#6B728018';
  }
}

export function riskBorder(level: RiskLevel): string {
  switch (level) {
    case 'LOW':      return Colors.lowBorder;
    case 'MEDIUM':   return Colors.mediumBorder;
    case 'HIGH':     return Colors.highBorder;
    case 'CRITICAL': return Colors.criticalBorder;
    default:         return '#6B728044';
  }
}
