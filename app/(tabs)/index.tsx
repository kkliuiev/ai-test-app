import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ChainSelector from '../../components/ChainSelector';
import DiamondLogo from '../../components/DiamondLogo';
import InfoBanner from '../../components/InfoBanner';
import { Colors } from '../../constants/colors';
import { SUPPORTED_CHAINS } from '../../constants/chains';
import { checkAddress, isValidAddress } from '../../services/amlService';
import { saveToHistory } from '../../services/historyService';
import { AmlCheckResult, Chain } from '../../types';

const DEMO_ADDRESSES = [
  { label: 'Known Phisher', address: '0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b' },
  { label: 'Safe Address', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  { label: 'Mixer Related', address: '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C' },
];

export default function CheckerScreen() {
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.hero}>
          <DiamondLogo size="lg" showLabel />
          <Text style={styles.heroDesc}>
            Analyze blockchain addresses for sanctions, money laundering, phishing, and 17 other risk indicators.
          </Text>
        </View>

        {/* Check Card */}
        <View style={styles.card}>
          <ChainSelector selected={selectedChain} onSelect={setSelectedChain} />

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Wallet / Contract Address</Text>
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

          <TouchableOpacity
            style={[styles.checkBtn, (!address.trim() || loading) && styles.checkBtnDisabled]}
            onPress={handleCheck}
            disabled={!address.trim() || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.checkBtnText}>Analyze Address</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Demo addresses */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Try a demo address</Text>
          <View style={styles.demoRow}>
            {DEMO_ADDRESSES.map((d) => (
              <TouchableOpacity
                key={d.address}
                style={styles.demoChip}
                onPress={() => { setAddress(d.address); setError(null); }}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InfoBanner
          type="info"
          message="Risk data is sourced from GoPlus Security Labs. For informational purposes only — not financial or legal advice."
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 40 },

  hero: { paddingVertical: 28, gap: 16 },
  heroDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 20,
  },

  inputSection: { gap: 8 },
  inputLabel: { fontSize: 12, color: Colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  inputError: { borderColor: Colors.critical },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 12,
    letterSpacing: 0.3,
  },
  inputBtn: { paddingLeft: 10, paddingVertical: 8 },
  inputBtnText: { color: Colors.textMuted, fontSize: 13 },
  pasteText: { color: Colors.primaryLight, fontSize: 13, fontWeight: '600' },
  validHint: { fontSize: 12, color: Colors.low },

  checkBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  checkBtnDisabled: { backgroundColor: Colors.border },
  checkBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  demoSection: { marginBottom: 20 },
  demoTitle: { fontSize: 12, color: Colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  demoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  demoChip: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoChipText: { fontSize: 12, color: Colors.textSecondary },
});
