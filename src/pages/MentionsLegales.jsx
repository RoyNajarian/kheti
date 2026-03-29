import { useEffect } from "react";
import "../styles/MentionsLegales.css";
import { useTranslation } from "react-i18next";

const TEAM_MEMBERS = {
    dev: [
        { name: "Aurélie Sirot", url: "https://www.linkedin.com/in/aurelie-sirot/" },
        { name: "Victor Le Claire", url: "https://www.linkedin.com/in/victor-le-claire-95a5872ba/" },
        { name: "Roy Najarian", url: "https://www.linkedin.com/in/roynajarian/" },
    ],
    creation: [
        { name: "Marie Pitre", url: "https://www.linkedin.com/in/marie-pitre/" },
        { name: "Ian Robinson", url: "https://www.linkedin.com/in/ian-robinson-b03842350/" },
        { name: "Eddy Rajemison", url: "https://www.linkedin.com/in/eddy-rajemison/" },
        { name: "Enzo Geri-Tanguy", url: "https://www.linkedin.com/in/enzo-geri-tanguy-4aa69b330/" },
    ],
};

const MentionsLegales = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const editorList = t('mentions_legales.editor.list', { returnObjects: true });
    const hostingList = t('mentions_legales.hosting.list', { returnObjects: true });
    const dpoList = t('mentions_legales.dpo.list', { returnObjects: true });
    const cookiesList = t('mentions_legales.cookies.list', { returnObjects: true });
    const creditsList = t('mentions_legales.credits.list', { returnObjects: true });

    return (
        <main className="legal-page" aria-labelledby="legal-title">
            <section className="legal-shell">
                <h1 id="legal-title" className="legal-title">{t('mentions_legales.title')}</h1>
                <p className="legal-intro">{t('mentions_legales.intro')}</p>

                {/* Éditeur du site */}
                <section className="legal-block" aria-labelledby="editor-title">
                    <h2 id="editor-title">{t('mentions_legales.editor.title')}</h2>
                    <p>{t('mentions_legales.editor.p1')}</p>
                    <ul>
                        {editorList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p>{t('mentions_legales.editor.director')}</p>
                </section>

                {/* Équipe de réalisation */}
                <section className="legal-block" aria-labelledby="team-title">
                    <h2 id="team-title">{t('mentions_legales.team.title')}</h2>
                    <p>{t('mentions_legales.team.p1')}</p>

                    <h3 style={{ marginTop: "1rem", color: "#f5ddaa", fontSize: "1.1rem" }}>
                        {t('mentions_legales.team.dev_title')}
                    </h3>
                    <ul>
                        {TEAM_MEMBERS.dev.map((member) => (
                            <li key={member.name}>
                                <a href={member.url} target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                                    {member.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <h3 style={{ marginTop: "1rem", color: "#f5ddaa", fontSize: "1.1rem" }}>
                        {t('mentions_legales.team.creation_title')}
                    </h3>
                    <ul>
                        {TEAM_MEMBERS.creation.map((member) => (
                            <li key={member.name}>
                                <a href={member.url} target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                                    {member.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Hébergement */}
                <section className="legal-block" aria-labelledby="hosting-title">
                    <h2 id="hosting-title">{t('mentions_legales.hosting.title')}</h2>
                    <p>{t('mentions_legales.hosting.p1')}</p>
                    <ul>
                        {hostingList.map((item, i) => <li key={i}>{item}</li>)}
                        <li>
                            {t('mentions_legales.hosting.website_label', 'Site web')}{' '}
                            <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f5ddaa", textDecoration: "none" }}>
                                www.ovhcloud.com
                            </a>
                        </li>
                    </ul>
                </section>

                {/* Protection des données */}
                <section className="legal-block" aria-labelledby="privacy-title">
                    <h2 id="privacy-title">{t('mentions_legales.privacy.title')}</h2>
                    <p>{t('mentions_legales.privacy.p1')}</p>
                    <p>{t('mentions_legales.privacy.p2')}</p>
                </section>

                {/* DPO */}
                <section className="legal-block" aria-labelledby="dpo-title">
                    <h2 id="dpo-title">{t('mentions_legales.dpo.title')}</h2>
                    <p>{t('mentions_legales.dpo.p1')}</p>
                    <ul>
                        {dpoList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p>{t('mentions_legales.dpo.p2')}</p>
                </section>

                {/* Cookies */}
                <section className="legal-block" aria-labelledby="cookies-title">
                    <h2 id="cookies-title">{t('mentions_legales.cookies.title')}</h2>
                    <p>{t('mentions_legales.cookies.p1')}</p>
                    <ul>
                        {cookiesList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p>{t('mentions_legales.cookies.p2')}</p>
                </section>

                {/* Crédits */}
                <section className="legal-block" aria-labelledby="credits-title">
                    <h2 id="credits-title">{t('mentions_legales.credits.title')}</h2>
                    <p>{t('mentions_legales.credits.p1')}</p>
                    <ul>
                        {creditsList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </section>

                <p className="legal-updated">{t('mentions_legales.updated')}</p>
            </section>
        </main>
    );
};

export default MentionsLegales;