import { router } from 'expo-router';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DiamondLogo from '../../components/DiamondLogo';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const SERVICE_CARDS = [
  {
    icon: '🔍',
    iconBg: '#EDE9FE',
    title: 'AML Check',
    subtitle: 'Screen any address',
    route: '/check' as const,
  },
  {
    icon: '🕐',
    iconBg: '#DBEAFE',
    title: 'History',
    subtitle: 'Your past checks',
    route: '/(tabs)/history' as const,
  },
  {
    icon: 'ℹ',
    iconBg: '#D1FAE5',
    title: 'About',
    subtitle: 'Risk score guide',
    route: '/(tabs)/about' as const,
  },
  {
    icon: '⛓',
    iconBg: '#FCE7F3',
    title: 'Networks',
    subtitle: '6 chains supported',
    route: '/check' as const,
  },
];

export default function HomeScreen() {
  const { user, isGuest } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Top header */}
        <View style={styles.topBar}>
          <DiamondLogo size="md" showLabel />
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>
              {user ? (user.email?.split('@')[0] ?? 'User') : 'Guest'}
            </Text>
          </View>
        </View>

        {/* Banner card */}
        <TouchableOpacity
          style={styles.banner}
          onPress={() => router.push('/check')}
          activeOpacity={0.88}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerStar}>✦</Text>
            <Text style={styles.bannerTitle}>AML Risk Check</Text>
            <Text style={styles.bannerSub}>GoPlus · 40+ sources · 6 chains</Text>
          </View>
          <Text style={styles.bannerArrow}>→</Text>
        </TouchableOpacity>

        {/* Services section */}
        <Text style={styles.sectionLabel}>SERVICES</Text>
        <View style={styles.grid}>
          {SERVICE_CARDS.map((card) => (
            <TouchableOpacity
              key={card.title}
              style={styles.serviceCard}
              onPress={() => router.push(card.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.serviceIconWrap, { backgroundColor: card.iconBg }]}>
                <Text style={styles.serviceIcon}>{card.icon}</Text>
              </View>
              <Text style={styles.serviceTitle}>{card.title}</Text>
              <Text style={styles.serviceSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick nav row */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/history')} activeOpacity={0.7}>
            <Text style={styles.quickBtnText}>History</Text>
          </TouchableOpacity>
          <View style={styles.quickDivider} />
          <View style={styles.quickBtn}>
            <Text style={styles.quickBtnText} numberOfLines={1}>
              {user ? (user.email ?? 'Account') : 'Guest'}
            </Text>
          </View>
          <View style={styles.quickDivider} />
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/about')} activeOpacity={0.7}>
            <Text style={styles.quickBtnText}>About</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky new check button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/check')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>🔍  New Check</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userBadge: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  userBadgeText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },

  banner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerLeft: { gap: 6 },
  bannerStar: { fontSize: 20, color: '#D946EF' },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  bannerArrow: { fontSize: 24, color: '#D946EF', fontWeight: '600' },

  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    width: '47.5%',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: { fontSize: 20 },
  serviceTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  serviceSubtitle: { fontSize: 12, color: Colors.textSecondary },

  quickRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  quickDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 10 },

  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});
