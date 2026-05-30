import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RiskFactorRow from '../components/RiskFactorRow';
import RiskGauge from '../components/RiskGauge';
import { getRiskColor } from '../services/amlService';
import { AmlCheckResult } from '../types';

export default function ResultScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No result data found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let result: AmlCheckResult;
  try {
    result = JSON.parse(data);
  } catch {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid result data</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { address, chain, riskLevel, riskScore, riskFactors, checkedAt } = result;
  const riskColor = getRiskColor(riskLevel);
  const riskyFactors = riskFactors.filter((f) => f.isRisky);
  const safeFactors = riskFactors.filter((f) => !f.isRisky);

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleShare = async () => {
    const riskyList = riskyFactors.map((f) => `• ${f.label}`).join('\n');
    const message =
      `Crypto AML Check Result\n\n` +
      `Address: ${address}\n` +
      `Chain: ${chain.name}\n` +
      `Risk Level: ${riskLevel} (${riskScore}/100)\n` +
      `Checked: ${new Date(checkedAt).toLocaleString()}\n` +
      (riskyList ? `\nRisk Factors:\n${riskyList}` : '\nNo risk factors detected.');
    try {
      await Share.share({ message });
    } catch {
      // share cancelled
    }
  };

  const checkedDate = new Date(checkedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Risk Score Card */}
      <View style={[styles.scoreCard, { borderColor: riskColor + '44' }]}>
        <View style={[styles.scoreCardHeader, { backgroundColor: riskColor + '18' }]}>
          <View style={styles.chainPill}>
            <Text style={[styles.chainDot, { color: chain.color }]}>●</Text>
            <Text style={styles.chainLabel}>{chain.name}</Text>
          </View>
          <Text style={styles.checkedAt}>{checkedDate}</Text>
        </View>

        <View style={styles.gaugeArea}>
          <RiskGauge score={riskScore} level={riskLevel} />
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Risk Factors" value={String(riskyFactors.length)} color={riskColor} />
          <View style={styles.statDivider} />
          <StatBox label="Clean Checks" value={String(safeFactors.length)} color="#00C896" />
          <View style={styles.statDivider} />
          <StatBox label="Total Checks" value={String(riskFactors.length)} color="#8E8E93" />
        </View>
      </View>

      {/* Address Card */}
      <View style={styles.addressCard}>
        <Text style={styles.sectionLabel}>Address</Text>
        <TouchableOpacity onPress={handleCopyAddress} activeOpacity={0.75}>
          <Text style={styles.addressText}>{address}</Text>
          <Text style={styles.copyHint}>{copiedAddress ? '✓ Copied!' : 'Tap to copy'}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Banner */}
      {riskScore === 0 ? (
        <View style={styles.cleanBanner}>
          <Text style={styles.cleanIcon}>✓</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cleanTitle}>No Risk Detected</Text>
            <Text style={styles.cleanDesc}>
              This address has no known risk indicators in our database.
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.riskSummaryBanner, { borderColor: riskColor + '44', backgroundColor: riskColor + '12' }]}>
          <Text style={[styles.riskSummaryIcon, { color: riskColor }]}>⚠</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.riskSummaryTitle, { color: riskColor }]}>
              {riskLevel} RISK DETECTED
            </Text>
            <Text style={styles.riskSummaryDesc}>
              {riskyFactors.length} risk indicator{riskyFactors.length !== 1 ? 's' : ''} found.
              Exercise caution when transacting with this address.
            </Text>
          </View>
        </View>
      )}

      {/* Risk Factors */}
      {riskyFactors.length > 0 && (
        <View style={styles.factorsSection}>
          <Text style={styles.sectionTitle}>Risk Indicators</Text>
          {riskyFactors.map((factor) => (
            <RiskFactorRow key={factor.key} factor={factor} />
          ))}
        </View>
      )}

      {/* Safe Factors */}
      {safeFactors.length > 0 && (
        <View style={styles.factorsSection}>
          <Text style={styles.sectionTitle}>Clean Indicators</Text>
          {safeFactors.map((factor) => (
            <RiskFactorRow key={factor.key} factor={factor} />
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareButtonText}>Share Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newCheckButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.newCheckButtonText}>Check Another</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    color: '#FF2D55',
    fontSize: 16,
  },
  backLink: {
    color: '#7B68EE',
    fontSize: 15,
  },
  scoreCard: {
    backgroundColor: '#16162A',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scoreCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chainDot: {
    fontSize: 10,
  },
  chainLabel: {
    fontSize: 13,
    color: '#AEAEC0',
    fontWeight: '600',
  },
  checkedAt: {
    fontSize: 12,
    color: '#636374',
  },
  gaugeArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2C2C3E',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2C2C3E',
    marginVertical: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#636374',
  },
  addressCard: {
    backgroundColor: '#16162A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C3E',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#8E8E93',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  copyHint: {
    fontSize: 12,
    color: '#7B68EE',
    marginTop: 4,
  },
  cleanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#001F14',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#00C89644',
  },
  cleanIcon: {
    fontSize: 22,
    color: '#00C896',
  },
  cleanTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00C896',
    marginBottom: 3,
  },
  cleanDesc: {
    fontSize: 13,
    color: '#00C89699',
    lineHeight: 18,
  },
  riskSummaryBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  riskSummaryIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  riskSummaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  riskSummaryDesc: {
    fontSize: 13,
    color: '#AEAEC0',
    lineHeight: 18,
  },
  factorsSection: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  shareButton: {
    backgroundColor: '#16162A',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  shareButtonText: {
    color: '#AEAEC0',
    fontSize: 15,
    fontWeight: '600',
  },
  newCheckButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  newCheckButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
