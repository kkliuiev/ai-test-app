import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import InfoBanner from '../../components/InfoBanner';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) { setError(error.message); }
    else { setSent(true); }
  };

  if (sent) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.successIcon}>📧</Text>
        <Text style={styles.successTitle}>Reset link sent</Text>
        <Text style={styles.successDesc}>
          Check your inbox at{'\n'}
          <Text style={{ color: Colors.primaryLight }}>{email}</Text>
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backBtn}>
            <Text style={styles.backBtnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password.
        </Text>

        {error && <InfoBanner type="error" message={error} />}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(null); }}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            onSubmitEditing={handleReset}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleReset}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.primaryBtnText}>Send Reset Link</Text>
          }
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backLink}>
            <Text style={styles.backLinkText}>← Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 24, paddingTop: 60, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  field: { gap: 8 },
  label: { fontSize: 12, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.bgInput, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 13,
    color: Colors.textPrimary, fontSize: 15,
  },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 15, alignItems: 'center', minHeight: 50, justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: Colors.border },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  backLink: { alignItems: 'center', paddingVertical: 8 },
  backLinkText: { color: Colors.primaryLight, fontSize: 14 },

  centeredContainer: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
    padding: 40, gap: 14,
  },
  successIcon: { fontSize: 48, marginBottom: 8 },
  successTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  successDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  backBtn: {
    marginTop: 8, backgroundColor: Colors.primary,
    borderRadius: 10, paddingHorizontal: 32, paddingVertical: 14,
  },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
