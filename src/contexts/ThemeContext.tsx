import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import {
    Theme,
    THEME_KEY,
    THEME_LIGHT,
    THEMES
} from 'constants/themes';

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

type ThemeProviderPropsType = {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderPropsType) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
        return storedTheme || THEME_LIGHT;
    });

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    function setTheme(newTheme: Theme) {
        if (THEMES.includes(newTheme)) {
            setThemeState(newTheme);
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
