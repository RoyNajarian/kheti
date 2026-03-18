import { useEffect, useState } from "react";
import { getReservations } from "./api";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getReservations()
      .then(setReservations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reservations.filter((r) => {
    const q = search.toLowerCase();
    return (
      String(r.id).includes(q) ||
      (r.user?.name || "").toLowerCase().includes(q) ||
      (r.user?.first_name || "").toLowerCase().includes(q) ||
      (r.user?.email || "").toLowerCase().includes(q) ||
      (r.day || "").includes(q)
    );
  });

  return (
    <>
      <div className="bo-topbar">
        <h1>Réservations</h1>
        <span className="bo-topbar-meta">{reservations.length} réservation(s) au total</span>
      </div>
      <div className="bo-content">
        <div className="bo-toolbar">
          <input
            type="text"
            placeholder="Rechercher par nom, email, date…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bo-search-input"
          />
        </div>

        {loading && <p className="bo-loading">Chargement…</p>}
        {error && <p className="bo-error">Erreur : {error}</p>}

        {!loading && !error && (
          <div className="bo-table-wrapper">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Personnes</th>
                  <th>Prix</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="bo-empty-cell">
                      Aucune réservation trouvée
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>
                        {r.user?.name} {r.user?.first_name}
                      </td>
                      <td>{r.user?.email}</td>
                      <td>{r.day || <span className="bo-muted">Non définie</span>}</td>
                      <td>{r.hour}</td>
                      <td>{r.number_of_people}</td>
                      <td>{r.price}<span> €</span></td>
                      <td>
                        <span className={r.user?.admin_state ? "bo-badge bo-badge-admin" : "bo-badge bo-badge-user"}>
                          {r.user?.admin_state ? "Admin" : "User"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Reservations;
