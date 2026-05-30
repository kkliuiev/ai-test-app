import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HistoryCard from '../../components/HistoryCard';
import {
  clearHistory,
  getHistory,
  removeHistoryItem,
} from '../../services/historyService';
import { HistoryItem } from '../../types';

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setItems);
    }, [])
  );

  const handleDelete = async (id: string) => {
    await removeHistoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all check history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setItems([]);
          },
        },
      ]
    );
  };

  const handlePress = (item: HistoryItem) => {
    router.push({
      pathname: '/result',
      params: { data: JSON.stringify(item) },
    });
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No checks yet</Text>
        <Text style={styles.emptySubtitle}>
          Your AML check history will appear here
        </Text>
        <TouchableOpacity
          style={styles.goButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.goButtonText}>Check an Address</Text>
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
            onPress={handlePress}
            onDelete={handleDelete}
          />
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
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  clearText: {
    fontSize: 14,
    color: '#FF2D55',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  goButton: {
    marginTop: 16,
    backgroundColor: '#7B68EE',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
