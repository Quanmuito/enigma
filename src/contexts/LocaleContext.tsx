import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode
} from 'react';
import i18n, {
    Locale,
    LOCALES
} from 'libs/i18n';

type LocaleContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

type LocaleProviderPropsType = {
    children: ReactNode;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: LocaleProviderPropsType) {
    const [locale, setLocaleState] = useState<Locale>(i18n.language as Locale);

    useEffect(() => {
        const handleLanguageChanged = (lang: string) => {
            setLocaleState(lang as Locale);
        };

        i18n.on('languageChanged', handleLanguageChanged);
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        if (LOCALES.includes(newLocale)) {
            i18n.changeLanguage(newLocale);
        }
    }, []);

    const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

    return (
        <LocaleContext.Provider value={ value }>
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
