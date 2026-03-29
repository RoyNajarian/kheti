import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="page-footer" role="contentinfo" aria-label="Pied de page Kheti">

            <div className="footer-inner">
                <div className="footer-infos" aria-label="Informations du restaurant">

                    <div className="footer-infos__top">
                        <a href="/" aria-label="Retour à l'accueil Kheti">
                            <img
                                src="/public/images/kheti-logo.png"
                                alt="Logo Kheti – Restaurant égyptien à Paris"
                                className="footer-logo"
                            />
                        </a>

                        <nav className="footer-nav" aria-label="Liens légaux">
                            <Link
                                to="/mentions-legales"
                                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                            >
                                Mentions légales
                            </Link>
                            <Link to="/nous-ecouter">Nous écouter</Link>
                        </nav>
                    </div>

                    <div className="footer-infos__bottom">
                        <p className="footer-social-label">Suivez-nous</p>
                        <ul className="footer-socials" role="list" aria-label="Réseaux sociaux">
                            <li>
                                <a
                                    href="https://www.instagram.com/faravision.agency/"
                                    className="footer-social-link"
                                    aria-label="Faravision sur Instagram (ouvre un nouvel onglet)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/public/images/instagram.svg" alt="" aria-hidden="true" className="socials-logo" />
                                    <span className="footer-social-name">Instagram</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.tiktok.com/@faravision"
                                    className="footer-social-link"
                                    aria-label="Faravision sur TikTok (ouvre un nouvel onglet)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/public/images/tiktok.svg" alt="" aria-hidden="true" className="socials-logo" />
                                    <span className="footer-social-name">TikTok</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <p className="footer-copyright">
                        <small>© {new Date().getFullYear()} Faravision. Tous droits réservés.</small>
                    </p>
                </div>

                <div className="footer-divider" role="separator" aria-hidden="true">
                    <span className="footer-divider__line" />
                    <span className="footer-divider__ornament" aria-hidden="true">𓂀</span>
                    <span className="footer-divider__line" />
                </div>

                <div className="footer-location" aria-label="Localisation du restaurant">
                    <p className="footer-location-text">
                        <span aria-hidden="true" className="footer-location-icon">𓇳</span>
                        Retrouvez-nous ici&nbsp;!
                    </p>
                    <a
                        href="https://maps.google.com/?q=Kheti+Paris"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Voir Kheti sur Google Maps (ouvre un nouvel onglet)"
                        className="footer-location__map-link"
                    >
                        <img
                            src="/public/images/footer-location-map.png"
                            alt="Carte de Paris indiquant l'emplacement du restaurant Kheti"
                            className="footer-location__map"
                            width="300"
                            height="300"
                        />
                        <span className="footer-location__cta" aria-hidden="true">Voir sur la carte →</span>
                    </a>
                </div>
            </div>

        </footer>
    )
}

export default Footer