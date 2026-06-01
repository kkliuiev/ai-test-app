import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ChainSelector from '../components/ChainSelector';
import InfoBanner from '../components/InfoBanner';
import { Colors } from '../constants/colors';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { checkAddress, isValidAddress } from '../services/amlService';
import { saveToHistory } from '../services/historyService';
import { AmlCheckResult, Chain } from '../types';

const HOW_IT_WORKS = [
  { num: '1', text: 'Enter any EVM wallet or contract address' },
  { num: '2', text: 'Select the blockchain network' },
  { num: '3', text: 'Instantly get a risk score from 40+ sources' },
];

export default function CheckScreen() {
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) { setAddress(text.trim()); setError(null); }
    } catch {}
  };

  const handleClear = () => {
    setAddress(''); setError(null); inputRef.current?.focus();
  };

  const handleCheck = async () => {
    const trimmed = address.trim();
    if (!trimmed) { setError('Please enter a crypto address'); return; }
    if (!isValidAddress(trimmed)) {
      setError('Invalid address format. EVM addresses start with 0x followed by 40 hex characters.');
      return;
    }

    setError(null);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result: AmlCheckResult = await checkAddress(trimmed, selectedChain);
      await saveToHistory(result);
      Haptics.notificationAsync(
        result.riskScore > 50
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
      router.push({ pathname: '/result', params: { data: JSON.stringify(result) } });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to check address. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const valid = address.trim().length > 0 && isValidAddress(address.trim());

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero icon + title */}
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>🔍</Text>
            </View>
            <Text style={styles.heroTitle}>AML Risk Check</Text>
            <Text style={styles.heroSubtitle}>
              Screen any blockchain address for risk indicators
            </Text>
          </View>

          {/* Chain selector */}
          <View style={styles.section}>
            <ChainSelector selected={selectedChain} onSelect={setSelectedChain} />
          </View>

          {/* Address input */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>ADDRESS</Text>
            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={address}
                onChangeText={(t) => { setAddress(t); setError(null); }}
                placeholder="0x..."
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                returnKeyType="done"
                onSubmitEditing={handleCheck}
                editable={!loading}
              />
              {address.length > 0 ? (
                <TouchableOpacity onPress={handleClear} style={styles.inputBtn}>
                  <Text style={styles.inputBtnText}>✕</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handlePaste} style={styles.inputBtn}>
                  <Text style={styles.pasteText}>Paste</Text>
                </TouchableOpacity>
              )}
            </View>
            {valid && <Text style={styles.validHint}>✓ Valid address format</Text>}
          </View>

          {error && <InfoBanner type="error" message={error} />}

          {/* How it works */}
          <View style={styles.howCard}>
            <Text style={styles.howTitle}>HOW IT WORKS</Text>
            {HOW_IT_WORKS.map((step) => (
              <View key={step.num} style={styles.howStep}>
                <View style={styles.howNum}>
                  <Text style={styles.howNumText}>{step.num}</Text>
                </View>
                <Text style={styles.howText}>{step.text}</Text>
              </View>
            ))}
          </View>

          {/* Spacer for sticky button */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Sticky CTA button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.ctaBtn, (!address.trim() || loading) && styles.ctaBtnDisabled]}
            onPress={handleCheck}
            disabled={!address.trim() || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.ctaBtnText}>Analyze Address</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },

  hero: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroIconText: { fontSize: 32 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, maxWidth: 260 },

  section: { marginBottom: 20 },

  inputLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: { borderColor: Colors.critical },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 14,
    letterSpacing: 0.3,
  },
  inputBtn: { paddingLeft: 10, paddingVertical: 8 },
  inputBtnText: { color: Colors.textMuted, fontSize: 13 },
  pasteText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  validHint: { fontSize: 12, color: Colors.low, marginTop: 6 },

  howCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  howTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  howStep: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  howNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howNumText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  howText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },

  ctaContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 16 : 20,
    paddingTop: 12,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: { backgroundColor: Colors.border },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});
