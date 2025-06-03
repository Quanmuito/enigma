import React from 'react';
import style from './style.module.css';

type MenuButtonPropsType = {
    menuOpen: boolean;
    toggleMenu: () => void;
}
export default function MenuButton({ menuOpen, toggleMenu }: MenuButtonPropsType) {
    return (
        <div className={ style.menuBtn } onClick={ toggleMenu } aria-hidden="true">
            <span className={ `${style.menuBtnBurger} ${menuOpen && style.menuBtnBurgerOpen}` }></span>
        </div>
    );
}
