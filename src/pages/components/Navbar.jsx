import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/reservation">Reservation</Link></li>
                <li><Link to="/immersive">Immersion</Link></li>
                <li><Link to="/jeu">Labyrinthe</Link></li>

                <li className="user-menu">
                    <button className="profil-btn">
                        <img src="/icons/default-black.png" alt="Menu Profil"/>
                    </button>

                    <div className="dropdown-content">
                        <Link to="/login">Se connecter</Link>
                        <Link to="/register">S'inscrire</Link>
                    </div>
                </li>
                
            </ul>
        </nav>
    );
}