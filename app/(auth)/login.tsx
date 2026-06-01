import { Link, router } from 'expo-router';
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

export default function LoginScreen() {
  const { signIn, continueAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await signIn(email.trim(), password);
    if (err) {
      setError(err);
      setLoading(false);
    }
    // navigation handled by root layout on session change
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <DiamondLogo size="xl" showLabel />
          <Text style={styles.tagline}>Sign in to sync your AML checks across devices</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

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
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(null); }}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.primaryBtnText}>Sign In</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Create account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} activeOpacity={0.8}>
          <Text style={styles.guestBtnText}>Continue as Guest</Text>
          <Text style={styles.guestSubtext}>History saved locally only</Text>
        </TouchableOpacity>
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
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { fontSize: 12, color: Colors.primaryLight },

  input: {
    backgroundColor: Colors.bgInput, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 13,
    color: Colors.textPrimary, fontSize: 15,
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  passwordInput: { flex: 1, color: Colors.textPrimary, fontSize: 15, paddingVertical: 13 },
  eyeBtn: { paddingLeft: 10 },
  eyeText: { fontSize: 16 },

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

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, color: Colors.textMuted },

  guestBtn: {
    backgroundColor: Colors.bgCard, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, paddingVertical: 14, alignItems: 'center', gap: 4,
  },
  guestBtnText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  guestSubtext: { color: Colors.textMuted, fontSize: 12 },
});
