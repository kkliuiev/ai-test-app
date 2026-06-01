import { Link } from 'expo-router';
import React, { useState } from 'react';
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
import DiamondLogo from '../../components/DiamondLogo';
import InfoBanner from '../../components/InfoBanner';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    const err = await signUp(email.trim(), password);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✉</Text>
        <Text style={styles.successTitle}>Check your email</Text>
        <Text style={styles.successDesc}>
          We sent a confirmation link to{'\n'}
          <Text style={{ color: Colors.primaryLight }}>{email}</Text>
          {'\n\n'}Open the link to activate your account, then sign in.
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <DiamondLogo size="xl" showLabel />
          <Text style={styles.tagline}>Create an account to sync your checks across all devices</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>

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
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(null); }}
              placeholder="Min. 6 characters"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError(null); }}
              placeholder="Repeat password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
              onSubmitEditing={handleRegister}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.primaryBtnText}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingTop: 60, paddingBottom: 48, gap: 20 },

  header: { alignItems: 'center', gap: 16, paddingBottom: 8 },
  tagline: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, maxWidth: 280 },

  card: {
    backgroundColor: Colors.bgCard, borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: Colors.border, gap: 16,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },

  field: { gap: 8 },
  label: { fontSize: 12, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.bgInput, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 13,
    color: Colors.textPrimary, fontSize: 15,
  },

  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 15, alignItems: 'center', minHeight: 50,
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: Colors.border },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, color: Colors.primaryLight, fontWeight: '600' },

  successContainer: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
    padding: 40, gap: 16,
  },
  successIcon: { fontSize: 52, marginBottom: 8 },
  successTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  successDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  backBtn: {
    marginTop: 8, backgroundColor: Colors.primary,
    borderRadius: 10, paddingHorizontal: 32, paddingVertical: 14,
  },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
