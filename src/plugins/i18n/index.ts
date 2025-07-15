import { createI18n } from 'vue-i18n';

const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('./locales/*.json', { eager: true }),
  ).map(([key, value]) => [key.slice(10, -5), value.default]),
);

const language = localStorage.getItem('language') || 'ar';

export default createI18n({
  legacy: false,
  locale: language,
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages,
});
