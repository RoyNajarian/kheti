import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="page-footer" role="contentinfo" aria-label={t('footer.aria.footer')}>

            <div className="footer-inner">
                <div className="footer-infos" aria-label={t('footer.aria.infos')}>

                    <div className="footer-infos__top">
                        <a href="/" aria-label={t('footer.aria.logo')}>
                            <img
                                src="/public/images/kheti-logo.png"
                                alt={t('footer.aria.logo_alt')}
                                className="footer-logo"
                            />
                        </a>

                        <nav className="footer-nav" aria-label={t('footer.aria.nav')}>
                            <Link
                                to="/mentions-legales"
                                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                            >
                                {t('footer.nav.legal')}
                            </Link>
                            <Link to="/nous-ecouter">{t('footer.nav.listen')}</Link>
                        </nav>
                    </div>

                    <div className="footer-infos__bottom">
                        <p className="footer-social-label">{t('footer.social.label')}</p>
                        <ul className="footer-socials" role="list" aria-label={t('footer.aria.socials')}>
                            <li>
                                <a
                                    href="https://www.instagram.com/faravision.agency/"
                                    className="footer-social-link"
                                    aria-label={t('footer.aria.instagram')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/public/images/instagram.svg" alt="" aria-hidden="true" className="socials-logo" />
                                    <span className="footer-social-name">Instagram</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.tiktok.com/@faravision"
                                    className="footer-social-link"
                                    aria-label={t('footer.aria.tiktok')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/public/images/tiktok.svg" alt="" aria-hidden="true" className="socials-logo" />
                                    <span className="footer-social-name">TikTok</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <p className="footer-copyright">
                        <small>{t('footer.copyright', { year: new Date().getFullYear() })}</small>
                    </p>
                </div>

        <div className="footer-location" aria-label={t("footer.aria.location")}>
          <p className="footer-location-text">
            <span aria-hidden="true" className="footer-location-icon">
              𓇳
            </span>
            {t("footer.location.text")}
          </p>
          <a
            href="https://maps.google.com/?q=Kheti+Paris"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("footer.aria.map_link")}
            className="footer-location__map-link"
          >
            <img
              src="/public/images/footer-location-map.png"
              alt={t("footer.aria.map_alt")}
              className="footer-location__map"
              width="300"
              height="300"
            />
            <span className="footer-location__cta" aria-hidden="true">
              {t("footer.location.map_cta")}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

