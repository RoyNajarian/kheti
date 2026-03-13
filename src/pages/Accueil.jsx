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

                </div>
            </section>
        </>
    );
}

export default Accueil;