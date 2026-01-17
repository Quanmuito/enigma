import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';

import { useUIContext } from 'contexts/UIContext';
import { useThemeContext } from 'contexts/ThemeContext';
import { useLocaleContext } from 'contexts/LocaleContext';

import { LOCALES, Locale } from 'libs/i18n';
import { THEMES, THEME_LIGHT, Theme } from 'constants/themes';

import { Select, Option } from 'components/Forms/Select';
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

const S3_BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME || 'projectpictures2024';
const S3_REGION = process.env.REACT_APP_S3_REGION || 'eu-north-1';
const S3_DOMAIN = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;

export default function Header() {
    const { menuOpen, toggleMenu } = useUIContext();
    const { locale, setLocale } = useLocaleContext();
    const { theme, setTheme } = useThemeContext();

    const { t } = useTranslation(['header']);

    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocale(e.target.value as Locale);
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value as Theme);
    };

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
                                    <Select
                                        name="selectLanguage"
                                        value={ locale }
                                        onChange={ handleLocaleChange }
                                        aria-label={ t('labelChangeLanguage') }
                                        style={ CustomStyle.select }
                                    >
                                        {LOCALES.map((loc) => (
                                            <Option key={loc} value={loc}>
                                                {t(loc)}
                                            </Option>
                                        ))}
                                    </Select>
                                }
                            />

                            <NavActionItem
                                icon={ theme === THEME_LIGHT ? <LightIcon /> : <DarkIcon /> }
                                action={
                                    <Select
                                        name="selectTheme"
                                        value={ theme }
                                        onChange={ handleThemeChange }
                                        aria-label={ t(theme) }
                                        style={ CustomStyle.select }
                                    >
                                        {THEMES.map((th) => (
                                            <Option key={th} value={th}>
                                                {t(th)}
                                            </Option>
                                        ))}
                                    </Select>
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
