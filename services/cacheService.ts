import AsyncStorage from '@react-native-async-storage/async-storage';
import { AmlCheckResult } from '../types';

const TTL_MS = 24 * 60 * 60 * 1000;
const PREFIX = 'aml_cache_';

interface CacheEntry {
  result: AmlCheckResult;
  cachedAt: number;
}

function cacheKey(address: string, chainId: number) {
  return `${PREFIX}${address.toLowerCase()}_${chainId}`;
}

export async function getCached(address: string, chainId: number): Promise<AmlCheckResult | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(address, chainId));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > TTL_MS) {
      await AsyncStorage.removeItem(cacheKey(address, chainId));
      return null;
    }
    return { ...entry.result, fromCache: true };
  } catch {
    return null;
  }
}

export async function setCached(result: AmlCheckResult): Promise<void> {
  try {
    const entry: CacheEntry = { result: { ...result, fromCache: false }, cachedAt: Date.now() };
    await AsyncStorage.setItem(cacheKey(result.address, result.chain.chainId), JSON.stringify(entry));
  } catch {}
}

export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith(PREFIX)));
  } catch {}
}
