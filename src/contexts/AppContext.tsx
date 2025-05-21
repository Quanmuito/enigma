import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LocaleProvider } from './LocaleContext';
import { UIProvider } from './UIContext';

type AppProviderPropsType = {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderPropsType) {
    return (
        <ThemeProvider>
            <LocaleProvider>
                <UIProvider>
                    { children }
                </UIProvider>
            </LocaleProvider>
        </ThemeProvider>
    );
}
