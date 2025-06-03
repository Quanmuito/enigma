import React, { ReactNode } from 'react';
import style from './style.module.css';

type NavPageItemPropsType = {
    route: string;
    text: string;
    toggleMenu: () => void;
}
export function NavPageItem({ route, text, toggleMenu }: NavPageItemPropsType) {
    return (
        <li className={ `${style.menuNavPageItem} ${style.menuNavPageItemActive}` }>
            <a href={ route } onClick={ toggleMenu }>{ text }</a>
        </li>
    );
}

type NavActionItemPropsType = {
    icon: ReactNode;
    action: ReactNode;
}
export function NavActionItem({ icon, action }: NavActionItemPropsType) {
    return (
        <li className={ style.menuNavActionItem }>
            { icon }
            { action }
        </li>
    );
}

type NavActionIconsPropsType = {
    children: ReactNode;
}
export function NavActionIcons({ children }: NavActionIconsPropsType) {
    return (
        <li className={ style.menuNavActionIcons }>
            { children }
        </li>
    );
}

type NavActionIconPropsType = {
    href: string;
    icon: ReactNode;
}
export function NavActionIcon({ href, icon }: NavActionIconPropsType) {
    return (
        <a href={ href } target="_blank" rel="noreferrer">{ icon }</a>
    );
}
