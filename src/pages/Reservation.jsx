import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Breadcrumb from "../components/Breadcrumb";
import { RESERVATION_TICKETS } from "../components/reservationTickets";
import { getAvailableSlots } from "../back-office/api";
import "../styles/Reservation.css";
import { useTranslation } from "react-i18next";

const RESERVATION_DRAFT_KEY = "khetiReservationDraft";
const MAZE_GOODIES_CODE = "KHETI-MAZE-26";

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
      mazeCode: String(draft?.mazeCode || "").trim(),
      mazeCodeValidated: Boolean(draft?.mazeCodeValidated),
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
      mazeCode: "",
      mazeCodeValidated: false,
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
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState(getInitialDraft);
  const [inlineError, setInlineError] = useState("");
  const [slotAvailability, setSlotAvailability] = useState({});
  const [currentMonth, setCurrentMonth] = useState(() => {
    const source = formData.date
      ? new Date(`${formData.date}T00:00:00`)
      : new Date();
    return new Date(source.getFullYear(), source.getMonth(), 1);
  });

  // Breadcrumb steps built from translations
  const TWO_STEP_BREADCRUMB = useMemo(
    () => [
      { number: 1, label: t("reservation.breadcrumb.step1") },
      { number: 2, label: t("reservation.breadcrumb.step2") },
    ],
    [t],
  );

  useEffect(() => {
    getAvailableSlots()
      .then((data) => {
        setSlotAvailability(data);
      })
      .catch(() => {});
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
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return normalizedToday > exhibitionStart
      ? normalizedToday
      : exhibitionStart;
  }, [exhibitionStart]);

  const maxSelectable = useMemo(() => exhibitionEnd, [exhibitionEnd]);

  const minMonthStart = useMemo(
    () => new Date(minSelectable.getFullYear(), minSelectable.getMonth(), 1),
    [minSelectable],
  );

  const maxMonthStart = useMemo(
    () => new Date(maxSelectable.getFullYear(), maxSelectable.getMonth(), 1),
    [maxSelectable],
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
      RESERVATION_TICKETS.filter(
        (ticket) => formData.quantities[ticket.id] > 0,
      ).map((ticket) => ({
        ...ticket,
        quantity: formData.quantities[ticket.id],
        subtotal: formData.quantities[ticket.id] * ticket.price,
      })),
    [formData.quantities],
  );

  const totalTickets = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems],
  );

  const remainingSeatsForSelectedSlot = useMemo(() => {
    if (!formData.date || !formData.time) return null;
    return Math.max(0, getAvailableSpots(formData.time));
  }, [formData.date, formData.time, slotAvailability]);

  const isAtSelectedSlotLimit =
    remainingSeatsForSelectedSlot !== null &&
    totalTickets >= remainingSeatsForSelectedSlot;

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString(
        i18n.language?.startsWith("fr") ? "fr-FR" : "en-GB",
        {
          month: "long",
          year: "numeric",
        },
      ),
    [currentMonth, i18n.language],
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

  const selectedDate = formData.date
    ? new Date(`${formData.date}T00:00:00`)
    : null;

  const isEmailValid = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  const normalizedMazeCode = String(formData.mazeCode || "")
    .trim()
    .toUpperCase();
  const hasMazeCode = normalizedMazeCode.length > 0;
  const isMazeCodeValid =
    normalizedMazeCode === MAZE_GOODIES_CODE &&
    Boolean(formData.mazeCodeValidated);

  const handleValidateMazeCode = () => {
    const isValid = normalizedMazeCode === MAZE_GOODIES_CODE;
    if (!isValid) {
      setInlineError(t("reservation.errors.invalid_code"));
    } else {
      setInlineError("");
    }
    setFormData((prev) => ({ ...prev, mazeCodeValidated: isValid }));
  };

  const handleQuantity = (type, delta) => {
    setFormData((prev) => {
      const currentTotal = Object.values(prev.quantities).reduce(
        (sum, qty) => sum + qty,
        0,
      );

      if (delta > 0) {
        if (!prev.date || !prev.time) {
          setInlineError(t("reservation.errors.pick_date_slot_before_ticket"));
          return prev;
        }

        const key = `${prev.date}_${prev.time}`;
        const remainingSeats = Math.max(0, 10 - (slotAvailability[key] || 0));

        if (currentTotal >= remainingSeats) {
          setInlineError(
            remainingSeats > 0
              ? t("reservation.errors.slot_limit_reached", {
                  count: remainingSeats,
                })
              : t("reservation.errors.slot_full"),
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
      email: String(formData.email || "")
        .trim()
        .toLowerCase(),
      mazeCode: String(formData.mazeCode || "").trim(),
      mazeCodeValidated: Boolean(formData.mazeCodeValidated),
    };

    if (!payload.date || !payload.time) {
      setInlineError(t("reservation.errors.pick_date_slot"));
      return;
    }

    if (totalTickets <= 0) {
      setInlineError(t("reservation.errors.add_ticket"));
      return;
    }

    if (
      remainingSeatsForSelectedSlot !== null &&
      totalTickets > remainingSeatsForSelectedSlot
    ) {
      setInlineError(
        t("reservation.errors.too_many_tickets", {
          count: remainingSeatsForSelectedSlot,
        }),
      );
      return;
    }

    if (!payload.firstName || !payload.lastName || !payload.email) {
      setInlineError(t("reservation.errors.fill_contact"));
      return;
    }

    if (!isEmailValid(payload.email)) {
      setInlineError(t("reservation.errors.invalid_email"));
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

  const weekdays = t("reservation.date_slot.weekdays", { returnObjects: true });

  return (
    <div className="reservation-container">
      <div className="reservation-backdrop" aria-hidden="true" />
      <Breadcrumb currentStep={1} steps={TWO_STEP_BREADCRUMB} />

      <div className="reservation-wrapper">
        <h1 className="reservation-main-title">{t("reservation.title")}</h1>

        <div className="booking-layout">
          <section
            className="booking-main"
            aria-label={t("reservation.aria.main_section")}
          >
            <div className="booking-panel">
              <h2 className="step-title">
                {t("reservation.date_slot.section_title")}
              </h2>
              <div className="booking-grid-two">
                <div className="form-group">
                  <label>
                    {t("reservation.date_slot.date_label")}{" "}
                    <span className="required">
                      {t("reservation.date_slot.required")}
                    </span>
                  </label>
                  <div
                    className="calendar-widget"
                    aria-label={t("reservation.aria.calendar")}
                  >
                    <div className="calendar-header">
                      <button
                        type="button"
                        className="calendar-nav-btn"
                        onClick={() => changeMonth(-1)}
                        aria-label={t("reservation.date_slot.prev_month")}
                        disabled={!canGoPrevMonth}
                      >
                        ←
                      </button>
                      <span className="calendar-month">{monthLabel}</span>
                      <button
                        type="button"
                        className="calendar-nav-btn"
                        onClick={() => changeMonth(1)}
                        aria-label={t("reservation.date_slot.next_month")}
                        disabled={!canGoNextMonth}
                      >
                        →
                      </button>
                    </div>

                    <div className="calendar-weekdays" aria-hidden="true">
                      {weekdays.map((day, index) => (
                        <span key={`${day}-${index}`}>{day}</span>
                      ))}
                    </div>

                    <div className="calendar-grid">
                      {calendarCells.map((day, index) => {
                        if (!day) {
                          return (
                            <span
                              key={`empty-${index}`}
                              className="calendar-empty"
                            />
                          );
                        }

                        const isOutOfRange =
                          day < minSelectable || day > maxSelectable;
                        const isActive = isSameDay(day, selectedDate);

                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            className={`calendar-day ${isActive ? "active" : ""}`}
                            disabled={isOutOfRange}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                date: toISODate(day),
                              }))
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
                    {t("reservation.date_slot.slot_label")}{" "}
                    <span className="required">
                      {t("reservation.date_slot.required")}
                    </span>
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
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, time: slot }))
                          }
                          disabled={isFull}
                        >
                          <div>{slot}</div>
                          <div
                            className={
                              isFull ? "full-indicator" : "available-indicator"
                            }
                          >
                            {isFull
                              ? t("reservation.date_slot.slot_full")
                              : t("reservation.date_slot.slot_available", {
                                  count: available,
                                })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-panel">
              <h2 className="step-title">
                {t("reservation.tickets.section_title")}
              </h2>
              <div className="ticket-lines">
                {RESERVATION_TICKETS.map((ticket) => (
                  <article className="ticket-line" key={ticket.id}>
                    <div className="ticket-line-main">
                      <img
                        src={ticket.icon}
                        alt=""
                        aria-hidden="true"
                        className="ticket-line-icon"
                      />
                      <div>
                        <h3 className="ticket-line-name">{ticket.name}</h3>
                        <p className="ticket-line-description">
                          {ticket.description}
                        </p>
                      </div>
                    </div>

                    <div className="ticket-line-end">
                      <strong className="ticket-line-price">
                        {ticket.price} €
                      </strong>
                      <div className="ticket-quantity-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleQuantity(ticket.id, -1)}
                          disabled={formData.quantities[ticket.id] === 0}
                          aria-label={t("reservation.tickets.remove_aria", {
                            name: ticket.name,
                          })}
                        >
                          -
                        </button>
                        <input
                          id={`qty-${ticket.id}`}
                          type="number"
                          min="0"
                          readOnly
                          value={formData.quantities[ticket.id]}
                          aria-label={t("reservation.tickets.qty_aria", {
                            name: ticket.name,
                          })}
                          title={t("reservation.tickets.qty_aria", {
                            name: ticket.name,
                          })}
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleQuantity(ticket.id, 1)}
                          disabled={isAtSelectedSlotLimit}
                          aria-label={t("reservation.tickets.add_aria", {
                            name: ticket.name,
                          })}
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
              <h2 className="step-title">
                {t("reservation.maze.section_title")}
              </h2>
              <div className="form-group">
                <label htmlFor="mazeCode">
                  {t("reservation.maze.code_label")}
                </label>
                <input
                  id="mazeCode"
                  className="input-text winner-code-input"
                  type="text"
                  value={formData.mazeCode}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      mazeCode: event.target.value,
                      mazeCodeValidated: false,
                    }))
                  }
                  placeholder={t("reservation.maze.code_placeholder")}
                />
                <div className="winner-code-actions">
                  <button
                    type="button"
                    className="btn winner-code-validate-btn"
                    onClick={handleValidateMazeCode}
                    disabled={!hasMazeCode}
                  >
                    {t("reservation.maze.validate_btn")}
                  </button>
                </div>
                <p className="winner-code-hint">{t("reservation.maze.hint")}</p>
              </div>
            </div>

            <div className="booking-panel">
              <h2 className="step-title">
                {t("reservation.contact.section_title")}
              </h2>
              <p className="booking-login-hint">
                {t("reservation.contact.login_hint")}{" "}
                <Link to="/login">{t("reservation.contact.login_link")}</Link>
              </p>

              <div className="booking-grid-two">
                <div className="form-group">
                  <label htmlFor="lastName">
                    {t("reservation.contact.last_name_label")}{" "}
                    <span className="required">
                      {t("reservation.date_slot.required")}
                    </span>
                  </label>
                  <input
                    id="lastName"
                    className="input-text"
                    type="text"
                    value={formData.lastName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: event.target.value,
                      }))
                    }
                    placeholder={t("reservation.contact.last_name_placeholder")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="firstName">
                    {t("reservation.contact.first_name_label")}{" "}
                    <span className="required">
                      {t("reservation.date_slot.required")}
                    </span>
                  </label>
                  <input
                    id="firstName"
                    className="input-text"
                    type="text"
                    value={formData.firstName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: event.target.value,
                      }))
                    }
                    placeholder={t(
                      "reservation.contact.first_name_placeholder",
                    )}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  {t("reservation.contact.email_label")}{" "}
                  <span className="required">
                    {t("reservation.date_slot.required")}
                  </span>
                </label>
                <input
                  id="email"
                  className="input-text"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder={t("reservation.contact.email_placeholder")}
                />
              </div>
            </div>
          </section>

          <aside
            className="booking-cart"
            aria-label={t("reservation.aria.cart")}
          >
            <h2 className="booking-cart-title">
              {t("reservation.cart.title")}
            </h2>
            <p className="booking-cart-meta">
              {t("reservation.cart.tickets_count", { count: totalTickets })}
            </p>

            <div className="booking-cart-lines">
              {cartItems.length === 0 ? (
                <p className="booking-cart-empty">
                  {t("reservation.cart.empty")}
                </p>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div className="booking-cart-line" key={item.id}>
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <strong>{item.subtotal} €</strong>
                    </div>
                  ))}
                  {isMazeCodeValid && (
                    <div className="booking-cart-line booking-cart-line--goodies">
                      <span>{t("reservation.cart.goodies")}</span>
                      <strong>{t("reservation.cart.goodies_price")}</strong>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="booking-cart-total">
              <span>{t("reservation.cart.total")}</span>
              <strong>{totalPrice} €</strong>
            </div>

            <button
              className="btn btn-primary booking-cart-cta"
              type="button"
              onClick={handleContinue}
            >
              {t("reservation.cart.cta")}
            </button>

            {inlineError && <p className="info-message error">{inlineError}</p>}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
