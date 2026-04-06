'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Locale, t as translate } from '@/lib/i18n/translations';

const STORAGE_KEY = 'dreams-locale';

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored) setLocaleState(stored);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((key: string) => translate(key, locale), [locale]);

  return { locale, setLocale, t };
}
