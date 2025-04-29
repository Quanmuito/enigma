import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LOCALE_EN, LOCALE_FI, LOCALE_VI } from 'constants/locales';

import enResources from './locales/en';
import fiResources from './locales/fi';
import viResources from './locales/vi';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        lng: localStorage.getItem('i18nextLng') || LOCALE_EN,
        fallbackLng: LOCALE_EN,
        resources: {
            [LOCALE_EN]: enResources,
            [LOCALE_FI]: fiResources,
            [LOCALE_VI]: viResources,
        },
        detection: {
            order: ['localStorage'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
