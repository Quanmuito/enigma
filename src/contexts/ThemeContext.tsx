import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    ChangeEvent
} from 'react';
import {
    Theme,
    THEME_KEY,
    THEME_LIGHT,
    THEMES
} from 'constants/themes';

type ThemeContextType = {
    theme: Theme;
    setTheme: (e: ChangeEvent<HTMLSelectElement>) => void;
}

type ThemeProviderPropsType = {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderPropsType) {
    const [theme, setThemeState] = useState<Theme>(THEME_LIGHT);

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
        if (storedTheme) setThemeState(storedTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    function setTheme(e: ChangeEvent<HTMLSelectElement>) {
        const newTheme = e.target.value;

        if (THEMES.includes(newTheme as Theme)) {
            setThemeState(newTheme as Theme);
        }
    }

    return (
        <ThemeContext.Provider value={ { theme, setTheme } }>
            { children }
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
