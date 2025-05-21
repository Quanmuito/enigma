import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    ChangeEvent
} from 'react';
import i18n from 'libs/i18n';
import {
    Locale,
    LOCALE_EN,
    LOCALES
} from 'constants/locales';

interface LocaleContextType {
    locale: Locale;
    setLocale: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface LocaleProviderPropsType {
    children: ReactNode;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);
const LOCALE_KEY = 'app-locale';

export function LocaleProvider({ children }: LocaleProviderPropsType) {
    const [locale, setLocaleState] = useState<Locale>(LOCALE_EN);

    useEffect(() => {
        const storedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
        if (storedLocale) {
            setLocaleState(storedLocale);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCALE_KEY, locale);
    }, [locale]);

    function setLocale(e: ChangeEvent<HTMLSelectElement>) {
        const lang = e.target.value;
        if (LOCALES.includes(lang as Locale)) {
            i18n.changeLanguage(lang);
            setLocaleState(lang as Locale);
        }
    }

    return (
        <LocaleContext.Provider value={ { locale, setLocale } }>
            { children }
        </LocaleContext.Provider>
    );
}

export function useLocaleContext() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
