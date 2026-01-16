import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, messages } from '@/i18n';

type Messages = typeof messages.en;

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      t: messages.en,
      setLocale: (locale) => set({ locale, t: messages[locale] }),
    }),
    { name: 'locale-storage' }
  )
);
