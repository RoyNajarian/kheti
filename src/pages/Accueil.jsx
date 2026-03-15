const Accueil = () => {
    return (
        <>
            <section className="accueil">
                <div className="accueil__top-buttons">
                    <button className="accueil__top-button" >Réserver</button>
                    <button className="accueil__top-button" >Connexion</button>
                    <button className="accueil__top-button">
                        <a href="/register">Labyrinth</a>
                    </button>
                </div>
                <div className="accueil-content" >
                    <div className="accueil-main" >
                        <img src="/public/images/kheti-logo.png" alt="Kheto Logo" />
                        <button className="accueil-trailer-btn" >Voir le trailer</button>
                    </div>

                    <img src="/public/images/pharaon.png" alt="Pharaon" className="accueil-pharaon" />
                    <div className="accueil-bd">
                        <img src="/public/images/b&m_le-mystere-de-le-grande-pyramide.png" alt="B&M" />
                        <img src="/public/images/tintin_les-cigares-du-pharaon.png" alt="Tintin" />
                        <img src="/public/images/asterix-et-cleopatre.png" alt="Asterix" />
                    </div>
                    <a className="accueil-scroll-action">
                        <span>Voir plus</span>
                        <svg width="18" height="38" viewBox="0 0 65 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44.976 89C44.976 89.5523 44.5282 90 43.976 90H20.976C20.4237 90 19.976 89.5523 19.976 89V1C19.976 0.447718 20.4237 0 20.976 0H43.976C44.5282 0 44.976 0.447715 44.976 1V89Z" fill="white" />
                            <path d="M32.476 130L64.9519 77.5H0L32.476 130Z" fill="white" />
                        </svg>
                    </a>
                </div>

            </section>
        </>
    );
}

export default Accueil;