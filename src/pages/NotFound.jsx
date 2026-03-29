import { Link } from "react-router";
import "../styles/NotFound.css";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <main className="notfound" aria-labelledby="notfound-title">
      <div className="notfound__overlay" aria-hidden="true" />
      <section className="notfound__card">
        <p className="notfound__code">404</p>
        <h1 id="notfound-title" className="notfound__title">
          {t("not_found.title")}
        </h1>
        <p className="notfound__text">{t("not_found.text")}</p>
        <div className="notfound__actions">
          <Link to="/" className="notfound__button notfound__button--primary">
            {t("not_found.back_btn")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
