import React, {
    createContext,
    useContext,
    useState,
    ReactNode
} from 'react';

interface MenuContextType {
    open: boolean;
    toggleMenu: () => void;
}

interface MenuProviderPropsType {
    children: ReactNode;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: MenuProviderPropsType) {
    const [open, setOpen] = useState<boolean>(false);

    function toggleMenu() {
        setOpen((prev) => (!prev));
    }

    return (
        <MenuContext.Provider value={ { open, toggleMenu } }>
            { children }
        </MenuContext.Provider>
    );
}

export function useMenuContext() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
}
