import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { type Locale, useTranslation } from '../../lib/i18n';
import { clearAllCache } from '../../services/cacheService';

export default function AboutScreen() {
  const { user, signOut } = useAuth();
  const { t, locale, setLocale } = useTranslation();

  const handleSignOut = () => {
    Alert.alert(t('about.signOutTitle'), t('about.signOutMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('about.signOut'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(t('about.clearCacheTitle'), t('about.clearCacheMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('about.clearCache'), style: 'destructive', onPress: () => clearAllCache() },
    ]);
  };

  const handleLanguage = (l: Locale) => setLocale(l);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {user ? (
        <View style={styles.accountBanner}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{user.email ? user.email[0].toUpperCase() : '?'}</Text>
          </View>
          <Text style={styles.accountName}>{user.email?.split('@')[0] ?? 'Account'}</Text>
          <Text style={styles.accountEmail}>{user.email}</Text>
          <View style={styles.syncPill}>
            <Text style={styles.syncText}>{t('about.cloudSynced')}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.guestBanner}>
          <View style={styles.guestIconWrap}>
            <Text style={styles.guestIcon}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.guestTitle}>{t('about.guestMode')}</Text>
            <Text style={styles.guestSub}>{t('about.guestSub')}</Text>
          </View>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')} activeOpacity={0.85}>
            <Text style={styles.signInBtnText}>{t('about.signIn')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.menuCard}>
        <MenuItem icon="📋" iconBg="#1E3A5F" label={t('about.requestHistory')} onPress={() => router.push('/(tabs)/history')} />
        <View style={styles.menuDivider} />
        <MenuItem icon="🔍" iconBg="#1E3A5F" label={t('about.newAmlCheck')} onPress={() => router.push('/check')} />
        <View style={styles.menuDivider} />
        <MenuItem icon="🗑" iconBg="#1A2744" label={t('about.clearCache')} onPress={handleClearCache} />
        {user && (
          <>
            <View style={styles.menuDivider} />
            <MenuItem icon="🚪" iconBg="#3B1A1A" label={t('about.signOut')} labelColor={Colors.critical} onPress={handleSignOut} />
          </>
        )}
      </View>

      {/* Language selector */}
      <Text style={styles.sectionLabel}>{t('about.language')}</Text>
      <View style={styles.langCard}>
        <TouchableOpacity
          style={[styles.langBtn, locale === 'en' && styles.langBtnActive]}
          onPress={() => handleLanguage('en')}
          activeOpacity={0.8}
        >
          <Text style={styles.langFlag}>🇬🇧</Text>
          <Text style={[styles.langLabel, locale === 'en' && styles.langLabelActive]}>English</Text>
          {locale === 'en' && <View style={styles.langCheck}><Text style={styles.langCheckText}>✓</Text></View>}
        </TouchableOpacity>
        <View style={styles.langDivider} />
        <TouchableOpacity
          style={[styles.langBtn, locale === 'ua' && styles.langBtnActive]}
          onPress={() => handleLanguage('ua')}
          activeOpacity={0.8}
        >
          <Text style={styles.langFlag}>🇺🇦</Text>
          <Text style={[styles.langLabel, locale === 'ua' && styles.langLabelActive]}>Українська</Text>
          {locale === 'ua' && <View style={styles.langCheck}><Text style={styles.langCheckText}>✓</Text></View>}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>{t('about.aboutApp')}</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>{t('about.appDesc')}</Text>
      </View>

      <Text style={styles.sectionLabel}>{t('about.dataSource')}</Text>
      <View style={styles.sourceCard}>
        <View style={styles.sourceHeader}>
          <View style={styles.sourceDot} />
          <Text style={styles.sourceName}>{t('about.sourceTitle')}</Text>
        </View>
        <Text style={styles.sourceDesc}>{t('about.sourceDesc')}</Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>{t('about.disclaimer')}</Text>
        <Text style={styles.disclaimerText}>{t('about.disclaimerText')}</Text>
      </View>

      <Text style={styles.version}>{t('about.version')}</Text>
    </ScrollView>
  );
}

function MenuItem({
  icon, iconBg, label, labelColor, onPress,
}: {
  icon: string; iconBg: string; label: string; labelColor?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.menuIcon}>{icon}</Text>
      </View>
      <Text style={[styles.menuLabel, labelColor ? { color: labelColor } : null]}>{label}</Text>
      <Text style={styles.menuChevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48, gap: 0 },

  accountBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  accountName: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  accountEmail: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  syncPill: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  syncText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  guestBanner: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guestIconWrap: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: Colors.bgHighlight, alignItems: 'center', justifyContent: 'center',
  },
  guestIcon: { fontSize: 22 },
  guestTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  guestSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  signInBtn: { backgroundColor: Colors.primary, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10 },
  signInBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  menuCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  menuIconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  menuChevron: { fontSize: 22, color: Colors.textMuted, fontWeight: '300' },
  menuDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 70 },

  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  langCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  langBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  langBtnActive: { backgroundColor: Colors.bgHighlight },
  langFlag: { fontSize: 22 },
  langLabel: { flex: 1, fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  langLabelActive: { color: Colors.textPrimary, fontWeight: '700' },
  langCheck: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  langCheckText: { fontSize: 12, color: '#fff', fontWeight: '800' },
  langDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  infoCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  infoText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  sourceCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    marginBottom: 24,
  },
  sourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sourceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.low },
  sourceName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  sourceDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  disclaimer: {
    backgroundColor: Colors.mediumBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.mediumBorder,
    gap: 6,
    marginBottom: 24,
  },
  disclaimerTitle: { fontSize: 14, fontWeight: '700', color: Colors.medium },
  disclaimerText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  version: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginBottom: 8 },
});
