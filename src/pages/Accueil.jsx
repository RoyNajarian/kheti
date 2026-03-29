import { useState, useEffect, useRef } from 'react';
import Boat3D from '../components/Boat3D';

const accueilBdCarrousel = [
    {
        id: 1,
        title: "Les cigares du pharaon",
        année: "1934",
        catchphrase: "L'Égypte comme décor mystérieux (décors clichés)",
        content: "<span>Dans Les Cigares du Pharaon, Hergé représente l'Égypte comme un lieu mystérieux et exotique.<br>Inspiré par la découverte du tombeau de Toutânkhamon en 1922, l'album montre une Égypte remplie de pyramides, de tombes et de momies.</span><span>L'architecture et les tombeaux servent surtout de décor d'aventure, avec des passages secrets et des lieux cachés liés à des sociétés secrètes, comme lorsque Tintin explore le tombeau de Kih-Oskh entouré de rangées de momies.</span>",
        image: "/public/images/carrousel-cover-tintin.png",
        bgImage: "/public/images/carrousel-bg-tintin.jpg",
    },
    {
        id: 2,
        title: "Le Mystère de la Grande Pyramide",
        année: "1954",
        catchphrase: "L'Égypte fantastique et le mythe de la malédiction",
        content: "<span>Dans Le Mystère de la Grande Pyramide de Edgar P. Jacobs, l'Égypte est représentée de manière très réaliste, avec des vues détaillées du Caire, du plateau de Gizeh, du Sphinx et des pyramides.</span><span>L'architecture y apparaît comme sacrée et monumentale, opposant la ville moderne au silence des pyramides, qui sont présentées comme des lieux anciens chargés de mystère et de spiritualité, notamment avec la « Chambre d'Horus ».</span>",
        image: "/public/images/carrousel-cover-BeM.png",
        bgImage: "/public/images/carrousel-bg-BeM.webp",
    },
    {
        id: 3,
        title: "Astérix et Cléopâtre",
        année: "1965",
        catchphrase: "L'Égypte parodique et festive",
        content: "<span>Dans Astérix et Cléopâtre de René Goscinny et Albert Uderzo, qui se déroule en 48 av. J.-C., l'Égypte est représentée à travers ses monuments emblématiques, comme les palais, les pyramides et le Sphinx.</span><span>Les bâtiments sont dessinés de manière spectaculaire et colorée, montrant une Égypte grandiose et monumentale, tout en mettant en scène les constructions et les chantiers pour créer des situations comiques.</span>",
        image: "/public/images/carrousel-cover-asterix.png",
        bgImage: "/public/images/carrousel-bg-asterix.jpeg",
    },
    {
        id: 4,
        title: "Papyrus",
        année: "1974",
        catchphrase: "L'Égypte comme théâtre politique grandiose",
        content: "<span>Dans Papyrus de Lucien De Gieter, qui se déroule dans l'Égypte antique des pharaons, l'Égypte est représentée comme un univers mythologique inspiré des croyances de l'Égypte antique.</span><span>Les dieux à têtes d'animaux, les créatures fantastiques et la magie y sont omniprésents, ce qui présente l'Égypte comme un monde de légendes où les divinités interviennent directement auprès des humains.</span>",
        image: "/public/images/carrousel-cover-horus.png",
        bgImage: "/public/images/carrousel-bg-horus.webp",
    },
    {
        id: 5,
        title: "Le Prince du Nil",
        année: "1974",
        catchphrase: "L'Égypte comme centre de pouvoir et de complots",
        content: "<span>Dans Le Prince du Nil de Jacques Martin, qui se déroule à l'époque ptolémaïque vers 51 av. J.-C., l'Égypte est représentée comme un royaume riche et puissant, marqué par le luxe des palais, des bijoux et des costumes.</span><span>Le pays apparaît aussi comme un centre de pouvoir et de complots autour du trône des pharaons.</span>",
        image: "/public/images/carrousel-cover-prince_du_nil.png",
        bgImage: "/public/images/carrousel-bg-prince_du_nil.jpg",
    },
    {
        id: 6,
        title: "Indiana Jones",
        année: "2001",
        catchphrase: "L'Égypte comme décor d'aventure cinématographique",
        content: "<span>Dans Les Cigares du Pharaon, Hergé représente l'Égypte comme un lieu mystérieux et exotique.<br>Inspiré par la découverte du tombeau de Toutânkhamon en 1922, l'album montre une Égypte remplie de pyramides, de tombes et de momies.</span><span>L'architecture et les tombeaux servent surtout de décor d'aventure, avec des passages secrets et des lieux cachés liés à des sociétés secrètes, comme lorsque Tintin explore le tombeau de Kih-Oskh entouré de rangées de momies.</span>",
        image: "/public/images/carrousel-cover-papyrus.png",
        bgImage: "/public/images/carrousel-bg-indiana_jones.jpg",
    },
];

