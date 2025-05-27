import React, { ReactNode } from 'react';
import style from './style.module.css';

type MenuNavPropsType = {
    children: ReactNode
}

export function MenuNavPages({ children }: MenuNavPropsType) {
    return (
        <ul className={ style.menuNavPage }>
            { children }
        </ul>
    );
}

export function MenuNavActions({ children }: MenuNavPropsType) {
    return (
        <ul className={ style.menuNavAction }>
            { children }
        </ul>
    );
}
