import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const RISK_LEVELS = [
  { level: 'LOW', color: '#00C896', range: '0', desc: 'No risk indicators detected' },
  { level: 'MEDIUM', color: '#FFB800', range: '1–20', desc: 'Minor risk signals present' },
  { level: 'HIGH', color: '#FF6B35', range: '21–50', desc: 'Significant risk indicators' },
  { level: 'CRITICAL', color: '#FF2D55', range: '51–100', desc: 'Severe risk — multiple flags' },
];

const DATA_SOURCES = [
  {
    name: 'GoPlus Security Labs',
    desc: 'On-chain security intelligence for EVM-compatible chains. Provides real-time risk data for wallet and contract addresses.',
    url: 'https://gopluslabs.io',
  },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroRow}>
        <Text style={styles.heroIcon}>🛡</Text>
        <View>
          <Text style={styles.appName}>Crypto AML Checker</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </View>

      <Text style={styles.description}>
        This tool analyzes cryptocurrency wallet and contract addresses for
        Anti-Money Laundering (AML) risk indicators using publicly available
        on-chain security data.
      </Text>

      <Section title="Risk Score Levels">
        {RISK_LEVELS.map((r) => (
          <View key={r.level} style={styles.riskRow}>
            <View style={[styles.riskTag, { backgroundColor: r.color + '22', borderColor: r.color }]}>
              <Text style={[styles.riskTagText, { color: r.color }]}>{r.level}</Text>
            </View>
            <View style={styles.riskInfo}>
              <Text style={styles.riskRange}>Score: {r.range}</Text>
              <Text style={styles.riskDesc}>{r.desc}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section title="Data Sources">
        {DATA_SOURCES.map((s) => (
          <View key={s.name} style={styles.sourceCard}>
            <Text style={styles.sourceName}>{s.name}</Text>
            <Text style={styles.sourceDesc}>{s.desc}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(s.url)}>
              <Text style={styles.sourceUrl}>{s.url}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Section>

      <Section title="Supported Networks">
        {[
          { name: 'Ethereum', id: 'ERC-20', color: '#627EEA' },
          { name: 'BNB Chain', id: 'BEP-20', color: '#F3BA2F' },
          { name: 'Polygon', id: 'Polygon PoS', color: '#8247E5' },
          { name: 'Arbitrum', id: 'Arbitrum One', color: '#12AAFF' },
          { name: 'Avalanche', id: 'C-Chain', color: '#E84142' },
          { name: 'Optimism', id: 'OP Mainnet', color: '#FF0420' },
        ].map((n) => (
          <View key={n.name} style={styles.networkRow}>
            <View style={[styles.networkDot, { backgroundColor: n.color }]} />
            <Text style={styles.networkName}>{n.name}</Text>
            <Text style={styles.networkId}>{n.id}</Text>
          </View>
        ))}
      </Section>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>⚠ Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          This application is for informational purposes only. Risk scores are
          based on third-party data and may not reflect the current state of an
          address. This tool does not constitute financial, legal, or compliance
          advice. Always conduct independent verification for compliance
          decisions.
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
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  heroIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  version: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#AEAEC0',
    lineHeight: 22,
    marginBottom: 28,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  riskTag: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  riskTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  riskInfo: {
    flex: 1,
  },
  riskRange: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  riskDesc: {
    fontSize: 13,
    color: '#AEAEC0',
  },
  sourceCard: {
    backgroundColor: '#16162A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C3E',
    gap: 6,
  },
  sourceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sourceDesc: {
    fontSize: 13,
    color: '#AEAEC0',
    lineHeight: 19,
  },
  sourceUrl: {
    fontSize: 13,
    color: '#7B68EE',
    textDecorationLine: 'underline',
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E30',
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkName: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  networkId: {
    fontSize: 13,
    color: '#636374',
  },
  disclaimer: {
    backgroundColor: '#2A1F00',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#6B4A00',
    gap: 8,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFB800',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#D4A017',
    lineHeight: 20,
  },
});
