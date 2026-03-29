import { useState, useEffect, useRef } from "react";
import Boat3D from "../components/Boat3D";
import { useTranslation } from "react-i18next";

const accueilBdCarrousel = [
  {
    id: 1,
    image: "/public/images/carrousel-cover-tintin.png",
    bgImage: "/public/images/carrousel-bg-tintin.jpg",
  },
  {
    id: 2,
    image: "/public/images/carrousel-cover-BeM.png",
    bgImage: "/public/images/carrousel-bg-BeM.webp",
  },
  {
    id: 3,
    image: "/public/images/carrousel-cover-asterix.png",
    bgImage: "/public/images/carrousel-bg-asterix.jpeg",
  },
  {
    id: 4,
    image: "/public/images/carrousel-cover-horus.png",
    bgImage: "/public/images/carrousel-bg-horus.webp",
  },
  {
    id: 5,
    image: "/public/images/carrousel-cover-prince_du_nil.png",
    bgImage: "/public/images/carrousel-bg-prince_du_nil.jpg",
  },
  {
    id: 6,
    image: "/public/images/carrousel-cover-papyrus.png",
    bgImage: "/public/images/carrousel-bg-indiana_jones.jpg",
  },
];

const Accueil = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const transitionTimer = useRef(null);
  const { t } = useTranslation();

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
    navigate(
      (activeIndex - 1 + accueilBdCarrousel.length) % accueilBdCarrousel.length,
    );

  const handleNext = () =>
    navigate((activeIndex + 1) % accueilBdCarrousel.length);

  const handleDotClick = (i) => {
    if (i !== activeIndex) navigate(i);
  };

  const active = accueilBdCarrousel[activeIndex];
  const prev = prevIndex !== null ? accueilBdCarrousel[prevIndex] : null;

  const visibleItems = [
    accueilBdCarrousel[
      (activeIndex - 1 + accueilBdCarrousel.length) % accueilBdCarrousel.length
    ],
    active,
    accueilBdCarrousel[(activeIndex + 1) % accueilBdCarrousel.length],
  ];

  return (
    <main className="main">
      <section className="accueil" aria-label={t("accueil.aria.page")}>
        <div
          className="accueil-dates-banner"
          aria-label={t("accueil.aria.dates_banner")}
        >
          {t("accueil.dates_banner")}
        </div>

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
              aria-label={t("accueil.aria.trailer_btn")}
            >
              {t("accueil.hero.trailer_btn")}
            </button>
          </div>
          <img
            src="/public/images/pharaon.png"
            alt=""
            aria-hidden="true"
            className="accueil-pharaon"
          />

          <div className="accueil-bd" aria-label={t("accueil.aria.bd_section")}>
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

          <a
            href="#suite"
            className="accueil-scroll-action"
            aria-label={t("accueil.aria.scroll_cta")}
          >
            <span className="accueil-scroll-action__label">
              {t("accueil.hero.scroll_label")}
            </span>
            <svg
              width="18"
              height="38"
              viewBox="0 0 65 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M44.976 89C44.976 89.5523 44.5282 90 43.976 90H20.976C20.4237 90 19.976 89.5523 19.976 89V1C19.976 0.447718 20.4237 0 20.976 0H43.976C44.5282 0 44.976 0.447715 44.976 1V89Z"
                fill="white"
              />
              <path d="M32.476 130L64.9519 77.5H0L32.476 130Z" fill="white" />
            </svg>
          </a>
        </div>
      </section>
      <img
        src="/public/images/separator.svg"
        alt=""
        className="section-separator__img"
      />

      <section className="expo-desc">
        <div className="expo-desc__content">
          <h2 className="expo-desc__title">{t("accueil.expo_desc.title")}</h2>
          <p className="expo-desc__text">
            <span>{t("accueil.expo_desc.p1")}</span>
            <span>{t("accueil.expo_desc.p2")}</span>
            <span>{t("accueil.expo_desc.p3")}</span>
          </p>
        </div>
        <img
          src="/public/images/egypte-bird-expo-desc.png"
          alt=""
          aria-hidden="true"
          className="expo-desc__bird"
        />
      </section>

      <img
        src="/public/images/separator.svg"
        alt=""
        className="section-separator__img"
      />

      <section className="pres-bd" aria-label={t("accueil.aria.bd_section")}>
        {prev && (
          <div
            className="pres-bd__bg pres-bd__bg--prev"
            style={{ backgroundImage: `url(${prev.bgImage})` }}
            aria-hidden="true"
          />
        )}

        <div
          key={activeIndex}
          className="pres-bd__bg pres-bd__bg--active"
          style={{ backgroundImage: `url(${active.bgImage})` }}
          aria-hidden="true"
        />

        <div className="pres-bd__overlay" aria-hidden="true" />

        <div className="pres-bd__inner">
          <div
            className="pres-bd__carrousel"
            aria-label={t("accueil.aria.carrousel_nav")}
          >
            <button
              className="pres-bd__carrousel-btn carrousel-btn__prev"
              onClick={handlePrev}
              aria-label={t("accueil.carrousel.prev_btn")}
            >
              <svg
                width="32"
                height="28"
                viewBox="0 0 78 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M33.7218 3C36.0312 -1 41.8047 -1 44.1141 3L77.0231 60C79.3325 64 76.4457 69 71.8269 69H6.009C1.3902 69 -1.49655 64 0.812851 60L33.7218 3Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <ul
              className="carrousel__select-bd"
              role="list"
              aria-label={t("accueil.aria.covers_list")}
            >
              {visibleItems.map((item, pos) => (
                <li
                  key={`${item.id}-${pos}`}
                  className={`carrousel__bd-item ${pos === 1 ? "carrousel__bd-item--active" : "carrousel__bd-item--side"}`}
                  role="listitem"
                  aria-current={pos === 1 ? "true" : undefined}
                >
                  <img
                    src={item.image}
                    alt={t(
                      `accueil.carrousel.items.${accueilBdCarrousel.indexOf(item)}.title`,
                    )}
                    className="carrousel__bd-cover"
                  />
                </li>
              ))}
            </ul>

            <button
              className="pres-bd__carrousel-btn carrousel-btn__next"
              onClick={handleNext}
              aria-label={t("accueil.carrousel.next_btn")}
            >
              <svg
                width="32"
                height="28"
                viewBox="0 0 78 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M44.1141 66C41.8047 70 36.0312 70 33.7218 66L0.812852 9C-1.49655 5 1.3902 0 6.009 0H71.8269C76.4457 0 79.3325 5 77.0231 9L44.1141 66Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div
            className={`pres-bd__content${contentVisible ? " pres-bd__content--visible" : " pres-bd__content--hidden"}`}
            key={active.id}
          >
            {t(`accueil.carrousel.items.${activeIndex}.année`) && (
              <span
                className="pres-bd__year"
                aria-label={t("accueil.aria.year_label", {
                  year: t(`accueil.carrousel.items.${activeIndex}.année`),
                })}
              >
                {t(`accueil.carrousel.items.${activeIndex}.année`)}
              </span>
            )}
            {t(`accueil.carrousel.items.${activeIndex}.catchphrase`) && (
              <h3 className="pres-bd__catchphrase">
                {t(`accueil.carrousel.items.${activeIndex}.catchphrase`)}
              </h3>
            )}
            <div className="pres-bd__text">
              <span>
                {t(`accueil.carrousel.items.${activeIndex}.content_1`)}
              </span>
              <span>
                {t(`accueil.carrousel.items.${activeIndex}.content_2`)}
              </span>
            </div>

            <div
              className="pres-bd__dots"
              aria-label={t("accueil.aria.carrousel_progress")}
              role="group"
            >
              {accueilBdCarrousel.map((_, i) => (
                <button
                  key={i}
                  className={`pres-bd__dot${i === activeIndex ? " pres-bd__dot--active" : ""}`}
                  onClick={() => handleDotClick(i)}
                  aria-label={t("accueil.carrousel.dot_label", {
                    number: i + 1,
                  })}
                  aria-pressed={i === activeIndex}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pres-bd__nil" aria-hidden="true">
          <div className="pres-bd__nil-boat">
            <Boat3D carouselPosition={activeIndex} />
          </div>
          <img
            src="/public/images/pres-bd_nil.png"
            alt=""
            className="pres-bd__nil-img"
          />
        </div>
      </section>

      <img
        src="/public/images/separator.svg"
        alt=""
        className="section-separator__img"
      />

      <section
        className="labyrinthe"
        aria-label={t("accueil.aria.minigame_section")}
      >
        <div className="labyrinthe__particles" aria-hidden="true">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className={`labyrinthe__particle labyrinthe__particle--${i % 6}`}
            />
          ))}
        </div>

        <div
          className="labyrinthe__col labyrinthe__col--left"
          aria-hidden="true"
        />
        <div
          className="labyrinthe__col labyrinthe__col--right"
          aria-hidden="true"
        />

        <div className="labyrinthe__inner">
          <div className="labyrinthe__visual" aria-hidden="true">
            <div className="labyrinthe__torch labyrinthe__torch--tl">
              <span className="torch__flame" />
              <span className="torch__glow" />
            </div>
            <div className="labyrinthe__torch labyrinthe__torch--tr">
              <span className="torch__flame" />
              <span className="torch__glow" />
            </div>

            <div className="labyrinthe__maze-wrap">
              <svg
                className="labyrinthe__maze-svg"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label={t("accueil.aria.maze_illustration")}
              >
                <rect
                  x="10"
                  y="10"
                  width="180"
                  height="180"
                  rx="4"
                  stroke="#D5B77B"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M10 50 H80 M120 50 H190"
                  stroke="#D5B77B"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M10 90 H60 M100 90 H190"
                  stroke="#D5B77B"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M10 130 H140 M170 130 H190"
                  stroke="#D5B77B"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M50 10 V80 M50 110 V190"
                  stroke="#D5B77B"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M100 10 V40 M100 70 V130 M100 160 V190"
                  stroke="#D5B77B"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M150 10 V60 M150 90 V190"
                  stroke="#D5B77B"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <circle
                  className="maze-ball"
                  cx="20"
                  cy="20"
                  r="5"
                  fill="#F0D49A"
                />
                <circle cx="20" cy="20" r="5" fill="#D5B77B" opacity="0.4">
                  <animate
                    attributeName="r"
                    values="5;9;5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <path
                  d="M20 20 H20 V50 H80 V90 H60 V130 H140 V90 H190"
                  stroke="#F0D49A"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.2"
                />
              </svg>
              <div className="labyrinthe__maze-halo" />
            </div>
          </div>

          <div className="labyrinthe__content">
            <div className="labyrinthe__eyebrow">
              <span className="labyrinthe__eyebrow-line" />
              <span>{t("accueil.labyrinthe.eyebrow")}</span>
              <span className="labyrinthe__eyebrow-line" />
            </div>

            <h2 className="labyrinthe__title">
              <span className="labyrinthe__title-deco" aria-hidden="true">
                𓂀
              </span>
              {t("accueil.labyrinthe.title")}
            </h2>

            <p className="labyrinthe__desc">
              {t("accueil.labyrinthe.desc_1")}
              <br />
              <br />
              {t("accueil.labyrinthe.desc_2")}
            </p>

            <a
              href="/jeu"
              className="labyrinthe__cta"
              aria-label={t("accueil.aria.labyrinthe_cta")}
            >
              <span className="labyrinthe__cta-bg" aria-hidden="true" />
              <span className="labyrinthe__cta-text">
                {t("accueil.labyrinthe.cta")}
              </span>
              <svg
                className="labyrinthe__cta-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="labyrinthe__sand" aria-hidden="true" />
      </section>

      <img
        src="/public/images/separator.svg"
        alt=""
        className="section-separator__img"
      />
    </main>
  );
};

export default Accueil;
