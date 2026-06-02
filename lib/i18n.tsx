import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from '../locales/en';
import { ua } from '../locales/ua';

export type Locale = 'en' | 'ua';

const LOCALE_KEY = 'aml_locale';
const dict: Record<Locale, Record<string, string>> = { en, ua };

function detectLocale(): Locale {
  try {
    if (Intl.DateTimeFormat().resolvedOptions().locale.startsWith('uk')) return 'ua';
  } catch {}
  return 'en';
}

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nCtx>({
  locale: 'en',
  setLocale: async () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_KEY).then((saved) => {
      setLocaleState(saved === 'en' || saved === 'ua' ? saved : detectLocale());
    });
  }, []);

  const setLocale = async (l: Locale) => {
    setLocaleState(l);
    await AsyncStorage.setItem(LOCALE_KEY, l);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let str = dict[locale][key] ?? dict.en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
