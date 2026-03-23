import { useEffect, useMemo, useState } from "react";
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

  const reservationRows = useMemo(
    () =>
      reservations.map((r) => {
        const adult = Number(r.adult_count || 0);
        const child = Number(r.child_count || 0);
        const student = Number(r.student_count || 0);
        const people =
          r.number_of_people ??
          adult + child + student;

        return {
          ...r,
          email: String(r.email || r.user?.email || "").trim().toLowerCase(),
          adult,
          child,
          student,
          people,
        };
      }),
    [reservations],
  );

  const ticketTotals = useMemo(
    () =>
      reservationRows.reduce(
        (acc, row) => {
          acc.adult += row.adult;
          acc.child += row.child;
          acc.student += row.student;
          return acc;
        },
        { adult: 0, child: 0, student: 0 },
      ),
    [reservationRows],
  );

  const totalPeopleReserved = useMemo(
    () => reservationRows.reduce((acc, row) => acc + row.people, 0),
    [reservationRows],
  );

  const totalTicketsReserved =
    ticketTotals.adult + ticketTotals.child + ticketTotals.student;

  const maxTicketValue = Math.max(ticketTotals.adult, ticketTotals.child, ticketTotals.student, 1);

  const mostReservedTicket = useMemo(() => {
    const items = [
      { key: "adult", label: "Adulte", value: ticketTotals.adult },
      { key: "student", label: "Etudiant", value: ticketTotals.student },
      { key: "child", label: "Enfant", value: ticketTotals.child },
    ];

    return items.sort((a, b) => b.value - a.value)[0];
  }, [ticketTotals.adult, ticketTotals.child, ticketTotals.student]);

  const registeredEmails = useMemo(
    () =>
      new Set(
        users
          .map((u) => String(u.email || "").trim().toLowerCase())
          .filter(Boolean),
      ),
    [users],
  );

  const accountStats = useMemo(() => {
    const withAccountReservations = reservationRows.filter(
      (row) => row.email && registeredEmails.has(row.email),
    ).length;
    const withoutAccountReservations = reservationRows.length - withAccountReservations;

    const uniqueWithoutAccount = new Set(
      reservationRows
        .filter((row) => row.email && !registeredEmails.has(row.email))
        .map((row) => row.email),
    ).size;

    return {
      withAccountReservations,
      withoutAccountReservations,
      uniqueWithoutAccount,
    };
  }, [reservationRows, registeredEmails]);

  const accountSplitMax = Math.max(
    accountStats.withAccountReservations,
    accountStats.withoutAccountReservations,
    1,
  );

  const perPersonStats = useMemo(() => {
    const byEmail = new Map();

    reservationRows.forEach((row) => {
      const key = row.email || "inconnu";
      const existing = byEmail.get(key) || {
        email: key,
        reservations: 0,
        adult: 0,
        child: 0,
        student: 0,
        totalTickets: 0,
      };

      existing.reservations += 1;
      existing.adult += row.adult;
      existing.child += row.child;
      existing.student += row.student;
      existing.totalTickets += row.adult + row.child + row.student;
      byEmail.set(key, existing);
    });

    return Array.from(byEmail.values()).sort((a, b) => b.totalTickets - a.totalTickets);
  }, [reservationRows]);

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
                <div className="bo-stat-value">{totalPeopleReserved}</div>
              </div>
              <div className="bo-stat-card">
                <h3>Billet le plus réservé</h3>
                <div className="bo-stat-value">{mostReservedTicket.label}</div>
                <span className="bo-stat-subvalue">{mostReservedTicket.value} billet(s)</span>
              </div>
              <div className="bo-stat-card">
                <h3>Réservations sans compte</h3>
                <div className="bo-stat-value">{accountStats.withoutAccountReservations}</div>
              </div>
            </div>

            <h2 className="bo-section-title">Statistiques et graphiques</h2>
            <div className="bo-insights-grid">
              <section className="bo-chart-card" aria-label="Répartition des billets par type">
                <h3>Répartition des billets</h3>
                <p className="bo-chart-meta">Total billets : {totalTicketsReserved}</p>
                <div className="bo-bars">
                  <div className="bo-bar-row">
                    <div className="bo-bar-head">
                      <span>Adulte</span>
                      <strong>{ticketTotals.adult}</strong>
                    </div>
                    <div className="bo-bar-track">
                      <div
                        className="bo-bar-fill bo-bar-fill--adult"
                        style={{ width: `${(ticketTotals.adult / maxTicketValue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="bo-bar-row">
                    <div className="bo-bar-head">
                      <span>Etudiant</span>
                      <strong>{ticketTotals.student}</strong>
                    </div>
                    <div className="bo-bar-track">
                      <div
                        className="bo-bar-fill bo-bar-fill--student"
                        style={{ width: `${(ticketTotals.student / maxTicketValue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="bo-bar-row">
                    <div className="bo-bar-head">
                      <span>Enfant</span>
                      <strong>{ticketTotals.child}</strong>
                    </div>
                    <div className="bo-bar-track">
                      <div
                        className="bo-bar-fill bo-bar-fill--child"
                        style={{ width: `${(ticketTotals.child / maxTicketValue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bo-chart-card" aria-label="Réservations avec et sans compte">
                <h3>Avec compte vs sans compte</h3>
                <p className="bo-chart-meta">Basé sur l'email de réservation</p>
                <div className="bo-bars">
                  <div className="bo-bar-row">
                    <div className="bo-bar-head">
                      <span>Avec compte</span>
                      <strong>{accountStats.withAccountReservations}</strong>
                    </div>
                    <div className="bo-bar-track">
                      <div
                        className="bo-bar-fill bo-bar-fill--account"
                        style={{ width: `${(accountStats.withAccountReservations / accountSplitMax) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="bo-bar-row">
                    <div className="bo-bar-head">
                      <span>Sans compte</span>
                      <strong>{accountStats.withoutAccountReservations}</strong>
                    </div>
                    <div className="bo-bar-track">
                      <div
                        className="bo-bar-fill bo-bar-fill--guest"
                        style={{ width: `${(accountStats.withoutAccountReservations / accountSplitMax) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <h2 className="bo-section-title">Billets par personne</h2>
            <div className="bo-table-wrapper">
              <table className="bo-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Réservations</th>
                    <th>Adultes</th>
                    <th>Etudiants</th>
                    <th>Enfants</th>
                    <th>Total billets</th>
                  </tr>
                </thead>
                <tbody>
                  {perPersonStats.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="bo-empty-cell">
                        Aucune donnée disponible
                      </td>
                    </tr>
                  ) : (
                    perPersonStats.map((row) => (
                      <tr key={row.email}>
                        <td>{row.email === "inconnu" ? "Email indisponible" : row.email}</td>
                        <td>{row.reservations}</td>
                        <td>{row.adult}</td>
                        <td>{row.student}</td>
                        <td>{row.child}</td>
                        <td>{row.totalTickets}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                      <td>{r.user?.name ? `${r.user.name} ${r.user?.first_name || ""}` : (r.email || "—")}</td>
                      <td>{r.day || <span className="bo-muted">—</span>}</td>
                      <td>{r.hour}</td>
                      <td>{r.number_of_people ?? ((r.adult_count || 0) + (r.child_count || 0) + (r.student_count || 0))}</td>
                      <td>{r.price}<span> €</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/back-office/reservations" className="bo-link-inline">
              Voir toutes les réservations →
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
