import { NavLink, Outlet, Link } from "react-router";
import "./BackOffice.css";

const BackOfficeLayout = () => {
  return (
    <div className="bo-wrapper">
      <aside className="bo-sidebar">
        <div className="bo-sidebar-logo">
          <h2>Kheti</h2>
          <span>Administration</span>
        </div>
        <ul className="bo-nav">
          <li>
            <NavLink to="/back-office" end>
              <span className="bo-icon">📊</span> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/back-office/reservations">
              <span className="bo-icon">📅</span> Réservations
            </NavLink>
          </li>
          <li>
            <NavLink to="/back-office/users">
              <span className="bo-icon">👥</span> Utilisateurs
            </NavLink>
          </li>
        </ul>
        <div className="bo-sidebar-footer">
          <Link to="/">← Retour au site</Link>
        </div>
      </aside>

      <main className="bo-main">
        <Outlet />
      </main>
    </div>
  );
};

export default BackOfficeLayout;
