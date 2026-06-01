import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { AmlCheckResult, HistoryItem } from '../types';

const LOCAL_KEY = 'aml_check_history';
const MAX_LOCAL = 50;

// ─── Supabase (cloud, authenticated) ────────────────────────────────────────

async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

async function saveCloud(item: Omit<HistoryItem, 'id'>): Promise<HistoryItem | null> {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('aml_checks')
    .insert({
      user_id: session.user.id,
      address: item.address,
      chain: item.chain,
      risk_level: item.riskLevel,
      risk_score: item.riskScore,
      risk_factors: item.riskFactors,
      checked_at: item.checkedAt,
    })
    .select('id')
    .single();

  if (error || !data) return null;
  return { ...item, id: data.id, rawData: undefined };
}

async function getCloud(): Promise<HistoryItem[]> {
  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('aml_checks')
    .select('*')
    .order('checked_at', { ascending: false })
    .limit(100);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    address: row.address,
    chain: row.chain,
    riskLevel: row.risk_level,
    riskScore: row.risk_score,
    riskFactors: row.risk_factors,
    checkedAt: row.checked_at,
  }));
}

async function deleteCloud(id: string): Promise<void> {
  await supabase.from('aml_checks').delete().eq('id', id);
}

async function clearCloud(): Promise<void> {
  const session = await getSession();
  if (!session) return;
  await supabase.from('aml_checks').delete().eq('user_id', session.user.id);
}

// ─── AsyncStorage (local, guest) ────────────────────────────────────────────

async function saveLocal(item: Omit<HistoryItem, 'id'>): Promise<HistoryItem> {
  const history = await getLocal();
  const newItem: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    rawData: undefined,
  };
  const updated = [newItem, ...history].slice(0, MAX_LOCAL);
  await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  return newItem;
}

async function getLocal(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function deleteLocal(id: string): Promise<void> {
  const history = await getLocal();
  await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(history.filter((i) => i.id !== id)));
}

async function clearLocal(): Promise<void> {
  await AsyncStorage.removeItem(LOCAL_KEY);
}

// ─── Public API (auto-selects cloud or local) ────────────────────────────────

export async function saveToHistory(item: Omit<AmlCheckResult, 'rawData'>): Promise<HistoryItem> {
  const cloud = await saveCloud(item);
  if (cloud) return cloud;
  return saveLocal(item);
}

export async function getHistory(): Promise<HistoryItem[]> {
  const session = await getSession();
  return session ? getCloud() : getLocal();
}

export async function removeHistoryItem(id: string): Promise<void> {
  const session = await getSession();
  session ? await deleteCloud(id) : await deleteLocal(id);
}

export async function clearHistory(): Promise<void> {
  const session = await getSession();
  session ? await clearCloud() : await clearLocal();
}
