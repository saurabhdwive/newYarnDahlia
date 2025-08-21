

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Import translations
import enTranslation from './locales/en/translation.json';
import thTranslation from './locales/th/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  th: {
    translation: thTranslation
  }
};

// Detect device language
const deviceLanguage = RNLocalize.getLocales()[0].languageCode;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage, // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    compatibilityJSON: 'v3' // for Android compatibility
  });

export default i18n;