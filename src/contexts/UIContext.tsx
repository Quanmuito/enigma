import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode
} from 'react';

type UIContextType = {
    menuOpen: boolean;
    toggleMenu: () => void;
}

type UIProviderPropsType = {
    children: ReactNode;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: UIProviderPropsType) {
    const [menuOpen, setOpen] = useState<boolean>(false);

    const toggleMenu = useCallback(() => {
        setOpen((prev) => (!prev));
    }, []);

    const value = useMemo(() => ({ menuOpen, toggleMenu }), [menuOpen, toggleMenu]);

    return (
        <UIContext.Provider value={ value }>
            { children }
        </UIContext.Provider>
    );
}

export function useUIContext() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUIContext must be used within a UIProvider');
    }
    return context;
}
