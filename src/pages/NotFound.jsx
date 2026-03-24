import { Link } from "react-router";
import "../styles/NotFound.css";

const NotFound = () => {
    return (
        <main className="notfound" aria-labelledby="notfound-title">
            <div className="notfound__overlay" aria-hidden="true" />

            <section className="notfound__card">
                <p className="notfound__code">404</p>
                <h1 id="notfound-title" className="notfound__title">
                    Oups, cette page n'existe pas
                </h1>
                <p className="notfound__text">
                    Le chemin que vous avez saisi est introuvable. Revenez a l'accueil pour continuer
                    l'expérience Kheti.
                </p>

                <div className="notfound__actions">
                    <Link to="/" className="notfound__button notfound__button--primary">
                        Retour à l'accueil
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default NotFound;
