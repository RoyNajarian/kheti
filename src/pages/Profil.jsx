import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import "../styles/Profil.css";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("khetiUser");
      if (!rawUser) return;
      setUser(JSON.parse(rawUser));
    } catch {
      localStorage.removeItem("khetiUser");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("khetiUser");
    localStorage.removeItem("khetiToken");
    setUser(null);
    navigate("/login");
  };

  const isAdmin = Number(user?.admin_state) === 1;

  return (
    <section className="profilePage" aria-label="Page profil utilisateur">
      <div className="profileCard">
        <h1 className="profileTitle">Mon profil</h1>

        {user ? (
          <>
            <p className="profileStatus profileStatus--connected">Vous etes connecte.</p>

            <dl className="profileInfoList">
              <div className="profileInfoRow">
                <dt>Nom</dt>
                <dd>{user.name || "-"}</dd>
              </div>
              <div className="profileInfoRow">
                <dt>Prenom</dt>
                <dd>{user.first_name || "-"}</dd>
              </div>
              <div className="profileInfoRow">
                <dt>E-mail</dt>
                <dd>{user.email || "-"}</dd>
              </div>
              <div className="profileInfoRow">
                <dt>Role</dt>
                <dd>{isAdmin ? "Administrateur" : "Utilisateur"}</dd>
              </div>
            </dl>

            <div className="profileActions">
              {isAdmin && (
                <Link to="/back-office" className="profileBtn profileBtn--admin">
                  Acceder au Back Office
                </Link>
              )}

              <button type="button" className="profileBtn profileBtn--logout" onClick={handleLogout}>
                Se deconnecter
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="profileStatus profileStatus--disconnected">Vous n'etes pas connecte.</p>
            <div className="profileActions">
              <Link to="/login" className="profileBtn">
                Aller a la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Profil;