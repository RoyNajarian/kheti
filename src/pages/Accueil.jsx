const Accueil = () => {
    return (
        <section className="accueil" aria-label="Page d'accueil Kheti">

            {/* Navigation principale */}
            <nav className="accueil__top-nav" aria-label="Navigation principale">
                <ul role="list" className="accueil__top-buttons">
                    <li>
                        <button
                            className="accueil__top-button"
                            type="button"
                            aria-label="Réserver une table"
                        >
                            Réserver
                        </button>
                    </li>
                    <li>
                        <button
                            className="accueil__top-button"
                            type="button"
                            aria-label="Se connecter à son compte"
                        >
                            Connexion
                        </button>
                    </li>
                    <li>
                        <a
                            href="/register"
                            className="accueil__top-button accueil__top-button--labyrinth"
                            aria-label="Accéder au Labyrinthe"
                        >
                            Labyrinth
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Contenu héro */}
            <div className="accueil-content">

                {/* Logo + CTA */}
                <div className="accueil-main">
                    <img
                        src="/public/images/kheti-logo.png"
                        alt="Kheti - Restaurant égyptien à Paris"
                        className="accueil-logo"
                        width="600"
                    />
                    <button
                        className="accueil-trailer-btn"
                        type="button"
                        aria-label="Voir le trailer de Kheti"
                    >
                        <span className="accueil-trailer-btn__icon" aria-hidden="true">▶</span>
                        Voir le trailer
                    </button>
                </div>

                {/* Personnage décoratif */}
                <img
                    src="/public/images/pharaon.png"
                    alt=""
                    aria-hidden="true"
                    className="accueil-pharaon"
                />

                {/* BD égyptiennes */}
                <div className="accueil-bd" aria-label="Bandes dessinées à thème égyptien">
                    <figure className="accueil-bd__item accueil-bd__item--left">
                        <img
                            src="/public/images/b&m_le-mystere-de-le-grande-pyramide.png"
                            alt="Blake et Mortimer - Le Mystère de la Grande Pyramide"
                            className="accueil-bd__cover"
                        />
                    </figure>
                    <figure className="accueil-bd__item accueil-bd__item--center">
                        <img
                            src="/public/images/tintin_les-cigares-du-pharaon.png"
                            alt="Tintin - Les Cigares du Pharaon"
                            className="accueil-bd__cover"
                        />
                    </figure>
                    <figure className="accueil-bd__item accueil-bd__item--right">
                        <img
                            src="/public/images/asterix-et-cleopatre.png"
                            alt="Astérix et Cléopâtre"
                            className="accueil-bd__cover"
                        />
                    </figure>
                </div>

                {/* Scroll CTA */}
                <a
                    href="#suite"
                    className="accueil-scroll-action"
                    aria-label="Défiler pour voir plus de contenu"
                >
                    <span className="accueil-scroll-action__label">Voir plus</span>
                    <svg
                        width="18"
                        height="38"
                        viewBox="0 0 65 130"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M44.976 89C44.976 89.5523 44.5282 90 43.976 90H20.976C20.4237 90 19.976 89.5523 19.976 89V1C19.976 0.447718 20.4237 0 20.976 0H43.976C44.5282 0 44.976 0.447715 44.976 1V89Z" fill="white" />
                        <path d="M32.476 130L64.9519 77.5H0L32.476 130Z" fill="white" />
                    </svg>
                </a>

            </div>
        </section>
    );
}

export default Accueil;