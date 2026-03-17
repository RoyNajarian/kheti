import React, { useState } from "react";
import "../styles/Reservation.css";

const Reservation = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [quantities, setQuantities] = useState({
    explorateur: 1,
    scribe: 0,
    scarabee: 0,
    pass: 0,
  });
  const prices = {
    explorateur: 20,
    scribe: 10,
    scarabee: 7,
    pass: 40,
  };
  const total =
    quantities.explorateur * prices.explorateur +
    quantities.scribe * prices.scribe +
    quantities.scarabee * prices.scarabee +
    quantities.pass * prices.pass;
  const handleQuantity = (type, delta) => {
    setQuantities((q) => ({
      ...q,
      [type]: Math.max(0, q[type] + delta),
    }));
  };

  return (
    <div className="reservation-bg">
      <div className="reservation-scroll">
        <div className="reservation-panel cartoon-egypt">
          <h2 className="reservation-title cartoon-egypt-title">
            <span>BILLETTERIE - RÉSERVEZ VOTRE VOYAGE</span>
          </h2>
          <div className="reservation-main-row">
            {/* Colonne gauche : calendrier */}
            <div className="reservation-step reservation-col-left">
              <div className="step-title cartoon-egypt-step">1. QUAND ?</div>
              <input
                type="date"
                className="reservation-date cartoon-egypt-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div className="reservation-times">
                {["10:00", "12:00", "14:00", "16:00"].map((t) => (
                  <button
                    key={t}
                    className={`reservation-time-btn cartoon-egypt-btn${time === t ? " selected" : ""}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Colonne droite : tarifs avec icônes BD/Égypte */}
            <div className="reservation-step reservation-col-right">
              <div className="step-title cartoon-egypt-step">2. POUR QUI ?</div>
              <div className="reservation-cards">
                <div className="reservation-card cartoon-egypt-card">
                  <img src="/public/images/hat.png" alt="Explorateur" className="cartoon-egypt-icon" />
                  <div className="card-title">EXPLORATEUR <span className="card-desc">Adulte</span></div>
                  <div className="card-price">20€</div>
                  <div className="card-qty">
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("explorateur", -1)}>-</button>
                    <span>{quantities.explorateur}</span>
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("explorateur", 1)}>+</button>
                  </div>
                </div>
                <div className="reservation-card cartoon-egypt-card">
                  <img src="/public/images/papyrus.png" alt="Scribe" className="cartoon-egypt-icon" />
                  <div className="card-title">SCRIBE</div>
                  <div className="card-price">10€</div>
                  <div className="card-qty">
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("scribe", -1)}>-</button>
                    <span>{quantities.scribe}</span>
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("scribe", 1)}>+</button>
                  </div>
                </div>
                <div className="reservation-card cartoon-egypt-card">
                  <img src="/public/images/pharaon.png" alt="Petit Scarabée" className="cartoon-egypt-icon" />
                  <div className="card-title">PETIT SCARABÉE <span className="card-desc">Enfant (≤12 ans)</span></div>
                  <div className="card-price">7€</div>
                  <div className="card-qty">
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("scarabee", -1)}>-</button>
                    <span>{quantities.scarabee}</span>
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("scarabee", 1)}>+</button>
                  </div>
                </div>
                <div className="reservation-card cartoon-egypt-card">
                  <img src="/public/images/pharaon.png" alt="Pass Pharaon" className="cartoon-egypt-icon" />
                  <div className="card-title">PASS PHARAON</div>
                  <div className="card-price">40€</div>
                  <div className="card-qty">
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("pass", -1)}>-</button>
                    <span>{quantities.pass}</span>
                    <button className="cartoon-egypt-btn" onClick={() => handleQuantity("pass", 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Panier sacré */}
          <div className="reservation-step cartoon-egypt-step">
            <div className="step-title">3. VOTRE PANIER SACRÉ</div>
            <div className="reservation-cart cartoon-egypt-cart">
              <div className="cart-row">
                <span>EXPLORATEUR</span>
                <span>{prices.explorateur}€ x {quantities.explorateur}</span>
              </div>
              <div className="cart-row">
                <span>SCRIBE</span>
                <span>{prices.scribe}€ x {quantities.scribe}</span>
              </div>
              <div className="cart-row">
                <span>PETIT SCARABÉE</span>
                <span>{prices.scarabee}€ x {quantities.scarabee}</span>
              </div>
              <div className="cart-row">
                <span>PASS PHARAON</span>
                <span>{prices.pass}€ x {quantities.pass}</span>
              </div>
              <div className="cart-total">
                <span>TOTAL</span>
                <span>{total}€</span>
              </div>
            </div>
            <button className="reservation-submit cartoon-egypt-btn">VALIDER MON OFFRANDE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;

