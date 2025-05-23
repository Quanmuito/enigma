import React, { ReactNode } from 'react';
import style from './style.module.css';

type NavPageItemPropsType = {
    route: string;
    text: string;
    toggleMenu: () => void;
}
export function NavPageItem({ route, text, toggleMenu }: NavPageItemPropsType) {
    return (
        <li className={ `${style.menuNavPagesItem} ${style.menuNavPagesItemActive}` }>
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
        <li className={ style.menuNavActionsItem }>
            { icon }
            { action }
        </li>
    );
}

type NavIconPropsType = {
    href: string;
    icon: ReactNode;
}
export function NavIcon({ href, icon }: NavIconPropsType) {
    return (
        <li className={ style.navIcon }>
            <a target="_blank" href={ href } rel="noreferrer">{ icon }</a>
        </li>
    );
}
