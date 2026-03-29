import "../styles/NousEcouter.css";
import { useTranslation } from "react-i18next";

const PODCASTS_META = [
    {
        id: "podcast-1",
        file: "/audios/FARACAST-kih_oskh.mp3",
        image: "/images/photos-tintin.png",
        layout: "left",
    },
    {
        id: "podcast-2",
        file: "/audios/FARACAST-rookie_vs_experts.mp3",
        image: "/images/blakeetmortimer_personnages.png",
        layout: "right",
    },
];

const NousEcouter = () => {
    const { t } = useTranslation();

    const podcasts = t('nous_ecouter.podcasts', { returnObjects: true });

    return (
        <main className="podcasts-page" aria-labelledby="podcasts-title">
            <div className="podcasts-backdrop" aria-hidden="true" />
            <section className="podcasts-shell">
                <h1 id="podcasts-title" className="podcasts-title">{t('nous_ecouter.title')}</h1>
                <p className="podcasts-intro">{t('nous_ecouter.intro')}</p>

                <div className="podcasts-grid">
                    {PODCASTS_META.map((meta, index) => {
                        const podcast = podcasts[index];
                        return (
                            <article
                                key={meta.id}
                                className={`podcast-scene podcast-scene--${meta.layout}`}
                                aria-label={podcast.title}
                            >
                                <img
                                    src={meta.image}
                                    alt={podcast.image_alt}
                                    className="podcast-character"
                                />
                                <div className="podcast-bubble">
                                    <h2>{podcast.title}</h2>
                                    <audio controls preload="none" className="podcast-player">
                                        <source src={meta.file} type="audio/mpeg" />
                                        {t('nous_ecouter.audio_unsupported')}
                                    </audio>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
};

export default NousEcouter;