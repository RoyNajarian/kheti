import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import ReservationStep1 from "../components/ReservationStep1";
import ReservationStep2 from "../components/ReservationStep2";
import ReservationStep3 from "../components/ReservationStep3";
import ReservationStep4 from "../components/ReservationStep4";
import ReservationStep5 from "../components/ReservationStep5";
import "../styles/Reservation.css";

const getInitialReservationEmail = () => {
  try {
    const raw = localStorage.getItem("khetiUser");
    if (!raw) return "";
    const user = JSON.parse(raw);
    return String(user?.email || "").trim();
  } catch {
    return "";
  }
};

const Reservation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    quantities: {
      explorateur: 0,
      scribe: 0,
      scarabee: 0,
    },
    email: getInitialReservationEmail(),
  });

  const handleQuantity = (type, delta) => {
    setReservationData((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [type]: Math.max(0, prev.quantities[type] + delta),
      },
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="reservation-container">
      <Breadcrumb currentStep={currentStep} />

      <div className="reservation-wrapper">
        <h1 className="reservation-main-title">Billetterie - Réservez votre voyage</h1>

        {currentStep === 1 && (
          <ReservationStep1
            date={reservationData.date}
            setDate={(date) =>
              setReservationData({ ...reservationData, date })
            }
            time={reservationData.time}
            setTime={(time) =>
              setReservationData({ ...reservationData, time })
            }
            quantities={reservationData.quantities}
            handleQuantity={handleQuantity}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <ReservationStep2
            reservationData={reservationData}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 3 && (
          <ReservationStep3
            reservationData={reservationData}
            setReservationData={setReservationData}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 4 && (
          <ReservationStep4
            reservationData={reservationData}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 5 && (
          <ReservationStep5
            reservationData={reservationData}
            onPrevious={handlePreviousStep}
          />
        )}
      </div>
    </div>
  );
};

export default Reservation;

