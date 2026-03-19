import React, { useMemo } from "react";

const ReservationStep2 = ({ reservationData, onPrevious, onNext }) => {
  const { date, time, quantities } = reservationData;

  const ticketDetails = [
    { id: "explorateur", label: "L'Explorateur (Adulte)", price: 20 },
    { id: "scribe", label: "Le Scribe (Étudiant)", price: 10 },
    { id: "scarabee", label: "Petit Scarabée (Enfant)", price: 7 },
  ];

  const cartItems = useMemo(() => {
    return ticketDetails
      .filter((t) => quantities[t.id] > 0)
      .map((t) => ({
        ...t,
        quantity: quantities[t.id],
        subtotal: quantities[t.id] * t.price,
      }));
  }, [quantities]);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  const formatDate = (dateStr) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr + "T00:00").toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="reservation-step-2">
      <h2 className="step-title">Étape 2 : Récapitulatif du panier</h2>

      {/* Recap visite */}
      <div className="step-section">
        <h3 className="section-subtitle">Votre visite</h3>
        <div className="visit-recap">
          <p>
            <strong>Date :</strong> {formatDate(date)}
          </p>
          <p>
            <strong>Créneau :</strong> {time}
          </p>
        </div>
      </div>

      {/* Panier */}
      <div className="step-section">
        <h3 className="section-subtitle">Vos billets</h3>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.label}</h4>
                <p className="cart-item-qty">{item.quantity} billet(s)</p>
              </div>
              <div className="cart-item-price">
                <div className="price-unit">{item.price}€ x {item.quantity}</div>
                <div className="price-subtotal">{item.subtotal}€</div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="cart-total">
          <span>Montant total :</span>
          <span className="total-amount">{total}€</span>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onPrevious}>
          Retour
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Continuer vers l'identité
        </button>
      </div>
    </div>
  );
};

export default ReservationStep2;
