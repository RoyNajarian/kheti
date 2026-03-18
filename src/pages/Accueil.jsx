const Accueil = () => {
    return (
        <main className="main">

            <section className="accueil" aria-label="Page d'accueil Kheti">

                {/* ── Bandeau de dates (mobile uniquement) ── */}
                <div className="accueil-dates-banner" aria-label="Dates de l'exposition">
                    DU 20 JUIN AU 20 JUILLET - PARIS -
                </div>

                {/* ── Contenu héro ── */}
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

                    {/* BD égyptiennes — desktop/tablette uniquement */}
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

                    {/* Scroll CTA — desktop/tablette uniquement */}
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


            <img src="/public/images/separator.svg" alt="" className="hr-separator-1" />


            <section className="expo-desc">
                <div className="expo-desc__content">
                    <h2 className="expo-desc__title">
                        L'Égypte sous les traits du 9e Art
                    </h2>
                    <p className="expo-desc__text">
                        <span>
                            Dans la langue des bâtisseurs de pyramides, “Kheti” est le mot qui s'approche le plus de ce que nous appelons aujourd'hui la bande dessinée.
                        </span>
                        <span>
                            Depuis près d'un siècle, les mystères du sable et des tombeaux nourrissent l'imaginaire des plus grands dessinateurs.
                            Du Mystère de la Grande Pyramide d'Edgar P. Jacobs aux parodies cultes d'Astérix, embarquez pour un voyage chronologique et visuel.
                        </span>
                        <span>
                            Laissez-vous porter par le courant et observez l'évolution d'un mythe de papier.
                        </span>
                    </p>
                </div>
                <img src="/public/images/egypte-bird-expo-desc.png" alt="egypte bird illustration" className="expo-desc__bird" />
            </section>

            <img src="/public/images/separator.svg" alt="" className="hr-separator-2" />

            <section className="pres-bd">
                <div className="pres-bd__carrousel">
                    <button className="pres-bd__carrousel-btn carrousel-btn__prev"></button>
                    <div></div>
                    <button></button>
                </div>
            </section>
        </main>
    );
}

export default Accueil;