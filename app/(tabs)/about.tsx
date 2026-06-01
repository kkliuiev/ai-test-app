import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DiamondLogo from '../../components/DiamondLogo';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const RISK_LEVELS = [
  { level: 'LOW',      color: Colors.low,      range: '0',      desc: 'No risk indicators detected' },
  { level: 'MEDIUM',   color: Colors.medium,   range: '1–20',   desc: 'Minor risk signals present' },
  { level: 'HIGH',     color: Colors.high,     range: '21–50',  desc: 'Significant risk indicators' },
  { level: 'CRITICAL', color: Colors.critical, range: '51–100', desc: 'Severe risk — multiple flags' },
];

const NETWORKS = [
  { name: 'Ethereum',  id: 'ERC-20',        color: '#627EEA' },
  { name: 'BNB Chain', id: 'BEP-20',        color: '#F3BA2F' },
  { name: 'Polygon',   id: 'Polygon PoS',   color: '#8247E5' },
  { name: 'Arbitrum',  id: 'Arbitrum One',  color: '#12AAFF' },
  { name: 'Avalanche', id: 'C-Chain',       color: '#E84142' },
  { name: 'Optimism',  id: 'OP Mainnet',    color: '#FF0420' },
];

export default function AboutScreen() {
  const { user, isGuest, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Brand header */}
      <View style={styles.brandRow}>
        <DiamondLogo size="lg" showLabel />
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      {/* Account section */}
      <View style={styles.accountCard}>
        {user ? (
          <>
            <View style={styles.accountRow}>
              <View style={styles.accountIconWrap}>
                <Text style={styles.accountIcon}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accountLabel}>Signed in as</Text>
                <Text style={styles.accountEmail} numberOfLines={1}>{user.email}</Text>
              </View>
              <View style={styles.syncBadge}>
                <Text style={styles.syncText}>☁ Synced</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.accountRow}>
            <View style={styles.accountIconWrap}>
              <Text style={styles.accountIcon}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accountLabel}>Guest Mode</Text>
              <Text style={styles.accountSub}>History saved locally only</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.description}>
        Analyzes cryptocurrency wallet and contract addresses for Anti-Money Laundering (AML)
        risk indicators using real-time on-chain security data from 40+ trusted sources.
      </Text>

      {/* Risk Levels */}
      <Section title="Risk Score Levels">
        {RISK_LEVELS.map((r) => (
          <View key={r.level} style={styles.riskRow}>
            <View style={[styles.riskTag, { borderColor: r.color }]}>
              <View style={[styles.riskDot, { backgroundColor: r.color }]} />
              <Text style={[styles.riskTagText, { color: r.color }]}>{r.level}</Text>
            </View>
            <View style={styles.riskInfo}>
              <Text style={styles.riskRange}>Score: {r.range}</Text>
              <Text style={styles.riskDesc}>{r.desc}</Text>
            </View>
          </View>
        ))}
      </Section>

      {/* Data Source */}
      <Section title="Data Source">
        <View style={styles.sourceCard}>
          <View style={styles.sourceHeader}>
            <View style={styles.sourceDot} />
            <Text style={styles.sourceName}>GoPlus Security Labs</Text>
          </View>
          <Text style={styles.sourceDesc}>
            Real-time on-chain security intelligence for EVM-compatible blockchains.
            Aggregates data from 40+ trusted sources including SlowMist, BlockSec, and OFAC sanctions lists.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://gopluslabs.io')}>
            <Text style={styles.sourceUrl}>gopluslabs.io →</Text>
          </TouchableOpacity>
        </View>
      </Section>

      {/* Networks */}
      <Section title="Supported Networks">
        {NETWORKS.map((n) => (
          <View key={n.name} style={styles.networkRow}>
            <View style={[styles.networkDot, { backgroundColor: n.color }]} />
            <Text style={styles.networkName}>{n.name}</Text>
            <Text style={styles.networkId}>{n.id}</Text>
          </View>
        ))}
      </Section>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>⚠ Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          For informational purposes only. Risk scores are based on third-party data and
          may not reflect the current state of an address. Does not constitute financial,
          legal, or compliance advice.
        </Text>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 48 },

  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  version: { fontSize: 12, color: Colors.textMuted },

  accountCard: {
    backgroundColor: Colors.bgCard, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 12, marginBottom: 12,
  },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accountIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Colors.bgHighlight,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  accountIcon: { fontSize: 18 },
  accountLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  accountEmail: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  accountSub: { fontSize: 13, color: Colors.textMuted },
  syncBadge: {
    backgroundColor: Colors.lowBg, borderRadius: 6, borderWidth: 1,
    borderColor: Colors.lowBorder, paddingHorizontal: 8, paddingVertical: 4,
  },
  syncText: { fontSize: 11, color: Colors.low, fontWeight: '600' },
  signOutBtn: {
    backgroundColor: Colors.criticalBg, borderRadius: 8, borderWidth: 1,
    borderColor: Colors.criticalBorder, paddingVertical: 10, alignItems: 'center',
  },
  signOutText: { color: Colors.critical, fontSize: 14, fontWeight: '600' },

  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 28 },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textAccent, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 },

  riskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  riskTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 6, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 5, minWidth: 90,
  },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskTagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  riskInfo: { flex: 1 },
  riskRange: { fontSize: 11, color: Colors.textMuted, marginBottom: 1 },
  riskDesc: { fontSize: 13, color: Colors.textSecondary },

  sourceCard: {
    backgroundColor: Colors.bgCard, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  sourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sourceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.low },
  sourceName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  sourceDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  sourceUrl: { fontSize: 13, color: Colors.primaryLight },

  networkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  networkDot: { width: 8, height: 8, borderRadius: 4 },
  networkName: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  networkId: { fontSize: 12, color: Colors.textMuted },

  disclaimer: {
    backgroundColor: '#1C1400', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#78350F', gap: 8,
  },
  disclaimerTitle: { fontSize: 14, fontWeight: '700', color: Colors.medium },
  disclaimerText: { fontSize: 13, color: '#92400E', lineHeight: 20 },
});
