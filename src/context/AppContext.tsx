import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LocaleProvider } from './LocaleContext';
import { MenuProvider } from './MenuContext';

interface AppProviderPropsType {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderPropsType) {
    return (
        <ThemeProvider>
            <LocaleProvider>
                <MenuProvider>
                    { children }
                </MenuProvider>
            </LocaleProvider>
        </ThemeProvider>
    );
}
