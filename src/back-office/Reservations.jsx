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
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Rechercher par nom, email, date…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bo-search-input"
            style={{
              background: "#161925",
              border: "1px solid #2a2d3e",
              borderRadius: "6px",
              padding: "9px 14px",
              color: "#e0e0e0",
              fontSize: "0.88rem",
              width: "300px",
              outline: "none",
            }}
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
                    <td colSpan={8} style={{ textAlign: "center", color: "#555770" }}>
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
                      <td>{r.day || <span style={{ color: "#555770" }}>Non définie</span>}</td>
                      <td>{r.hour}</td>
                      <td>{r.number_of_people}</td>
                      <td>{r.price}</td>
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
