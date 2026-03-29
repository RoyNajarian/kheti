import { useEffect } from "react";
import "../styles/MentionsLegales.css";

const MentionsLegales = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <main className="legal-page" aria-labelledby="legal-title">
      <section className="legal-shell">
        <h1 id="legal-title" className="legal-title">Mentions légales</h1>
        <p className="legal-intro">
          Les présentes mentions légales sont fournies dans le cadre du projet pédagogique Kheti.
          Elles décrivent les informations d'édition, d'hébergement et de traitement des données
          personnelles liées à l'utilisation du site.
        </p>

        <section className="legal-block" aria-labelledby="editor-title">
          <h2 id="editor-title">Éditeur du site</h2>
          <p>
            Le site Kheti est édité dans le cadre d'un projet étudiant du BUT MMI
            (Métiers du Multimédia et de l'Internet) de l'Université Gustave Eiffel.
          </p>
          <ul>
            <li>Université Gustave Eiffel</li>
            <li>5 Boulevard Descartes, 77420 Champs-sur-Marne, France</li>
            <li>Téléphone : +33 01 60 95 75 00</li>
            <li>Email : webmaster@univ-eiffel.fr</li>
            <li>SIREN : 130 026 123</li>
            <li>Code APE : 85.42Z</li>
          </ul>
          <p>
            Directeur de la publication : Gilles Roussel, président de l'Université Gustave Eiffel.
          </p>
        </section>

        <section className="legal-block" aria-labelledby="team-title">
          <h2 id="team-title">Équipe de réalisation</h2>
          <p>
            Le projet Kheti a été conçu et développé par une équipe étudiante BUT MMI.
          </p>

          <h3 style={{ marginTop: "1rem", color: "#f5ddaa", fontSize: "1.1rem" }}>Développement</h3>
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/aurelie-sirot/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Aurélie Sirot
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/victor-le-claire-95a5872ba/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Victor Le Claire
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/roynajarian/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Roy Najarian
              </a>
            </li>
          </ul>

          <h3 style={{ marginTop: "1rem", color: "#f5ddaa", fontSize: "1.1rem" }}>Création</h3>
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/marie-pitre/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Marie Pitre
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/ian-robinson-b03842350/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Ian Robinson
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/eddy-rajemison/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Eddy Rajemison
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/enzo-geri-tanguy-4aa69b330/" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                Enzo Geri-Tanguy
              </a>
            </li>
          </ul>
        </section>

        <section className="legal-block" aria-labelledby="hosting-title">
          <h2 id="hosting-title">Hébergement</h2>
          <p>Le site est hébergé par OVH SAS.</p>
          <ul>
            <li>2 rue Kellermann, 59100 Roubaix, France</li>
            <li>Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>www.ovhcloud.com</a></li>
          </ul>
        </section>

        <section className="legal-block" aria-labelledby="privacy-title">
          <h2 id="privacy-title">Protection des données personnelles (RGPD)</h2>
          <p>
            Dans le cadre de l'utilisation du site Kheti, des données personnelles peuvent être
            collectées (nom, prénom, email, informations de réservation). Ces données sont
            utilisées exclusivement pour le fonctionnement du service (gestion du compte,
            réservation).
          </p>
          <p>
            Ces données ne sont ni vendues ni transmises à des tiers à des fins commerciales.
          </p>
        </section>

        <section className="legal-block" aria-labelledby="dpo-title">
          <h2 id="dpo-title">Responsable de la protection des données (DPO)</h2>
          <p>
            Pour toute question relative au traitement de vos données :
          </p>
          <ul>
            <li>DPO : Véronique Juge</li>
            <li>Adresse : 5 Boulevard Descartes, 77420 Champs-sur-Marne</li>
            <li>Email : protectiondesdonnees-dpo@univ-eiffel.fr</li>
            <li>Email Université : vjuge@univ-gustave-eiffel.fr</li>
          </ul>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
            suppression de vos données via votre espace profil ou en nous contactant.
          </p>
        </section>

        <section className="legal-block" aria-labelledby="cookies-title">
          <h2 id="cookies-title">Cookies</h2>
          <p>
            Le site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement.
          </p>
          <ul>
            <li>Gestion de la session utilisateur et de la connexion.</li>
            <li>Conservation de certaines préférences d'affichage.</li>
          </ul>
          <p>Aucun cookie publicitaire ou de profilage n'est déposé.</p>
        </section>

        <section className="legal-block" aria-labelledby="credits-title">
          <h2 id="credits-title">Crédits et propriété intellectuelle</h2>
          <p>Ce site est un projet pédagogique à but non lucratif.</p>
          <ul>
            <li>
              Les contenus textuels, visuels, logos et éléments graphiques originaux du projet Kheti
              sont protégés par le droit d'auteur.
            </li>
            <li>
              Toute reproduction, distribution ou réutilisation sans autorisation écrite préalable est
              interdite, sauf exceptions légales.
            </li>
            <li>
              Les noms, marques et logos de tiers mentionnés sur le site restent la propriété de leurs
              titulaires respectifs et sont utilisés uniquement à titre informatif et pédagogique.
            </li>
          </ul>
        </section>

        <p className="legal-updated">Dernière mise à jour : 29 mars 2026</p>
      </section>
    </main>
  );
};

export default MentionsLegales;
