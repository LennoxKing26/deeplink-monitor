import en from './messages/en.json';
import zh from './messages/zh.json';
import ko from './messages/ko.json';

export const locales = ['en', 'zh', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const messages = { en, zh, ko };

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어',
};
