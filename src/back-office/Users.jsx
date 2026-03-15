import { useEffect, useState } from "react";
import { getUsers } from "./api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.first_name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="bo-topbar">
        <h1>Utilisateurs</h1>
        <span className="bo-topbar-meta">{users.length} utilisateur(s) au total</span>
      </div>
      <div className="bo-content">
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#555770" }}>
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.first_name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={u.admin_state ? "bo-badge bo-badge-admin" : "bo-badge bo-badge-user"}>
                          {u.admin_state ? "Administrateur" : "Utilisateur"}
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

export default Users;
