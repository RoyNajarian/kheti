import { useEffect, useState } from "react";
import { getReservations } from "./api";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Logging de l'utilisateur courant
  useEffect(() => {
    const user = localStorage.getItem("khetiUser");
    const token = localStorage.getItem("khetiToken");
    console.log("👤 Utilisateur connecté au back-office:", {
      user: user ? JSON.parse(user) : null,
      token: token ? "✅ Présent" : "❌ Absent",
    });
  }, []);

  useEffect(() => {
    getReservations()
      .then((data) => {
        const sortedData = [...(data || [])].sort(
          (a, b) => Number(b?.id || 0) - Number(a?.id || 0)
        );

        console.log("📦 Réservations reçues du back-office:", {
          count: sortedData?.length,
          firstItem: sortedData?.[0],
          allData: sortedData,
        });
        setReservations(sortedData);
      })
      .catch((err) => {
        console.error("❌ Erreur chargement réservations:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = reservations.filter((r) => {
    const q = search.toLowerCase();
    return (
      String(r.id).includes(q) ||
      (r.user?.name || "").toLowerCase().includes(q) ||
      (r.user?.first_name || "").toLowerCase().includes(q) ||
      (r.name || "").toLowerCase().includes(q) ||
      (r.first_name || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
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
                  filtered.map((r) => {
                    const clientName = 
                      r.user?.name ? `${r.user.name} ${r.user?.first_name || ""}`.trim() 
                      : (r.name || r.first_name) ? `${r.name || ""} ${r.first_name || ""}`.trim()
                      : "—";
                    
                    const clientEmail = r.email || r.user?.email || "—";
                    
                    return (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{clientName}</td>
                        <td>{clientEmail}</td>
                        <td>{r.day || <span className="bo-muted">Non définie</span>}</td>
                        <td>{r.hour}</td>
                        <td>{r.number_of_people ?? ((r.adult_count || 0) + (r.child_count || 0) + (r.student_count || 0))}</td>
                        <td>{r.price}<span> €</span></td>
                        <td>
                          <span className={r.user?.admin_state ? "bo-badge bo-badge-admin" : "bo-badge bo-badge-user"}>
                            {r.user?.admin_state ? "Admin" : "User"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
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
