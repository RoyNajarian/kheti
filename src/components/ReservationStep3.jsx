import React, { useState } from "react";
import { Link } from "react-router";

const ReservationStep3 = ({
  reservationData,
  setReservationData,
  onPrevious,
  onNext,
}) => {
  const { email: existingEmail } = reservationData;
  const [email, setEmail] = useState(existingEmail || "");
  const [identityMethod, setIdentityMethod] = useState("login"); // "login", "register", or "guest"

  const isValidEmail = (value) => {
    const normalized = String(value || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  };

  const handleContinue = () => {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      alert("Veuillez entrer votre email");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      alert("Veuillez saisir un email valide (exemple: nom@domaine.com)");
      return;
    }

    setReservationData({ ...reservationData, email: normalizedEmail });
    onNext();
  };

  return (
    <div className="reservation-step-3">
      <h2 className="step-title">Étape 3 : Identité</h2>

      <div className="step-section">
        <h3 className="section-subtitle">Comment souhaitez-vous continuer ?</h3>

        {/* Option 1: Connexion */}
        <div className="identity-option">
          <label className="identity-radio">
            <input
              type="radio"
              name="identity"
              value="login"
              checked={identityMethod === "login"}
              onChange={(e) => setIdentityMethod(e.target.value)}
            />
            <span className="radio-label">
              <strong>Me connecter</strong>
              <span className="radio-description">
                Vous avez déjà un compte
              </span>
            </span>
          </label>
          {identityMethod === "login" && (
            <div className="identity-content">
              <p className="info-text">
                Vous serez redirigé vers la page de connexion.
              </p>
              <Link to="/login" className="btn btn-secondary">
                Accéder à la connexion
              </Link>
            </div>
          )}
        </div>

        {/* Option 2: Inscription */}
        <div className="identity-option">
          <label className="identity-radio">
            <input
              type="radio"
              name="identity"
              value="register"
              checked={identityMethod === "register"}
              onChange={(e) => setIdentityMethod(e.target.value)}
            />
            <span className="radio-label">
              <strong>Créer un compte</strong>
              <span className="radio-description">
                Première visite chez nous
              </span>
            </span>
          </label>
          {identityMethod === "register" && (
            <div className="identity-content">
              <p className="info-text">
                Vous serez redirigé vers la page d'inscription.
              </p>
              <Link to="/register" className="btn btn-secondary">
                Accéder à l'inscription
              </Link>
            </div>
          )}
        </div>

        {/* Option 3: Continuer sans compte */}
        <div className="identity-option">
          <label className="identity-radio">
            <input
              type="radio"
              name="identity"
              value="guest"
              checked={identityMethod === "guest"}
              onChange={(e) => setIdentityMethod(e.target.value)}
            />
            <span className="radio-label">
              <strong>Continuer sans compte</strong>
              <span className="radio-description">
                Fournissez simplement votre email
              </span>
            </span>
          </label>
          {identityMethod === "guest" && (
            <div className="identity-content">
              <div className="form-group">
                <label htmlFor="guest-email">
                  Votre email <span className="required">*</span>
                </label>
                <input
                  id="guest-email"
                  type="email"
                  className="input-text"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="input-help">
                  Votre confirmation de réservation vous sera envoyée à cet email
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button className="btn btn-secondary" onClick={onPrevious}>
          Retour
        </button>
        {identityMethod === "guest" ? (
          <button className="btn btn-primary" onClick={handleContinue}>
            Continuer vers le récapitulatif
          </button>
        ) : (
          <p className="info-message">
            Vous serez redirigé après votre {identityMethod === "login" ? "connexion" : "inscription"}.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReservationStep3;
