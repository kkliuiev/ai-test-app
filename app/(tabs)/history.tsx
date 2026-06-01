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
        <View style={styles.emptyIcon}><Text style={styles.emptyEmoji}>📋</Text></View>
        <Text style={styles.emptyTitle}>No checks yet</Text>
        <Text style={styles.emptySubtitle}>Your AML check history will appear here</Text>
        <TouchableOpacity style={styles.goBtn} onPress={() => router.push('/')} activeOpacity={0.8}>
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
          <HistoryCard item={item} onPress={(i) => router.push({ pathname: '/result', params: { data: JSON.stringify(i) } })} onDelete={handleDelete} />
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.countText}>{items.length} checks</Text>
            <TouchableOpacity onPress={handleClearAll}>
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
    marginBottom: 14,
  },
  countText: { fontSize: 13, color: Colors.textSecondary },
  clearText: { fontSize: 13, color: Colors.critical, fontWeight: '600' },

  empty: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  goBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  goBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
