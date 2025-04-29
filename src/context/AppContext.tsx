import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LocaleProvider } from './LocaleContext';

interface AppProviderPropsType {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderPropsType) {
    return (
        <ThemeProvider>
            <LocaleProvider>
                { children }
            </LocaleProvider>
        </ThemeProvider>
    );
}
