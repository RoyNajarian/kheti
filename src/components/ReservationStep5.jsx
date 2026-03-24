import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createReservation } from "../back-office/api";
import { RESERVATION_PRICE_BY_TICKET } from "./reservationTickets";

const ReservationStep5 = ({ reservationData, onPrevious }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const isValidEmail = (value) => {
    const normalized = String(value || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  };

  const toSqlHour = (value) => {
    if (!value) return "";
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
    if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
    return value;
  };

  const handleConfirm = async () => {
    setApiError("");
    setIsLoading(true);

    try {
      const adultCount = Number(reservationData.quantities?.explorateur || 0);
      const childCount = Number(reservationData.quantities?.scarabee || 0);
      const studentCount = Number(reservationData.quantities?.scribe || 0);
      const totalTickets = adultCount + childCount + studentCount;

      if (!reservationData.date || !reservationData.time || totalTickets <= 0) {
        throw new Error("Informations de reservation incompletes.");
      }

      const normalizedEmail = String(reservationData.email || "").trim().toLowerCase();
      if (!normalizedEmail) {
        throw new Error("Email manquant pour finaliser la reservation.");
      }
      if (!isValidEmail(normalizedEmail)) {
        throw new Error("L'adresse email est invalide. Exemple attendu: nom@domaine.com");
      }

      const totalPrice =
        adultCount * RESERVATION_PRICE_BY_TICKET.explorateur +
        childCount * RESERVATION_PRICE_BY_TICKET.scarabee +
        studentCount * RESERVATION_PRICE_BY_TICKET.scribe;

      const payload = {
        day: reservationData.date,
        hour: toSqlHour(reservationData.time),
        price: totalPrice,
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

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setApiError(error.message || "Erreur lors de l'envoi de la reservation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reservation-step-5">
      {!isSuccess ? (
        <>
          <h2 className="step-title">Étape 5 : Validation finale</h2>

          <div className="confirmation-message">
            <div className="confirmation-icon">✓</div>
            <h3>Prêt à finaliser ?</h3>
            <p>
              Vérifiez une dernière fois les détails de votre réservation avant
              de confirmer.
            </p>
          </div>

          <div className="step-section">
            <h3 className="section-subtitle">Informations de la commande</h3>
            <div className="order-details">
              <div className="detail-row">
                <span>Date et créneau :</span>
                <span className="detail-value">
                  {new Date(reservationData.date + "T00:00").toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}{" "}
                  à {reservationData.time}
                </span>
              </div>
              <div className="detail-row">
                <span>Nombre de billets :</span>
                <span className="detail-value">
                  {Object.values(reservationData.quantities).reduce(
                    (a, b) => a + b,
                    0
                  )}{" "}
                  billet(s)
                </span>
              </div>
              <div className="detail-row">
                <span>Email :</span>
                <span className="detail-value">{reservationData.email}</span>
              </div>
            </div>
          </div>

          <div className="step-actions">
            <button className="btn btn-secondary" onClick={onPrevious}>
              Retour
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Confirmer la commande"}
            </button>
          </div>

          {apiError && <p className="info-message error">{apiError}</p>}
        </>
      ) : (
        <div className="confirmation-success">
          <div className="success-icon">✓</div>
          <h2>Commande confirmée !</h2>
          <div className="order-number">Numéro de commande : {orderNumber}</div>
          <p>Un email de confirmation a été envoyé à {reservationData.email}</p>
          <p className="success-redirect">
            Redirection vers l'accueil dans quelques secondes...
          </p>
        </div>
      )}
    </div>
  );
};

export default ReservationStep5;
