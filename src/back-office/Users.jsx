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
        <div className="bo-toolbar">
          <input
            type="text"
            placeholder="Rechercher par nom ou email…"
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
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="bo-empty-cell">
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
