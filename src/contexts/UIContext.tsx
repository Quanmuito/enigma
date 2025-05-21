import React, {
    createContext,
    useContext,
    useState,
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

    function toggleMenu() {
        setOpen((prev) => (!prev));
    }

    return (
        <UIContext.Provider value={ { menuOpen, toggleMenu } }>
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
