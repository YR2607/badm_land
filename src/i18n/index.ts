import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

// Initialize with Romanian as default, only check localStorage
const initI18n = async () => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  const defaultLanguage = savedLanguage && ['ro', 'ru', 'en'].includes(savedLanguage) ? savedLanguage : 'ro';
  
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      fallbackLng: 'ro',
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      // Save language changes to localStorage
      saveMissing: false,
    });
    
  // Save the language to localStorage when it changes
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
  });
};

initI18n();

export default i18n;
