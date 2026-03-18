import { NavLink, Outlet, Link } from "react-router";
import "./BackOffice.css";

const BackOfficeLayout = () => {
  return (
    <div className="bo-wrapper">
      <aside className="bo-sidebar">
        <div className="bo-sidebar-logo">
          <Link to="/" className="bo-brand" aria-label="Retour a l'accueil Kheti">
            <img src="/images/kheti-logo.png" alt="Kheti" className="bo-brand-logo" />
          </Link>
          <h2>Back Office</h2>
          <span>Administration du temple</span>
        </div>
        <ul className="bo-nav">
          <li>
            <NavLink to="/back-office" end>
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink to="/back-office/reservations">
              Réservations
            </NavLink>
          </li>
          <li>
            <NavLink to="/back-office/users">
              Utilisateurs
            </NavLink>
          </li>
        </ul>
        <div className="bo-sidebar-footer">
          <Link to="/">Retour au site</Link>
        </div>
      </aside>

      <main className="bo-main">
        <Outlet />
      </main>
    </div>
  );
};

export default BackOfficeLayout;
