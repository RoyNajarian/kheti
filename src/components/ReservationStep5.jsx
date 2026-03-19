import React, { useState } from "react";
import { useNavigate } from "react-router";

const ReservationStep5 = ({ reservationData, onPrevious }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber] = useState(
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
  );

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simuler l'envoi de la commande
    setTimeout(() => {
      setIsLoading(false);
      // Rediriger vers la page d'accueil après 3 secondes
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="reservation-step-5">
      {!isLoading ? (
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
              {isLoading ? "Traitement..." : "Confirmer la commande"}
            </button>
          </div>
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