const Accueil = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [contentVisible, setContentVisible] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const transitionTimer = useRef(null);

    const navigate = (nextIndex) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setContentVisible(false);
        setPrevIndex(activeIndex);

        transitionTimer.current = setTimeout(() => {
            setActiveIndex(nextIndex);
            setContentVisible(true);

            setTimeout(() => {
                setPrevIndex(null);
                setIsTransitioning(false);
            }, 700);
        }, 250);
    };

    useEffect(() => () => clearTimeout(transitionTimer.current), []);

    const handlePrev = () =>
        navigate((activeIndex - 1 + accueilBdCarrousel.length) % accueilBdCarrousel.length);

    const handleNext = () =>
        navigate((activeIndex + 1) % accueilBdCarrousel.length);

    const handleDotClick = (i) => {
        if (i !== activeIndex) navigate(i);
    };

    const active = accueilBdCarrousel[activeIndex];
    const prev = prevIndex !== null ? accueilBdCarrousel[prevIndex] : null;

    const visibleItems = [
        accueilBdCarrousel[(activeIndex - 1 + accueilBdCarrousel.length) % accueilBdCarrousel.length],
        active,
        accueilBdCarrousel[(activeIndex + 1) % accueilBdCarrousel.length],
    ];

    return (
        <>
            <main className="main">

            {/* =============================================
                SECTION HERO
            ============================================= */}
            <section className="accueil" aria-label="Page d'accueil Kheti">

                {/* ── Contenu héro ── */}
                <div className="accueil-content">
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
                            onClick={() => setShowTrailer(true)}
                        >
                            Voir le trailer
                        </button>
                    </div>
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
                        href="#expo-desc"
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

            {/* ── Bandeau de dates ── */}
            <div className="accueil-dates-banner" aria-label="Dates de l'exposition">
                DU 20 JUIN AU 20 JUILLET - PARIS -
            </div>

            {/* ── Separator ── */}
            <img src="/public/images/separator.svg" alt="" className="section-separator__img section-separator__img--first" />

            {/* =============================================
                SECTION EXPO-DESC
            ============================================= */}
            <section className="expo-desc" id="expo-desc">
                <div className="expo-desc__content">
                    <h2 className="expo-desc__title">
                        L'Égypte sous les traits du 9e Art
                    </h2>
                    <p className="expo-desc__text">
                        <span>
                            Dans la langue des bâtisseurs de pyramides, "Kheti" est le mot qui s'approche le plus
                            de ce que nous appelons aujourd'hui la bande dessinée.
                        </span>
                        <span>
                            Depuis près d'un siècle, les mystères du sable et des tombeaux nourrissent l'imaginaire
                            des plus grands dessinateurs. Du Mystère de la Grande Pyramide d'Edgar P. Jacobs aux
                            parodies cultes d'Astérix, embarquez pour un voyage chronologique et visuel.
                        </span>
                        <span>
                            Laissez-vous porter par le courant et observez l'évolution d'un mythe de papier.
                        </span>
                    </p>
                </div>
                <img
                    src="/public/images/egypte-bird-expo-desc.png"
                    alt=""
                    aria-hidden="true"
                    className="expo-desc__bird"
                />
            </section>

            <img src="/public/images/separator.svg" alt="" className="section-separator__img" />


            {/* =============================================
                SECTION PRES-BD — Carrousel
            ============================================= */}
            <section className="pres-bd" aria-label="Présentation des bandes dessinées">

                {/* Fond : couche précédente (sort en fondu) */}
                {prev && (
                    <div
                        className="pres-bd__bg pres-bd__bg--prev"
                        style={{ backgroundImage: `url(${prev.bgImage})` }}
                        aria-hidden="true"
                    />
                )}

                {/* Fond : couche active (entre en fondu) */}
                <div
                    key={activeIndex}
                    className="pres-bd__bg pres-bd__bg--active"
                    style={{ backgroundImage: `url(${active.bgImage})` }}
                    aria-hidden="true"
                />

                {/* Voile sombre */}
                <div className="pres-bd__overlay" aria-hidden="true" />

                <div className="pres-bd__inner">

                    {/* Colonne gauche : navigation + couvertures */}
                    <div className="pres-bd__carrousel" aria-label="Navigation des bandes dessinées">

                        <button
                            className="pres-bd__carrousel-btn carrousel-btn__prev"
                            onClick={handlePrev}
                            aria-label="Bande dessinée précédente"
                        >
                            <svg width="32" height="28" viewBox="0 0 78 69" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M33.7218 3C36.0312 -1 41.8047 -1 44.1141 3L77.0231 60C79.3325 64 76.4457 69 71.8269 69H6.009C1.3902 69 -1.49655 64 0.812851 60L33.7218 3Z" fill="currentColor" />
                            </svg>
                        </button>

                        <ul className="carrousel__select-bd" role="list" aria-label="Couvertures de bandes dessinées">
                            {visibleItems.map((item, pos) => (
                                <li
                                    key={`${item.id}-${pos}`}
                                    className={`carrousel__bd-item ${pos === 1 ? 'carrousel__bd-item--active' : 'carrousel__bd-item--side'}`}
                                    role="listitem"
                                    aria-current={pos === 1 ? 'true' : undefined}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title || 'Couverture de bande dessinée'}
                                        className="carrousel__bd-cover"
                                    />
                                </li>
                            ))}
                        </ul>

                        <button
                            className="pres-bd__carrousel-btn carrousel-btn__next"
                            onClick={handleNext}
                            aria-label="Bande dessinée suivante"
                        >
                            <svg width="32" height="28" viewBox="0 0 78 69" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M44.1141 66C41.8047 70 36.0312 70 33.7218 66L0.812852 9C-1.49655 5 1.3902 0 6.009 0H71.8269C76.4457 0 79.3325 5 77.0231 9L44.1141 66Z" fill="currentColor" />
                            </svg>
                        </button>

                    </div>

                    {/* Colonne droite : contenu de la BD active */}
                    <div
                        className={`pres-bd__content${contentVisible ? ' pres-bd__content--visible' : ' pres-bd__content--hidden'}`}
                        key={active.id}
                    >
                        {active.année && (
                            <span className="pres-bd__year" aria-label={`Année : ${active.année}`}>
                                {active.année}
                            </span>
                        )}
                        {active.catchphrase && (
                            <h3 className="pres-bd__catchphrase">{active.catchphrase}</h3>
                        )}
                        <div
                            className="pres-bd__text"
                            dangerouslySetInnerHTML={{ __html: active.content }}
                        />

                        {/* Indicateur de position */}
                        <div className="pres-bd__dots" aria-label="Progression du carrousel" role="group">
                            {accueilBdCarrousel.map((_, i) => (
                                <button
                                    key={i}
                                    className={`pres-bd__dot${i === activeIndex ? ' pres-bd__dot--active' : ''}`}
                                    onClick={() => handleDotClick(i)}
                                    aria-label={`Aller à la bande dessinée ${i + 1}`}
                                    aria-pressed={i === activeIndex}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Décor Nil avec bateau 3D */}
                <div className="pres-bd__nil" aria-hidden="true">
                    <div className="pres-bd__nil-boat">
                        <Boat3D carouselPosition={activeIndex} />
                    </div>
                    <img src="/public/images/pres-bd_nil.png" alt="" className="pres-bd__nil-img" />
                </div>

            </section>

            <img src="/public/images/separator.svg" alt="" className="section-separator__img" />


            {/* =============================================
                SECTION LABYRINTHE — Mini-jeu
            ============================================= */}
            <section className="labyrinthe" aria-label="Mini-jeu du Labyrinthe">

                {/* Particules de sable */}
                <div className="labyrinthe__particles" aria-hidden="true">
                    {[...Array(18)].map((_, i) => (
                        <span key={i} className={`labyrinthe__particle labyrinthe__particle--${i % 6}`} />
                    ))}
                </div>

                <div className="labyrinthe__inner">

                    {/* Colonne gauche : visuel du labyrinthe */}
                    <div className="labyrinthe__visual" aria-hidden="true">

                        {/* Grille labyrinthe SVG */}
                        <div className="labyrinthe__maze-wrap">
                            <svg
                                className="labyrinthe__maze-svg"
                                viewBox="0 0 200 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Illustration du labyrinthe"
                            >
                                {/* Murs */}
                                <rect x="10" y="10" width="180" height="180" rx="4" stroke="#D5B77B" strokeWidth="2.5" fill="none" opacity="0.6" />
                                {/* Couloirs */}
                                <path d="M10 50 H80 M120 50 H190" stroke="#D5B77B" strokeWidth="2" opacity="0.5" />
                                <path d="M10 90 H60 M100 90 H190" stroke="#D5B77B" strokeWidth="2" opacity="0.5" />
                                <path d="M10 130 H140 M170 130 H190" stroke="#D5B77B" strokeWidth="2" opacity="0.5" />
                                <path d="M50 10 V80 M50 110 V190" stroke="#D5B77B" strokeWidth="2" opacity="0.5" />
                                <path d="M100 10 V40 M100 70 V130 M100 160 V190" stroke="#D5B77B" strokeWidth="2" opacity="0.5" />
                                <path d="M150 10 V60 M150 90 V190" stroke="#D5B77B" strokeWidth="2" opacity="0.5" />
                                {/* Balle animée */}
                                <circle className="maze-ball" cx="20" cy="20" r="5" fill="#F0D49A" />
                                <circle cx="20" cy="20" r="5" fill="#D5B77B" opacity="0.4">
                                    <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                                </circle>
                                {/* pointillés */}
                                <path d="M20 20 H20 V50 H80 V90 H60 V130 H140 V90 H190" stroke="#F0D49A" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.2" />
                            </svg>
                            <div className="labyrinthe__maze-halo" />
                        </div>

                    </div>

                    {/* Colonne droite : texte */}
                    <div className="labyrinthe__content">

                        <div className="labyrinthe__eyebrow">
                            <span className="labyrinthe__eyebrow-line" />
                            <span>Mini-jeu exclusif</span>
                            <span className="labyrinthe__eyebrow-line" />
                        </div>

                        <h2 className="labyrinthe__title">
                            <span className="labyrinthe__title-deco" aria-hidden="true">𓂀</span>
                            Le&nbsp;Labyrinthe
                        </h2>

                        <p className="labyrinthe__desc">
                            Oserez-vous relever le défi ? Testez votre sens de l'orientation et votre logique en
                            guidant une balle jusqu'à la sortie. Mais attention… certains chemins mènent à des
                            impasses ! Prenez le bon tournant, réfléchissez vite et trouvez la sortie le plus
                            rapidement possible.
                            <br /><br />
                            Et ce n'est pas tout ! Les joueurs qui réussiront le défi pourront repartir avec un
                            goodies gratuit. Une bonne raison de tenter votre chance ! Prêt à jouer ? Entrez dans
                            le labyrinthe et voyez si vous avez l'âme d'un véritable explorateur !
                        </p>

                        <a href="/jeu" className="labyrinthe__cta" aria-label="Jouer au labyrinthe">
                            <span className="labyrinthe__cta-bg" aria-hidden="true" />
                            <span className="labyrinthe__cta-text">Entrer dans le labyrinthe</span>
                            <svg className="labyrinthe__cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>

                    </div>
                </div>

                {/* Fond sable bas */}
                <div className="labyrinthe__sand" aria-hidden="true" />

            </section>

            <img src="/public/images/separator.svg" alt="" className="section-separator__img" />

        </main>

        {/* Popup Trailer */}
        {showTrailer && (
            <div className="trailer-popup-overlay" onClick={() => setShowTrailer(false)}>
                <div className="trailer-popup-content" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="trailer-popup-close"
                        onClick={() => setShowTrailer(false)}
                        aria-label="Fermer le trailer"
                        type="button"
                    >
                        ✕
                    </button>
                    <video
                        className="trailer-video"
                        controls
                        autoPlay
                        width="100%"
                        height="auto"
                    >
                        <source src="/public/video/FINAL-TEASER_SFX.mp4" type="video/mp4" />
                        Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                </div>
            </div>
        )}
    </>
    );
};

export default Accueil;