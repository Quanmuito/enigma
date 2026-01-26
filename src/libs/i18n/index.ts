import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { LOCALE_EN, LOCALE_FI, LOCALE_VI, LOCALE_KEY } from './constants';

import enResources from './locales/en';
import fiResources from './locales/fi';
import viResources from './locales/vi';

const i18n = i18next.createInstance();

export function initI18n() {
    return i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            lng: LOCALE_EN,
            fallbackLng: LOCALE_EN,
            defaultNS: 'translation',
            ns: ['translation', 'header'],
            resources: {
                [LOCALE_EN]: enResources,
                [LOCALE_FI]: fiResources,
                [LOCALE_VI]: viResources,
            },
            detection: {
                lookupLocalStorage: LOCALE_KEY,
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
            },
            react: {
                useSuspense: false,
            },
            interpolation: {
                escapeValue: false,
            },
            keySeparator: '.',
            nsSeparator: ':',
            returnNull: false,
            returnEmptyString: false,
        });
}

export default i18n;

export {
    LOCALE_KEY,
    LOCALE_EN,
    LOCALE_FI,
    LOCALE_VI,
    LOCALES,
    type Locale
} from './constants';
