import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getReservations, getUsers } from "./api";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getReservations(), getUsers()])
      .then(([res, usr]) => {
        setReservations(res);
        setUsers(usr);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="bo-topbar">
        <h1>Dashboard</h1>
        <span className="bo-topbar-meta">Vue d'ensemble</span>
      </div>
      <div className="bo-content">
        {loading && <p className="bo-loading">Chargement…</p>}
        {error && <p className="bo-error">Erreur : {error}</p>}

        {!loading && !error && (
          <>
            <div className="bo-stats">
              <div className="bo-stat-card">
                <h3>Réservations</h3>
                <div className="bo-stat-value">{reservations.length}</div>
              </div>
              <div className="bo-stat-card">
                <h3>Utilisateurs</h3>
                <div className="bo-stat-value">{users.length}</div>
              </div>
              <div className="bo-stat-card">
                <h3>Personnes réservées</h3>
                <div className="bo-stat-value">
                  {reservations.reduce((acc, r) => acc + (r.number_of_people || 0), 0)}
                </div>
              </div>
            </div>

            <h2 className="bo-section-title">Dernières réservations</h2>
            <div className="bo-table-wrapper">
              <table className="bo-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Personnes</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.user?.name} {r.user?.first_name}</td>
                      <td>{r.day || <span style={{ color: "#555770" }}>—</span>}</td>
                      <td>{r.hour}</td>
                      <td>{r.number_of_people}</td>
                      <td>{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/back-office/reservations" style={{ color: "#c89b3c", fontSize: "0.88rem" }}>
              Voir toutes les réservations →
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
