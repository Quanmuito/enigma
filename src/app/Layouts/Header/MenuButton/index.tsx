import React from 'react';
import style from './style.module.css';

type MenuButtonPropsType = {
    menuOpen: boolean;
    toggleMenu: () => void;
}
export default function MenuButton({ menuOpen, toggleMenu }: MenuButtonPropsType) {
    return (
        <button
            type="button"
            className={ style.menuBtn }
            onClick={ toggleMenu }
            aria-label="Toggle menu"
            aria-expanded={ menuOpen }
        >
            <span className={ `${style.menuBtnBurger} ${menuOpen && style.menuBtnBurgerOpen}` }></span>
        </button>
    );
}
