import React, { useMemo, useState } from "react";

const ReservationStep1 = ({
  date,
  setDate,
  time,
  setTime,
  quantities,
  handleQuantity,
  onNext,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const source = date ? new Date(`${date}T00:00:00`) : today;
    return new Date(source.getFullYear(), source.getMonth(), 1);
  });

  const ticketTypes = [
    {
      id: "explorateur",
      name: "L'Explorateur",
      description: "Adulte",
      price: 20,
      icon: "/icons/explorateur.png",
    },
    {
      id: "scribe",
      name: "Le Scribe",
      description: "Étudiant (justificatif requis)",
      price: 10,
      icon: "/icons/scribe.png",
    },
    {
      id: "scarabee",
      name: "Petit Scarabée",
      description: "Enfant (moins de 12 ans)",
      price: 7,
      icon: "/icons/scarabee.png",
    },
  ];

  const totalTickets =
    quantities.explorateur + quantities.scribe + quantities.scarabee;
  const isValid = date && time && totalTickets > 0;

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth]
  );

  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const cells = [];

    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(year, month, day));
    }

    return cells;
  }, [currentMonth]);

  const toISODate = (value) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const selectedDate = date ? new Date(`${date}T00:00:00`) : null;
  const minSelectable = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const changeMonth = (delta) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
  };

  return (
    <div className="reservation-step-1">
      <h2 className="step-title">Étape 1 : Sélectionnez votre visite</h2>

      {/* Section Date et Heure */}
      <div className="step-section">
        <h3 className="section-subtitle">Quand souhaitez-vous visiter ?</h3>
        <div className="date-time-container">
          <div className="form-group calendar-block">
            <label htmlFor="visit-date">
              Date <span className="required">*</span>
            </label>

            <div className="calendar-widget" aria-label="Calendrier de réservation">
              <div className="calendar-header">
                <button
                  type="button"
                  className="calendar-nav-btn"
                  onClick={() => changeMonth(-1)}
                  aria-label="Mois précédent"
                >
                  ←
                </button>
                <span className="calendar-month">{monthLabel}</span>
                <button
                  type="button"
                  className="calendar-nav-btn"
                  onClick={() => changeMonth(1)}
                  aria-label="Mois suivant"
                >
                  →
                </button>
              </div>

              <div className="calendar-weekdays" aria-hidden="true">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarCells.map((day, index) => {
                  if (!day) {
                    return <span key={`empty-${index}`} className="calendar-empty" />;
                  }

                  const isPast = day < minSelectable;
                  const isActive = isSameDay(day, selectedDate);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      className={`calendar-day ${isActive ? "active" : ""}`}
                      disabled={isPast}
                      onClick={() => setDate(toISODate(day))}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Créneau <span className="required">*</span></label>
            <div className="time-slots">
              {["10:00", "12:00", "14:00", "16:00"].map((t) => (
                <button
                  key={t}
                  className={`time-slot ${time === t ? "selected" : ""}`}
                  onClick={() => setTime(t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Billets */}
      <div className="step-section">
        <h3 className="section-subtitle">Sélectionnez vos billets</h3>
        <div className="tickets-grid">
          {ticketTypes.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-main">
                <img
                  className="ticket-icon"
                  src={ticket.icon}
                  alt=""
                  aria-hidden="true"
                />
                <div className="ticket-header">
                  <h4 className="ticket-name">{ticket.name.toUpperCase()}</h4>
                  <p className="ticket-description">{ticket.description}</p>
                  <p className="ticket-includes-title">Inclus :</p>
                  <ul className="ticket-includes-list">
                    <li>Pass exposition Kheti</li>
                    <li>Carte de l&apos;aventurier</li>
                  </ul>
                </div>
              </div>

              <div className="ticket-bottom-row">
                <div className="ticket-price">{ticket.price}€</div>
                <div className="ticket-quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantity(ticket.id, -1)}
                    disabled={quantities[ticket.id] === 0}
                    type="button"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={quantities[ticket.id]}
                    onChange={(e) => {
                      const newVal = Math.max(0, parseInt(e.target.value, 10) || 0);
                      handleQuantity(ticket.id, newVal - quantities[ticket.id]);
                    }}
                    readOnly
                  />
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantity(ticket.id, 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Suivant */}
      <div className="step-actions">
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!isValid}
        >
          Continuer vers le panier
        </button>
      </div>
    </div>
  );
};

export default ReservationStep1;
