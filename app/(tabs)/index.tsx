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
import InfoBanner from '../../components/InfoBanner';
import { SUPPORTED_CHAINS } from '../../constants/chains';
import { checkAddress, isValidAddress } from '../../services/amlService';
import { saveToHistory } from '../../services/historyService';
import { AmlCheckResult, Chain } from '../../types';

const DEMO_ADDRESSES = [
  { label: 'Known Phisher (ETH)', address: '0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b' },
  { label: 'Safe Address (ETH)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
  { label: 'Mixer Related (ETH)', address: '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C' },
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
      if (text) {
        setAddress(text.trim());
        setError(null);
      }
    } catch {
      // clipboard unavailable
    }
  };

  const handleClear = () => {
    setAddress('');
    setError(null);
    inputRef.current?.focus();
  };

  const handleDemo = (addr: string) => {
    setAddress(addr);
    setError(null);
  };

  const handleCheck = async () => {
    const trimmed = address.trim();
    if (!trimmed) {
      setError('Please enter a crypto address');
      return;
    }
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
      router.push({
        pathname: '/result',
        params: { data: JSON.stringify(result) },
      });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to check address. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const addressIsValid = address.trim().length > 0 && isValidAddress(address.trim());

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>🛡</Text>
          <Text style={styles.heroTitle}>Crypto AML Checker</Text>
          <Text style={styles.heroSubtitle}>
            Analyze blockchain addresses for money laundering, sanctions,
            and other high-risk activities
          </Text>
        </View>

        <View style={styles.card}>
          <ChainSelector selected={selectedChain} onSelect={setSelectedChain} />

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Wallet / Contract Address</Text>
            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={address}
                onChangeText={(t) => {
                  setAddress(t);
                  setError(null);
                }}
                placeholder="0x..."
                placeholderTextColor="#3D3D52"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                returnKeyType="done"
                onSubmitEditing={handleCheck}
                editable={!loading}
                multiline={false}
              />
              {address.length > 0 ? (
                <TouchableOpacity onPress={handleClear} style={styles.inputAction}>
                  <Text style={styles.inputActionText}>✕</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handlePaste} style={styles.inputAction}>
                  <Text style={styles.pasteText}>Paste</Text>
                </TouchableOpacity>
              )}
            </View>
            {addressIsValid && (
              <Text style={styles.validHint}>✓ Valid address format</Text>
            )}
          </View>

          {error && <InfoBanner type="error" message={error} />}

          <TouchableOpacity
            style={[styles.checkButton, (!address.trim() || loading) && styles.checkButtonDisabled]}
            onPress={handleCheck}
            disabled={!address.trim() || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.checkButtonText}>Analyze Address</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Try a demo address</Text>
          <View style={styles.demoButtons}>
            {DEMO_ADDRESSES.map((d) => (
              <TouchableOpacity
                key={d.address}
                style={styles.demoChip}
                onPress={() => handleDemo(d.address)}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InfoBanner
          type="info"
          message="Risk data is sourced from GoPlus Security Labs. This tool is for informational purposes only and does not constitute financial or legal advice."
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  card: {
    backgroundColor: '#16162A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C3E',
    marginBottom: 20,
    gap: 20,
  },
  inputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#8E8E93',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C2C3E',
    paddingHorizontal: 14,
    minHeight: 50,
  },
  inputError: {
    borderColor: '#FF2D55',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 12,
    letterSpacing: 0.3,
  },
  inputAction: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  inputActionText: {
    color: '#636374',
    fontSize: 14,
  },
  pasteText: {
    color: '#7B68EE',
    fontSize: 14,
    fontWeight: '600',
  },
  validHint: {
    fontSize: 12,
    color: '#00C896',
  },
  checkButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  checkButtonDisabled: {
    backgroundColor: '#2C2C3E',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  demoSection: {
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 13,
    color: '#636374',
    marginBottom: 10,
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoChip: {
    backgroundColor: '#16162A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  demoChipText: {
    fontSize: 12,
    color: '#AEAEC0',
  },
});
