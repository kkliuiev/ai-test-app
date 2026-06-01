import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const rawKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// createClient throws if the URL is not a valid https:// URL, which would crash
// the app at module-load time when credentials aren't configured yet.
const isConfigured =
  rawUrl.startsWith('https://') && rawKey.length > 0;

const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isConfigured ? rawKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const isSupabaseConfigured = isConfigured;
