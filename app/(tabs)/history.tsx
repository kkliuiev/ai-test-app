import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HistoryCard from '../../components/HistoryCard';
import { Colors } from '../../constants/colors';
import { clearHistory, getHistory, removeHistoryItem } from '../../services/historyService';
import { HistoryItem } from '../../types';

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useFocusEffect(useCallback(() => { getHistory().then(setItems); }, []));

  const handleDelete = async (id: string) => {
    await removeHistoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert('Clear History', 'Delete all check history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: async () => { await clearHistory(); setItems([]); } },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconWrap}>
          <Text style={styles.emptyEmoji}>📋</Text>
        </View>
        <Text style={styles.emptyTitle}>No checks yet</Text>
        <Text style={styles.emptySubtitle}>Your AML check history will appear here</Text>
        <TouchableOpacity style={styles.goBtn} onPress={() => router.push('/check')} activeOpacity={0.8}>
          <Text style={styles.goBtnText}>Check an Address</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={(i) => router.push({ pathname: '/result', params: { data: JSON.stringify(i) } })}
            onDelete={handleDelete}
          />
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View>
              <Text style={styles.listHeaderTitle}>Recent Checks</Text>
              <Text style={styles.countText}>{items.length} addresses checked</Text>
            </View>
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  list: { padding: 20, paddingBottom: 40 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeaderTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  countText: { fontSize: 13, color: Colors.textSecondary },
  clearBtn: {
    backgroundColor: Colors.criticalBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.criticalBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  clearText: { fontSize: 13, color: Colors.critical, fontWeight: '600' },

  empty: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 240,
  },
  goBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 15,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
