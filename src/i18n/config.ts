import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arTranslations from './ar.json';
import enTranslations from './en.json';

const STORAGE_KEY = 'speech_center_language';

// Helper to update HTML document direction and language attributes
export const applyDirectionAndLanguage = (lang: string) => {
  const isArabic = lang.startsWith('ar');
  const dir = isArabic ? 'rtl' : 'ltr';
  const htmlElement = document.documentElement;

  htmlElement.setAttribute('lang', isArabic ? 'ar' : 'en');
  htmlElement.setAttribute('dir', dir);
};

// Initial language detection: saved in localStorage or default to 'ar' (Arabic FIRST)
const savedLanguage = localStorage.getItem(STORAGE_KEY) || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: arTranslations },
      en: { translation: enTranslations },
    },
    lng: savedLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // React already prevents XSS
    },
  });

// Apply on startup
applyDirectionAndLanguage(savedLanguage);

// Update HTML tag whenever language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  applyDirectionAndLanguage(lng);
});

export default i18n;
