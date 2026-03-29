import "../styles/NousEcouter.css";

const PODCASTS = [
  {
    id: "podcast-1",
    title: "Plongée dans le mystère de Kih-Oskh",
    file: "/audios/FARACAST-kih_oskh.mp3",
    image: "/images/photos-tintin.png",
    imageAlt: "Illustration Tintin",
    layout: "left",
  },
  {
    id: "podcast-2",
    title: "Rookie vs Experts",
    file: "/audios/FARACAST-rookie_vs_experts.mp3",
    image: "/images/blakeetmortimer_personnages.png",
    imageAlt: "Illustration Blake et Mortimer",
    layout: "right",
  },
];

const NousEcouter = () => {
  return (
    <main className="podcasts-page" aria-labelledby="podcasts-title">
      <div className="podcasts-backdrop" aria-hidden="true" />
      <section className="podcasts-shell">
        <h1 id="podcasts-title" className="podcasts-title">Nous écouter</h1>
        <p className="podcasts-intro">
          Découvrez nos deux épisodes FaraCast autour de l'univers Kheti.
        </p>

        <div className="podcasts-grid">
          {PODCASTS.map((podcast) => (
            <article
              key={podcast.id}
              className={`podcast-scene podcast-scene--${podcast.layout}`}
              aria-label={podcast.title}
            >
              <img src={podcast.image} alt={podcast.imageAlt} className="podcast-character" />

              <div className="podcast-bubble">
                <h2>{podcast.title}</h2>
                <audio controls preload="none" className="podcast-player">
                  <source src={podcast.file} type="audio/mpeg" />
                  Votre navigateur ne supporte pas la lecture audio.
                </audio>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default NousEcouter;
