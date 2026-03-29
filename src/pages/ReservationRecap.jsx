import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Breadcrumb from "../components/Breadcrumb";
import { createReservation } from "../back-office/api";
import { RESERVATION_TICKETS, RESERVATION_PRICE_BY_TICKET } from "../components/reservationTickets";
import "../styles/Reservation.css";
import "../styles/ReservationRecap.css";
import { useTranslation } from "react-i18next";

const RESERVATION_DRAFT_KEY = "khetiReservationDraft";
const MAZE_GOODIES_CODE = "KHETI-MAZE-26";

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
  const { t, i18n } = useTranslation();

  const [draft] = useState(getDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Breadcrumb steps built from translations
  const TWO_STEP_BREADCRUMB = useMemo(() => [
    { number: 1, label: t('reservation.breadcrumb.step1') },
    { number: 2, label: t('reservation.breadcrumb.step2') },
  ], [t]);

  const hasGoodiesAccess =
    String(draft?.mazeCode || "").trim().toUpperCase() === MAZE_GOODIES_CODE &&
    Boolean(draft?.mazeCodeValidated);

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
        throw new Error(t('reservation_recap.errors.incomplete'));
      }

      const normalizedEmail = String(draft.email || "").trim().toLowerCase();
      if (!isValidEmail(normalizedEmail)) {
        throw new Error(t('reservation_recap.errors.invalid_email'));
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
        name: draft.lastName,
        first_name: draft.firstName,
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

      const finalOrderNumber = String(reservationId || fallbackOrder);
      setOrderNumber(finalOrderNumber);

      setIsSuccess(true);
      sessionStorage.removeItem(RESERVATION_DRAFT_KEY);
    } catch (error) {
      setApiError(error.message || t('reservation_recap.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const readableDate = new Date(`${draft.date}T00:00:00`).toLocaleDateString(
    i18n.language?.startsWith("fr") ? "fr-FR" : "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="reservation-container">
      <div className="reservation-backdrop" aria-hidden="true" />
      <Breadcrumb currentStep={2} steps={TWO_STEP_BREADCRUMB} />

      <div className="reservation-wrapper reservation-wrapper--narrow">
        {!isSuccess ? (
          <section className="recap-page" aria-label={t('reservation_recap.aria.recap_section')}>
            <h1 className="reservation-main-title">{t('reservation_recap.title')}</h1>

            <div className="recap-container">
              <div className="recap-section">
                <h2 className="recap-title">{t('reservation_recap.visit.section_title')}</h2>
                <div className="recap-row">
                  <span className="recap-label">{t('reservation_recap.visit.date_label')}</span>
                  <strong className="recap-value">{readableDate}</strong>
                </div>
                <div className="recap-row">
                  <span className="recap-label">{t('reservation_recap.visit.slot_label')}</span>
                  <strong className="recap-value">{draft.time}</strong>
                </div>
              </div>

              <div className="recap-section">
                <h2 className="recap-title">{t('reservation_recap.tickets.section_title')}</h2>
                {cartItems.map((item) => (
                  <div className="recap-row" key={item.id}>
                    <span className="recap-label">{item.name} x{item.quantity}</span>
                    <strong className="recap-value">{item.subtotal} €</strong>
                  </div>
                ))}
                {hasGoodiesAccess && (
                  <div className="recap-row">
                    <span className="recap-label">{t('reservation_recap.tickets.goodies')}</span>
                    <strong className="recap-value recap-value--valid">{t('reservation_recap.tickets.goodies_price')}</strong>
                  </div>
                )}
                <div className="recap-row total">
                  <span className="recap-label">{t('reservation_recap.tickets.total')}</span>
                  <strong className="recap-value">{totalPrice} €</strong>
                </div>
              </div>

              <div className="recap-section">
                <h2 className="recap-title">{t('reservation_recap.contact.section_title')}</h2>
                <div className="recap-row">
                  <span className="recap-label">{t('reservation_recap.contact.last_name')}</span>
                  <strong className="recap-value">{draft.lastName}</strong>
                </div>
                <div className="recap-row">
                  <span className="recap-label">{t('reservation_recap.contact.first_name')}</span>
                  <strong className="recap-value">{draft.firstName}</strong>
                </div>
                <div className="recap-row">
                  <span className="recap-label">{t('reservation_recap.contact.email')}</span>
                  <strong className="recap-value recap-email">{draft.email}</strong>
                </div>
              </div>

              <div className="recap-section">
                <h2 className="recap-title">{t('reservation_recap.maze.section_title')}</h2>
                <div className="recap-row">
                  <span className="recap-label">{t('reservation_recap.maze.code_label')}</span>
                  <strong
                    className={`recap-value recap-email ${
                      !draft.mazeCode
                        ? ""
                        : hasGoodiesAccess
                          ? "recap-value--valid"
                          : "recap-value--invalid"
                    }`}
                  >
                    {!draft.mazeCode
                      ? t('reservation_recap.maze.code_empty')
                      : hasGoodiesAccess
                        ? t('reservation_recap.maze.code_valid')
                        : t('reservation_recap.maze.code_invalid')}
                  </strong>
                </div>
              </div>

              <div className="recap-section recap-edit-action">
                <Link to="/reservation" className="recap-edit-link">
                  {t('reservation_recap.edit')}
                </Link>
              </div>
            </div>

            <div className="step-actions">
              <button
                type="button"
                className="btn booking-cart-cta recap-confirm-cta"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading
                  ? t('reservation_recap.confirm_loading')
                  : t('reservation_recap.confirm_btn')}
              </button>
            </div>

            {apiError && <p className="info-message error">{apiError}</p>}
          </section>
        ) : (
          <section className="confirmation-success" aria-label={t('reservation_recap.aria.success_section')}>
            <h2>{t('reservation_recap.success.title')}</h2>
            <p style={{ fontSize: "1.1rem", color: "#d4c4a0", margin: "1rem 0" }}>
              {t('reservation_recap.success.body')}
            </p>
            {hasGoodiesAccess && (
              <p className="goodies-message">
                {t('reservation_recap.success.goodies_message')}
              </p>
            )}

            <div className="confirmation-tintin-scene">
              <div className="tintin-thought-bubble">
                <p>{t('reservation_recap.success.bubble')}</p>
              </div>
              <img
                src="/images/tintin_perso.png"
                alt={t('reservation_recap.success.tintin_alt')}
                className="confirmation-tintin"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ReservationRecap;