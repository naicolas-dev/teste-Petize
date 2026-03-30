import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pt from './locales/pt.json';

// Supported languages
const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Use local storage or default to Portuguese
    lng: localStorage.getItem('petize-lng') || 'pt',
    fallbackLng: 'en',
    interpolation: {
      // React already protects from XSS
      escapeValue: false,
    },
  });

export default i18n;
