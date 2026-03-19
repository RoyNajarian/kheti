import { useState, useEffect } from 'react';
import '../styles/Menu_Navbar.css';

const MenuNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                    <a href="/" className="nav-button" aria-label="Accueil" onClick={handleLinkClick}>
                        Accueil
                    </a>
                </li>
                <li>
                    <a href='/reservation' className="nav-button" aria-label="Réserver vos billets" onClick={handleLinkClick}>
                        Réserver
                    </a>
                </li>
                <li>
                    <a href='/login' className="nav-button" aria-label="Se connecter à son compte" onClick={handleLinkClick}>
                        Connexion
                    </a>
                </li>
                <li>
                    <a href="/jeu" className="nav-button nav-button--labyrinth" aria-label="Accéder au Labyrinthe" onClick={handleLinkClick}>
                        Labyrinth
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default MenuNavbar;