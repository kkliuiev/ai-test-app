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
import { useTranslation } from '../../lib/i18n';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      setError(t('register.errorFillAll'));
      return;
    }
    if (password.length < 6) {
      setError(t('register.errorMinPassword'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('register.errorPasswordMatch'));
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
        <View style={styles.successIconWrap}>
          <Text style={styles.successIcon}>✉</Text>
        </View>
        <Text style={styles.successTitle}>{t('register.successTitle')}</Text>
        <Text style={styles.successDesc}>
          {t('register.successDesc', { email })}
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backBtn}>
            <Text style={styles.backBtnText}>{t('register.backToSignIn')}</Text>
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
          <Text style={styles.tagline}>{t('register.tagline')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('register.title')}</Text>

          {error && <InfoBanner type="error" message={error} />}

          <View style={styles.field}>
            <Text style={styles.label}>{t('login.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(v) => { setEmail(v); setError(null); }}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('register.password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(v) => { setPassword(v); setError(null); }}
              placeholder={t('register.minPassword')}
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('register.confirmPassword')}</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); setError(null); }}
              placeholder={t('register.repeatPassword')}
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
              : <Text style={styles.primaryBtnText}>{t('register.createAccount')}</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('register.haveAccount')}</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>{t('register.signIn')}</Text>
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
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },

  field: { gap: 8 },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
  },

  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },

  successContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successIcon: { fontSize: 40 },
  successTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  successDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  backBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 36,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
