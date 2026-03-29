import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Breadcrumb from "../components/Breadcrumb";
import { RESERVATION_TICKETS } from "../components/reservationTickets";
import { getAvailableSlots } from "../back-office/api";
import "../styles/Reservation.css";

const RESERVATION_DRAFT_KEY = "khetiReservationDraft";

const TWO_STEP_BREADCRUMB = [
  { number: 1, label: "Votre réservation" },
  { number: 2, label: "Récap et validation" },
];

const toISODate = (value) => {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("khetiUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getInitialDraft = () => {
  const user = getStoredUser();

  try {
    const raw = sessionStorage.getItem(RESERVATION_DRAFT_KEY);
    const draft = raw ? JSON.parse(raw) : null;

    return {
      date: String(draft?.date || ""),
      time: String(draft?.time || ""),
      firstName: String(draft?.firstName || user?.first_name || "").trim(),
      lastName: String(draft?.lastName || user?.name || "").trim(),
      email: String(draft?.email || user?.email || "").trim(),
      quantities: {
        explorateur: Number(draft?.quantities?.explorateur || 0),
        scribe: Number(draft?.quantities?.scribe || 0),
        scarabee: Number(draft?.quantities?.scarabee || 0),
      },
    };
  } catch {
    return {
      date: "",
      time: "",
      firstName: String(user?.first_name || "").trim(),
      lastName: String(user?.name || "").trim(),
      email: String(user?.email || "").trim(),
      quantities: {
        explorateur: 0,
        scribe: 0,
        scarabee: 0,
      },
    };
  }
};

const Reservation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialDraft);
  const [inlineError, setInlineError] = useState("");
  const [slotAvailability, setSlotAvailability] = useState({});
  const [currentMonth, setCurrentMonth] = useState(() => {
    const source = formData.date ? new Date(`${formData.date}T00:00:00`) : new Date();
    return new Date(source.getFullYear(), source.getMonth(), 1);
  });

  useEffect(() => {
    getAvailableSlots()
      .then((data) => {
        console.log("📍 Disponibilités chargées pour la date:", {
          date: formData.date,
          availability: data,
        });
        setSlotAvailability(data);
      })
      .catch((err) => {
        console.warn("⚠️ Erreur chargement disponibilités:", err);
        // Silently fail - les slots seront affichés sans restriction
      });
  }, [formData.date]);

  const exhibitionStart = useMemo(() => {
    const year = new Date().getFullYear();
    return new Date(year, 5, 20);
  }, []);

  const exhibitionEnd = useMemo(() => {
    const year = new Date().getFullYear();
    return new Date(year, 6, 20);
  }, []);

  const minSelectable = useMemo(() => {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return normalizedToday > exhibitionStart ? normalizedToday : exhibitionStart;
  }, [exhibitionStart]);

  const maxSelectable = useMemo(() => exhibitionEnd, [exhibitionEnd]);

  const minMonthStart = useMemo(
    () => new Date(minSelectable.getFullYear(), minSelectable.getMonth(), 1),
    [minSelectable]
  );

  const maxMonthStart = useMemo(
    () => new Date(maxSelectable.getFullYear(), maxSelectable.getMonth(), 1),
    [maxSelectable]
  );

  useEffect(() => {
    if (!formData.date) return;

    const picked = new Date(`${formData.date}T00:00:00`);
    if (picked < minSelectable || picked > maxSelectable) {
      setFormData((prev) => ({ ...prev, date: "", time: "" }));
    }
  }, [formData.date, minSelectable, maxSelectable]);

  useEffect(() => {
    setCurrentMonth((prev) => {
      const monthStart = new Date(prev.getFullYear(), prev.getMonth(), 1);
      if (monthStart < minMonthStart) return minMonthStart;
      if (monthStart > maxMonthStart) return maxMonthStart;
      return monthStart;
    });
  }, [minMonthStart, maxMonthStart]);

  const getAvailableSpots = (slot) => {
    const key = `${formData.date}_${slot}`;
    return 10 - (slotAvailability[key] || 0);
  };

  const isSlotFull = (slot) => getAvailableSpots(slot) <= 0;

  const cartItems = useMemo(
    () =>
      RESERVATION_TICKETS.filter((ticket) => formData.quantities[ticket.id] > 0).map((ticket) => ({
        ...ticket,
        quantity: formData.quantities[ticket.id],
        subtotal: formData.quantities[ticket.id] * ticket.price,
      })),
    [formData.quantities]
  );

  const totalTickets = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  const remainingSeatsForSelectedSlot = useMemo(() => {
    if (!formData.date || !formData.time) return null;
    return Math.max(0, getAvailableSpots(formData.time));
  }, [formData.date, formData.time, slotAvailability]);

  const isAtSelectedSlotLimit =
    remainingSeatsForSelectedSlot !== null && totalTickets >= remainingSeatsForSelectedSlot;

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

  const selectedDate = formData.date ? new Date(`${formData.date}T00:00:00`) : null;

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const handleQuantity = (type, delta) => {
    setFormData((prev) => {
      const currentTotal = Object.values(prev.quantities).reduce((sum, qty) => sum + qty, 0);

      if (delta > 0) {
        if (!prev.date || !prev.time) {
          setInlineError("Choisissez une date et un créneau avant d'ajouter des billets.");
          return prev;
        }

        const key = `${prev.date}_${prev.time}`;
        const remainingSeats = Math.max(0, 10 - (slotAvailability[key] || 0));

        if (currentTotal >= remainingSeats) {
          setInlineError(
            remainingSeats > 0
              ? `Limite atteinte: il reste ${remainingSeats} place${remainingSeats > 1 ? "s" : ""} pour ce créneau.`
              : "Ce créneau est complet."
          );
          return prev;
        }
      }

      setInlineError("");
      return {
        ...prev,
        quantities: {
          ...prev.quantities,
          [type]: Math.max(0, prev.quantities[type] + delta),
        },
      };
    });
  };

  const handleContinue = () => {
    const payload = {
      ...formData,
      firstName: String(formData.firstName || "").trim(),
      lastName: String(formData.lastName || "").trim(),
      email: String(formData.email || "").trim().toLowerCase(),
    };

    if (!payload.date || !payload.time) {
      setInlineError("Choisissez une date et un créneau.");
      return;
    }

    if (totalTickets <= 0) {
      setInlineError("Ajoutez au moins un billet à votre panier.");
      return;
    }

    if (remainingSeatsForSelectedSlot !== null && totalTickets > remainingSeatsForSelectedSlot) {
      setInlineError(
        `Trop de billets pour ce créneau: ${remainingSeatsForSelectedSlot} place${
          remainingSeatsForSelectedSlot > 1 ? "s" : ""
        } disponible${remainingSeatsForSelectedSlot > 1 ? "s" : ""}.`
      );
      return;
    }

    if (!payload.firstName || !payload.lastName || !payload.email) {
      setInlineError("Renseignez nom, prénom et email.");
      return;
    }

    if (!isEmailValid(payload.email)) {
      setInlineError("Adresse email invalide. Exemple: nom@domaine.com");
      return;
    }

    sessionStorage.setItem(RESERVATION_DRAFT_KEY, JSON.stringify(payload));
    navigate("/reservation/recap");
  };

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const changeMonth = (delta) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      if (next < minMonthStart) return minMonthStart;
      if (next > maxMonthStart) return maxMonthStart;
      return next;
    });
  };

  const canGoPrevMonth = currentMonth > minMonthStart;
  const canGoNextMonth = currentMonth < maxMonthStart;

  const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00"];

  return (
    <div className="reservation-container">
      <div className="reservation-backdrop" aria-hidden="true" />
      <Breadcrumb currentStep={1} steps={TWO_STEP_BREADCRUMB} />

      <div className="reservation-wrapper">
        <h1 className="reservation-main-title">Billetterie du temple</h1>

        <div className="booking-layout">
          <section className="booking-main" aria-label="Configuration de la visite">
            <div className="booking-panel">
              <h2 className="step-title">Date et créneau</h2>
              <div className="booking-grid-two">
                <div className="form-group">
                  <label>
                    Date <span className="required">*</span>
                  </label>
                  <div className="calendar-widget" aria-label="Calendrier de réservation">
                    <div className="calendar-header">
                      <button
                        type="button"
                        className="calendar-nav-btn"
                        onClick={() => changeMonth(-1)}
                        aria-label="Mois précédent"
                        disabled={!canGoPrevMonth}
                      >
                        ←
                      </button>
                      <span className="calendar-month">{monthLabel}</span>
                      <button
                        type="button"
                        className="calendar-nav-btn"
                        onClick={() => changeMonth(1)}
                        aria-label="Mois suivant"
                        disabled={!canGoNextMonth}
                      >
                        →
                      </button>
                    </div>

                    <div className="calendar-weekdays" aria-hidden="true">
                      {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                        <span key={`${day}-${index}`}>{day}</span>
                      ))}
                    </div>

                    <div className="calendar-grid">
                      {calendarCells.map((day, index) => {
                        if (!day) {
                          return <span key={`empty-${index}`} className="calendar-empty" />;
                        }

                        const isOutOfRange = day < minSelectable || day > maxSelectable;
                        const isActive = isSameDay(day, selectedDate);

                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            className={`calendar-day ${isActive ? "active" : ""}`}
                            disabled={isOutOfRange}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, date: toISODate(day) }))
                            }
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Créneau <span className="required">*</span>
                  </label>
                  <div className="time-slots">
                    {timeSlots.map((slot) => {
                      const available = getAvailableSpots(slot);
                      const isFull = isSlotFull(slot);

                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`time-slot ${formData.time === slot ? "selected" : ""} ${
                            isFull ? "full" : ""
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                          disabled={isFull}
                        >
                          <div>{slot}</div>
                          <div className={isFull ? "full-indicator" : "available-indicator"}>
                            {isFull ? "Complet" : `${available} place${available > 1 ? "s" : ""}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-panel">
              <h2 className="step-title">Choix des billets</h2>
              <div className="ticket-lines">
                {RESERVATION_TICKETS.map((ticket) => (
                  <article className="ticket-line" key={ticket.id}>
                    <div className="ticket-line-main">
                      <img src={ticket.icon} alt="" aria-hidden="true" className="ticket-line-icon" />
                      <div>
                        <h3 className="ticket-line-name">{ticket.name}</h3>
                        <p className="ticket-line-description">{ticket.description}</p>
                      </div>
                    </div>

                    <div className="ticket-line-end">
                      <strong className="ticket-line-price">{ticket.price} €</strong>
                      <div className="ticket-quantity-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleQuantity(ticket.id, -1)}
                          disabled={formData.quantities[ticket.id] === 0}
                          aria-label={`Retirer un billet ${ticket.name}`}
                        >
                          -
                        </button>
                        <input
                          id={`qty-${ticket.id}`}
                          type="number"
                          min="0"
                          readOnly
                          value={formData.quantities[ticket.id]}
                          aria-label={`Quantité de billets ${ticket.name}`}
                          title={`Quantité de billets ${ticket.name}`}
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleQuantity(ticket.id, 1)}
                          disabled={isAtSelectedSlotLimit}
                          aria-label={`Ajouter un billet ${ticket.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="booking-panel">
              <h2 className="step-title">Coordonnées</h2>
              <p className="booking-login-hint">
                Vous avez deja un compte ? <Link to="/login">Se connecter</Link>
              </p>

              <div className="booking-grid-two">
                <div className="form-group">
                  <label htmlFor="lastName">
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    id="lastName"
                    className="input-text"
                    type="text"
                    value={formData.lastName}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, lastName: event.target.value }))
                    }
                    placeholder="Ex: Dupont"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="firstName">
                    Prénom <span className="required">*</span>
                  </label>
                  <input
                    id="firstName"
                    className="input-text"
                    type="text"
                    value={formData.firstName}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, firstName: event.target.value }))
                    }
                    placeholder="Ex: Leila"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  className="input-text"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="nom@domaine.com"
                />
              </div>
            </div>
          </section>

          <aside className="booking-cart" aria-label="Panier sticky">
            <h2 className="booking-cart-title">Votre panier</h2>
            <p className="booking-cart-meta">{totalTickets} billet(s)</p>

            <div className="booking-cart-lines">
              {cartItems.length === 0 ? (
                <p className="booking-cart-empty">Aucun billet sélectionné pour le moment.</p>
              ) : (
                cartItems.map((item) => (
                  <div className="booking-cart-line" key={item.id}>
                    <span>{item.name} x{item.quantity}</span>
                    <strong>{item.subtotal} €</strong>
                  </div>
                ))
              )}
            </div>

            <div className="booking-cart-total">
              <span>Total</span>
              <strong>{totalPrice} €</strong>
            </div>

            <button className="btn btn-primary booking-cart-cta" type="button" onClick={handleContinue}>
              Continuer vers le récapitulatif
            </button>

            {inlineError && <p className="info-message error">{inlineError}</p>}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Reservation;

