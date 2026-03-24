import React, { useMemo } from "react";
import { RESERVATION_TICKETS } from "./reservationTickets";

const ReservationStep4 = ({ reservationData, onPrevious, onNext }) => {
  const { date, time, quantities, email } = reservationData;

  const cartItems = useMemo(() => {
    return RESERVATION_TICKETS
      .filter((t) => quantities[t.id] > 0)
      .map((t) => ({
        id: t.id,
        label: t.label,
        price: t.price,
        quantity: quantities[t.id],
        subtotal: quantities[t.id] * t.price,
      }));
  }, [quantities]);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  const formatDate = (dateStr) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr + "T00:00").toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="reservation-step-4">
      <h2 className="step-title">Étape 4 : Vérifiez votre commande</h2>

      {/* Récapitulatif complet */}
      <div className="recap-container">
        {/* Visite */}
        <div className="recap-section">
          <h3 className="recap-title">Détails de la visite</h3>
          <div className="recap-content">
            <div className="recap-row">
              <span className="recap-label">Date :</span>
              <span className="recap-value">{formatDate(date)}</span>
            </div>
            <div className="recap-row">
              <span className="recap-label">Créneau :</span>
              <span className="recap-value">{time}</span>
            </div>
          </div>
        </div>

        {/* Billets */}
        <div className="recap-section">
          <h3 className="recap-title">Billets commandés</h3>
          <div className="recap-content">
            {cartItems.map((item) => (
              <div key={item.id} className="recap-row">
                <span className="recap-label">
                  {item.label} (x{item.quantity})
                </span>
                <span className="recap-value">{item.subtotal}€</span>
              </div>
            ))}
            <div className="recap-divider" />
            <div className="recap-row total">
              <span className="recap-label">Total :</span>
              <span className="recap-value">{total}€</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="recap-section">
          <h3 className="recap-title">Email de confirmation</h3>
          <div className="recap-content">
            <p className="recap-email">{email}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onPrevious}>
          Retour
        </button>
        <button className="btn btn-primary btn-lg" onClick={onNext}>
          Finaliser la commande
        </button>
      </div>
    </div>
  );
};

export default ReservationStep4;
