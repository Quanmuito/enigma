import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import {
    Theme,
    THEME_LIGHT,
    THEME_DARK
} from 'constants/themes';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

interface ThemeProviderPropsType {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = 'app-theme';

export function ThemeProvider({ children }: ThemeProviderPropsType) {
    const [theme, setTheme] = useState<Theme>(THEME_LIGHT);

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
        if (storedTheme) setTheme(storedTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => (prev === THEME_LIGHT ? THEME_DARK : THEME_LIGHT));
    }

    return (
        <ThemeContext.Provider value={ { theme, toggleTheme } }>
            { children }
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
