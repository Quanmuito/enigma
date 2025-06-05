import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';

import { useUIContext } from 'contexts/UIContext';
import { useThemeContext } from 'contexts/ThemeContext';
import { useLocaleContext } from 'contexts/LocaleContext';

import { LOCALES } from 'constants/locales';
import { THEMES, THEME_LIGHT } from 'constants/themes';

import Select from 'components/Forms/Select';
import {
    LanguageIcon,
    FacebookIcon,
    GithubIcon,
    LinkedInIcon,
    SearchIcon,
    LightIcon,
    DarkIcon
} from 'components/Icons';
import MenuButton from 'app/Layouts/Header/MenuButton';
import {
    MenuNavActions,
    MenuNavPages
} from 'app/Layouts/Header/MenuNav';
import {
    NavActionItem,
    NavActionIcon,
    NavPageItem,
    NavActionIcons
} from 'app/Layouts/Header/NavItem';

// TODO: Get this into .env file
const S3_BUCKET_NAME = 'projectpictures2024';
const S3_REGION = 'eu-north-1';
const S3_DOMAIN = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;

export default function Header() {
    const { menuOpen, toggleMenu } = useUIContext();
    const { locale, setLocale } = useLocaleContext();
    const { theme, setTheme } = useThemeContext();

    const { t } = useTranslation(['header']);
    const SelectLocale = Select('selectLanguage', t);
    const SelectTheme = Select('selectTheme', t);

    return (
        <header>
            <div className={ style.headerLogo }>
                <img src={ `${S3_DOMAIN}/enigma-logo.png` } alt="logo" />
            </div>

            <div className={ style.headerNavigation }>
                <MenuButton menuOpen={ menuOpen } toggleMenu={ toggleMenu } />
                <nav className={ `${style.nav} ${menuOpen && style.navOpen}` }>
                    <div className={ `${style.menuNav} ${menuOpen && style.menuNavOpen}` }>
                        <MenuNavPages>
                            <NavPageItem route="/" text={ t('home') } toggleMenu={ toggleMenu } />
                        </MenuNavPages>

                        <MenuNavActions>
                            <NavActionItem
                                icon={ <LanguageIcon /> }
                                action={
                                    <SelectLocale
                                        list={ LOCALES }
                                        value={ locale }
                                        onChange={ setLocale }
                                        customStyle={ CustomStyle.select }
                                    />
                                }
                            />

                            <NavActionItem
                                icon={ theme === THEME_LIGHT ? <LightIcon /> : <DarkIcon /> }
                                action={
                                    <SelectTheme
                                        list={ THEMES }
                                        value={ theme }
                                        onChange={ setTheme }
                                        customStyle={ CustomStyle.select }
                                    />
                                }
                            />

                            <NavActionIcons >
                                <NavActionIcon href="#!" icon={ <FacebookIcon /> } />
                                <NavActionIcon href="#!" icon={ <GithubIcon /> } />
                                <NavActionIcon href="#!" icon={ <LinkedInIcon /> } />
                            </NavActionIcons>
                        </MenuNavActions>
                    </div>
                </nav>
            </div>

            <div className={ style.headerButtons }>
                <SearchIcon />
            </div>
        </header>
    );
}

const CustomStyle = {
    select: {
        width: '30vw',
        margin: '0 0 0 1.5rem',
    },
};
