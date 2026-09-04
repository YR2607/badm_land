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

// Initialize with Romanian as default.
// Priority: URL path prefix > localStorage > 'ro'
const detectLanguage = (): string => {
  // Check URL path for lang prefix (e.g. /ro/about, /en, /ru/gyms)
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/(ro|ru|en)(?=\/|$)/);
    if (match) return match[1];
  }
  const savedLanguage = localStorage.getItem('i18nextLng');
  return savedLanguage && ['ro', 'ru', 'en'].includes(savedLanguage) ? savedLanguage : 'ro';
};

const initI18n = async () => {
  const defaultLanguage = detectLanguage();
  
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
