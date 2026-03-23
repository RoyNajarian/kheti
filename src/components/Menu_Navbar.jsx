import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import '../styles/Menu_Navbar.css';

const LANGS = ['FR', 'EN'];

const MenuNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [lang, setLang] = useState('FR');

    const cycleLang = () => {
        setLang(prev => LANGS[(LANGS.indexOf(prev) + 1) % LANGS.length]);
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

    const handleLinkClick = () => setIsOpen(false);

    return (
        <nav className="top-nav" aria-label="Navigation principale">

            {/* Burger button — visible uniquement sur mobile */}
            <button
                className={`nav-burger${isOpen ? ' nav-burger--open' : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-controls="nav-menu"
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
                        aria-label="Accueil"
                        onClick={handleLinkClick}
                    >
                        Accueil
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/reservation'
                        className={({ isActive }) => `nav-button${isActive ? ' nav-button--active' : ''}`}
                        aria-label="Réserver vos billets"
                        onClick={handleLinkClick}
                    >
                        Réserver
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/login'
                        className={({ isActive }) => `nav-button${isActive ? ' nav-button--active' : ''}`}
                        aria-label="Se connecter à son compte"
                        onClick={handleLinkClick}
                    >
                        Connexion
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/jeu"
                        className={({ isActive }) => `nav-button nav-button--labyrinth${isActive ? ' nav-button--active' : ''}`}
                        aria-label="Accéder au Labyrinthe"
                        onClick={handleLinkClick}
                    >
                        Labyrinth
                    </NavLink>
                </li>
            </ul>
            {/* Bouton langue — mobile : coin haut-gauche du drawer | desktop : inline flex-end */}
            <button
                className={`nav-lang${isOpen ? ' nav-lang--open' : ''}`}
                onClick={cycleLang}
                aria-label={`Langue actuelle : ${lang}. Cliquer pour changer.`}
                type="button"
            >
                <span className="nav-lang__globe" aria-hidden="true">
                    {lang === 'FR' ? (
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
                <span className="nav-lang__label">{lang}</span>
            </button>
        </nav>
    );
};

export default MenuNavbar;