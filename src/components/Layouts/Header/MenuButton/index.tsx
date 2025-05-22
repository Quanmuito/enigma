import React from 'react';
import style from './style.module.css';
import { useUIContext } from 'contexts/UIContext';

export default function MenuButton() {
    const { menuOpen, toggleMenu } = useUIContext();

    return (
        <div className={ style.menuBtn } onClick={ toggleMenu } aria-hidden="true">
            <span className={ `${style.menuBtnBurger} ${menuOpen && style.menuBtnBurgerOpen}` }></span>
        </div>
    );
}
