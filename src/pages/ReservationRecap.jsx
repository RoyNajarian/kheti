import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Breadcrumb from "../components/Breadcrumb";
import { createReservation } from "../back-office/api";
import { RESERVATION_TICKETS, RESERVATION_PRICE_BY_TICKET } from "../components/reservationTickets";
import "../styles/Reservation.css";

const RESERVATION_DRAFT_KEY = "khetiReservationDraft";

const TWO_STEP_BREADCRUMB = [
  { number: 1, label: "Votre réservation" },
  { number: 2, label: "Récap et validation" },
];

const getDraft = () => {
  try {
    const raw = sessionStorage.getItem(RESERVATION_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const toSqlHour = (value) => {
  if (!value) return "";
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
};

const ReservationRecap = () => {
  const navigate = useNavigate();
  const [draft] = useState(getDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const cartItems = useMemo(() => {
    if (!draft?.quantities) return [];

    return RESERVATION_TICKETS.filter((ticket) => Number(draft.quantities[ticket.id] || 0) > 0).map((ticket) => ({
      ...ticket,
      quantity: Number(draft.quantities[ticket.id] || 0),
      subtotal: Number(draft.quantities[ticket.id] || 0) * ticket.price,
    }));
  }, [draft]);

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  if (!draft) {
    return <Navigate to="/reservation" replace />;
  }

  const handleConfirm = async () => {
    setApiError("");
    setIsLoading(true);

    try {
      const adultCount = Number(draft.quantities?.explorateur || 0);
      const childCount = Number(draft.quantities?.scarabee || 0);
      const studentCount = Number(draft.quantities?.scribe || 0);
      const totalTickets = adultCount + childCount + studentCount;

      if (!draft.date || !draft.time || totalTickets <= 0) {
        throw new Error("Votre réservation est incomplète.");
      }

      const normalizedEmail = String(draft.email || "").trim().toLowerCase();
      if (!isValidEmail(normalizedEmail)) {
        throw new Error("Adresse email invalide.");
      }

      const payload = {
        day: draft.date,
        hour: toSqlHour(draft.time),
        price:
          adultCount * RESERVATION_PRICE_BY_TICKET.explorateur +
          childCount * RESERVATION_PRICE_BY_TICKET.scarabee +
          studentCount * RESERVATION_PRICE_BY_TICKET.scribe,
        adult_count: adultCount,
        child_count: childCount,
        student_count: studentCount,
        email: normalizedEmail,
      };

      const response = await createReservation(payload);
      const reservationId =
        response?.data?.id_reservation ??
        response?.data?.id ??
        response?.id_reservation ??
        response?.id;

      const fallbackOrder = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");

      setOrderNumber(String(reservationId || fallbackOrder));
      setIsSuccess(true);
      sessionStorage.removeItem(RESERVATION_DRAFT_KEY);
    } catch (error) {
      setApiError(error.message || "Erreur lors de la validation de la réservation.");
    } finally {
      setIsLoading(false);
    }
  };

  const readableDate = new Date(`${draft.date}T00:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="reservation-container">
      <div className="reservation-backdrop" aria-hidden="true" />
      <Breadcrumb currentStep={2} steps={TWO_STEP_BREADCRUMB} />

      <div className="reservation-wrapper reservation-wrapper--narrow">
        {!isSuccess ? (
          <section className="recap-page" aria-label="Récapitulatif de réservation">
            <h1 className="reservation-main-title">Récapitulatif et validation</h1>

            <div className="recap-container">
              <div className="recap-section">
                <h2 className="recap-title">Votre visite</h2>
                <div className="recap-row">
                  <span className="recap-label">Date</span>
                  <strong className="recap-value">{readableDate}</strong>
                </div>
                <div className="recap-row">
                  <span className="recap-label">Créneau</span>
                  <strong className="recap-value">{draft.time}</strong>
                </div>
              </div>

              <div className="recap-section">
                <h2 className="recap-title">Billets</h2>
                {cartItems.map((item) => (
                  <div className="recap-row" key={item.id}>
                    <span className="recap-label">{item.name} x{item.quantity}</span>
                    <strong className="recap-value">{item.subtotal} €</strong>
                  </div>
                ))}
                <div className="recap-row total">
                  <span className="recap-label">Total</span>
                  <strong className="recap-value">{totalPrice} €</strong>
                </div>
              </div>

              <div className="recap-section">
                <h2 className="recap-title">Coordonnées</h2>
                <div className="recap-row">
                  <span className="recap-label">Nom</span>
                  <strong className="recap-value">{draft.lastName}</strong>
                </div>
                <div className="recap-row">
                  <span className="recap-label">Prénom</span>
                  <strong className="recap-value">{draft.firstName}</strong>
                </div>
                <div className="recap-row">
                  <span className="recap-label">Email</span>
                  <strong className="recap-value recap-email">{draft.email}</strong>
                </div>
              </div>

              <div className="recap-section recap-edit-action">
                <Link to="/reservation" className="recap-edit-link">
                  Modifier mes choix
                </Link>
              </div>
            </div>

            <div className="step-actions">
              <button
                type="button"
                className="btn recap-confirm-cta"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Validation en cours..." : "Valider l'offrande"}
              </button>
            </div>

            {apiError && <p className="info-message error">{apiError}</p>}
          </section>
        ) : (
          <section className="confirmation-success" aria-label="Commande confirmée">
            <div className="success-icon">✓</div>
            <h2>Réservation confirmée</h2>
            <div className="order-number">Numéro : {orderNumber}</div>
            <p>Un email de confirmation a été envoyé à {draft.email}.</p>
            <div className="step-actions">
              <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                Retour à l&apos;accueil
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ReservationRecap;
