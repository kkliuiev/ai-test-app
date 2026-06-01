import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RiskFactorRow from '../components/RiskFactorRow';
import RiskGauge from '../components/RiskGauge';
import { Colors, riskBg, riskBorder, riskColor } from '../constants/colors';
import { AmlCheckResult } from '../types';

export default function ResultScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const [copied, setCopied] = useState(false);

  if (!data) return <ErrorView />;

  let result: AmlCheckResult;
  try { result = JSON.parse(data); }
  catch { return <ErrorView />; }

  const { address, chain, riskLevel, riskScore, riskFactors, checkedAt } = result;
  const color = riskColor(riskLevel);
  const riskyFactors = riskFactors.filter((f) => f.isRisky);
  const safeFactors = riskFactors.filter((f) => !f.isRisky);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const lines = riskyFactors.map((f) => `• ${f.label}`).join('\n');
    await Share.share({
      message:
        `AML Check Result\n\n` +
        `Address: ${address}\n` +
        `Chain: ${chain.name}\n` +
        `Risk: ${riskLevel} (${riskScore}/100)\n` +
        `Checked: ${new Date(checkedAt).toLocaleString()}\n` +
        (lines ? `\nRisk Factors:\n${lines}` : '\nNo risk factors detected.'),
    });
  };

  const checkedDate = new Date(checkedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Score card */}
      <View style={[styles.scoreCard, { borderColor: riskBorder(riskLevel) }]}>
        <View style={[styles.scoreCardHeader, { backgroundColor: riskBg(riskLevel) }]}>
          <View style={styles.chainPill}>
            <View style={[styles.chainDot, { backgroundColor: chain.color }]} />
            <Text style={styles.chainLabel}>{chain.name}</Text>
          </View>
          <Text style={styles.checkedAt}>{checkedDate}</Text>
        </View>
        <View style={styles.gaugeArea}>
          <RiskGauge score={riskScore} level={riskLevel} />
        </View>
        <View style={styles.statsRow}>
          <Stat label="Risk Factors" value={String(riskyFactors.length)} color={color} />
          <View style={styles.statDiv} />
          <Stat label="Clean Checks" value={String(safeFactors.length)} color={Colors.low} />
          <View style={styles.statDiv} />
          <Stat label="Total Checks" value={String(riskFactors.length)} color={Colors.textSecondary} />
        </View>
      </View>

      {/* Address card */}
      <TouchableOpacity onPress={handleCopy} activeOpacity={0.75} style={styles.addressCard}>
        <Text style={styles.addressLabel}>Address</Text>
        <Text style={styles.addressText}>{address}</Text>
        <Text style={styles.copyHint}>{copied ? '✓ Copied!' : 'Tap to copy'}</Text>
      </TouchableOpacity>

      {/* Summary banner */}
      {riskScore === 0 ? (
        <View style={styles.cleanBanner}>
          <View style={styles.cleanIconWrap}>
            <Text style={styles.cleanIcon}>✓</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cleanTitle}>No Risk Detected</Text>
            <Text style={styles.cleanDesc}>This address has no known risk indicators in our database.</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.riskBanner, { borderColor: riskBorder(riskLevel), backgroundColor: riskBg(riskLevel) }]}>
          <Text style={[styles.riskBannerIcon, { color }]}>⚠</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.riskBannerTitle, { color }]}>{riskLevel} RISK DETECTED</Text>
            <Text style={styles.riskBannerDesc}>
              {riskyFactors.length} risk indicator{riskyFactors.length !== 1 ? 's' : ''} found. Exercise caution when transacting with this address.
            </Text>
          </View>
        </View>
      )}

      {/* Risk indicators */}
      {riskyFactors.length > 0 && (
        <View style={styles.factorsSection}>
          <Text style={styles.sectionTitle}>Risk Indicators</Text>
          {riskyFactors.map((f) => <RiskFactorRow key={f.key} factor={f} />)}
        </View>
      )}

      {safeFactors.length > 0 && (
        <View style={styles.factorsSection}>
          <Text style={styles.sectionTitle}>Clean Indicators</Text>
          {safeFactors.map((f) => <RiskFactorRow key={f.key} factor={f} />)}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareBtnText}>Share Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newCheckBtn} onPress={() => router.push('/check')} activeOpacity={0.8}>
          <Text style={styles.newCheckBtnText}>Check Another Address</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ErrorView() {
  return (
    <View style={styles.errContainer}>
      <View style={styles.errIconWrap}>
        <Text style={styles.errIcon}>⚠</Text>
      </View>
      <Text style={styles.errText}>Result not found</Text>
      <TouchableOpacity style={styles.errBtn} onPress={() => router.back()}>
        <Text style={styles.errBtnText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 48, gap: 14 },

  scoreCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chainPill: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  chainDot: { width: 8, height: 8, borderRadius: 4 },
  chainLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  checkedAt: { fontSize: 12, color: Colors.textMuted },
  gaugeArea: { alignItems: 'center', paddingVertical: 24 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  statDiv: { width: 1, backgroundColor: Colors.border, marginVertical: 12 },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.textMuted },

  addressCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  addressLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.4,
    lineHeight: 20,
  },
  copyHint: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  cleanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.lowBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lowBorder,
  },
  cleanIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.low,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cleanIcon: { fontSize: 18, color: '#FFFFFF', fontWeight: '800' },
  cleanTitle: { fontSize: 15, fontWeight: '700', color: Colors.low, marginBottom: 3 },
  cleanDesc: { fontSize: 13, color: Colors.low, opacity: 0.8, lineHeight: 18 },

  riskBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  riskBannerIcon: { fontSize: 18, marginTop: 1 },
  riskBannerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  riskBannerDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  factorsSection: { gap: 0 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  actions: { gap: 10, marginTop: 4 },
  shareBtn: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareBtnText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '600' },
  newCheckBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newCheckBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  errContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 40,
  },
  errIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.criticalBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errIcon: { fontSize: 28, color: Colors.critical },
  errText: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  errBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  errBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
