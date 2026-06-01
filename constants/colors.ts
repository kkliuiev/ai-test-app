import { RiskLevel } from '../types';

export const Colors = {
  bg: '#EBEBF0',
  bgCard: '#FFFFFF',
  bgInput: '#F2F2F7',
  bgHighlight: '#F5F5FA',

  primary: '#7C3AED',
  primaryLight: '#9F67FF',
  gradientStart: '#7C3AED',
  gradientEnd: '#D946EF',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textAccent: '#7C3AED',

  low: '#10B981',
  lowBg: '#ECFDF5',
  lowBorder: '#A7F3D0',

  medium: '#F59E0B',
  mediumBg: '#FFFBEB',
  mediumBorder: '#FDE68A',

  high: '#F97316',
  highBg: '#FFF7ED',
  highBorder: '#FED7AA',

  critical: '#EF4444',
  criticalBg: '#FEF2F2',
  criticalBorder: '#FECACA',

  unknown: '#6B7280',
} as const;

export type RiskColorKey = 'low' | 'medium' | 'high' | 'critical' | 'unknown';

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return Colors.low;
    case 'MEDIUM': return Colors.medium;
    case 'HIGH': return Colors.high;
    case 'CRITICAL': return Colors.critical;
    default: return Colors.unknown;
  }
}

export function riskBg(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return Colors.lowBg;
    case 'MEDIUM': return Colors.mediumBg;
    case 'HIGH': return Colors.highBg;
    case 'CRITICAL': return Colors.criticalBg;
    default: return '#F9FAFB';
  }
}

export function riskBorder(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return Colors.lowBorder;
    case 'MEDIUM': return Colors.mediumBorder;
    case 'HIGH': return Colors.highBorder;
    case 'CRITICAL': return Colors.criticalBorder;
    default: return '#E5E7EB';
  }
}
