import { Link } from "react-router";
import "./Navbar.css";
import { useState } from "react";
import { useEffect, useRef } from "react";

const Navbar = () => {
    const [menuOpen, setmenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const clickDetector = (event) => {
            if (!menuRef.current.contains(event.target)) {
                setmenuOpen(false);
            }
        };

        document.addEventListener("click", clickDetector);
    }, [])
    

    let menuDeroulant = null;

    if (menuOpen === true) {
        menuDeroulant = (
            <div className="dropdown-menu">
                <Link to="/login" onClick={() => setmenuOpen(false)}>Se connecter</Link>
                <Link to="/register" onClick={() => setmenuOpen(false)}>Créer un compte</Link>
            </div>
        );
    }

    return (
        <nav className="navbar">
            <Link to="/"><img src="/images/logo.png" alt="Accueil" className="navbar-logo"/></Link>
            <ul className="navbar-right">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/reservation">Réservation</Link></li>
                {/* <li><Link to="/immersive">Immersion</Link></li> */}
                <li><Link to="/jeu">Labyrinthe</Link></li>

                <li className="profil-menu" ref={menuRef}>
                    <button className="profil-btn" onClick={() => setmenuOpen(!menuOpen)}><img src="/icons/default.png" alt="Menu Profil"/></button>
                    {menuDeroulant}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;