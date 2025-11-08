import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ruTranslation from './locales/ru.json';
import enTranslation from './locales/en.json';
import roTranslation from './locales/ro.json';

const resources = {
  ru: {
    translation: ruTranslation,
  },
  en: {
    translation: enTranslation,
  },
  ro: {
    translation: roTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ro', // Default fallback to Romanian
    debug: false, // Disabled debug to reduce console noise
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
