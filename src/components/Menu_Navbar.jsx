import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import '../styles/Menu_Navbar.css';
import { useTranslation } from "react-i18next";

const MenuNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const isAuthenticated = Boolean(user);
    const isAdmin = Number(user?.admin_state) === 1;

    const currentLang = i18n.language?.startsWith("fr") ? "FR" : "EN";

    const syncUser = () => {
        try {
            const rawUser = localStorage.getItem('khetiUser');
            setUser(rawUser ? JSON.parse(rawUser) : null);
        } catch {
            localStorage.removeItem('khetiUser');
            setUser(null);
        }
    };

    const cycleLang = () => {
        const nextLang = currentLang === "FR" ? "en" : "fr";
        i18n.changeLanguage(nextLang);
    };

    // Ferme le menu au resize si on passe en tablette/desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Bloque le scroll du body quand le menu est ouvert
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        syncUser();
    }, [location.pathname]);

    useEffect(() => {
        const handleStorage = () => syncUser();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLinkClick = () => setIsOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('khetiUser');
        localStorage.removeItem('khetiToken');
        setUser(null);
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <nav className="top-nav" aria-label={t('navbar.aria.nav')}>

            {/* Burger button — visible uniquement sur mobile */}
            <button
                className={`nav-burger${isOpen ? ' nav-burger--open' : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-controls="nav-menu"
                aria-label={isOpen ? t('navbar.aria.burger_close') : t('navbar.aria.burger_open')}
            >
                <span className="nav-burger__bar" />
                <span className="nav-burger__bar" />
                <span className="nav-burger__bar" />
            </button>

            {/* Overlay sombre derrière le menu mobile */}
            <div
                className={`nav-overlay${isOpen ? ' nav-overlay--visible' : ''}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Liste de navigation */}
            <ul
                id="nav-menu"
                role="list"
                className={`nav-buttons${isOpen ? ' nav-buttons--open' : ''}`}
            >
                <li>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-button${isActive ? ' nav-button--active' : ''}`}
                        aria-label={t('navbar.aria.home')}
                        onClick={handleLinkClick}
                    >
                        {t('navbar.nav.home')}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/reservation'
                        className={({ isActive }) => `nav-button${isActive ? ' nav-button--active' : ''}`}
                        aria-label={t('navbar.aria.reserve')}
                        onClick={handleLinkClick}
                    >
                        {t('navbar.nav.reserve')}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/jeu"
                        className={({ isActive }) => `nav-button nav-button--labyrinth${isActive ? ' nav-button--active' : ''}`}
                        aria-label={t('navbar.aria.labyrinth')}
                        onClick={handleLinkClick}
                    >
                        {t('navbar.nav.labyrinth')}
                    </NavLink>
                </li>
            </ul>

            {/* Bouton langue — mobile : coin haut-gauche du drawer | desktop : inline flex-end */}
            <button
                className={`nav-lang${isOpen ? ' nav-lang--open' : ''}`}
                onClick={cycleLang}
                aria-label={t('navbar.aria.lang', { lang: currentLang })}
                type="button"
            >
                <span className="nav-lang__globe" aria-hidden="true">
                    {currentLang === 'FR' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 3 2" aria-hidden="true">
                            <rect width="1" height="2" fill="#002395" />
                            <rect x="1" width="1" height="2" fill="#fff" />
                            <rect x="2" width="1" height="2" fill="#ED2939" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 60 30" aria-hidden="true">
                            <rect width="60" height="30" fill="#012169" />
                            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                            <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                            <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                        </svg>
                    )}
                </span>
                <span className="nav-lang__label">{currentLang}</span>
            </button>

            <div className="nav-profile-link" aria-label={t('navbar.aria.profile_menu')}>
                <button
                    type="button"
                    className="nav-profile-link__trigger"
                    aria-haspopup="true"
                    aria-label={t('navbar.aria.profile_trigger')}
                >
                    <img src="/icons/pharaon_icone.png" alt="" className="nav-profile-link__icon" />
                </button>

                <div className="nav-profile-dropdown" role="menu" aria-label={t('navbar.aria.profile_menu')}>
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/profil" className="nav-profile-dropdown__item" role="menuitem" onClick={handleLinkClick}>
                                {t('navbar.profile.my_profile')}
                            </NavLink>
                            {isAdmin && (
                                <NavLink to="/back-office" className="nav-profile-dropdown__item" role="menuitem" onClick={handleLinkClick}>
                                    {t('navbar.profile.back_office')}
                                </NavLink>
                            )}
                            <button type="button" className="nav-profile-dropdown__item" role="menuitem" onClick={handleLogout}>
                                {t('navbar.profile.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="nav-profile-dropdown__item" role="menuitem" onClick={handleLinkClick}>
                                {t('navbar.profile.login')}
                            </NavLink>
                            <NavLink to="/register" className="nav-profile-dropdown__item" role="menuitem" onClick={handleLinkClick}>
                                {t('navbar.profile.register')}
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MenuNavbar;