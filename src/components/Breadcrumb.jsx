import React from "react";
import "../styles/Breadcrumb.css";

const Breadcrumb = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Sélection" },
    { number: 2, label: "Panier" },
    { number: 3, label: "Identité" },
    { number: 4, label: "Récapitulatif" },
    { number: 5, label: "Validation" },
  ];

  return (
    <div className="breadcrumb">
      <div className="breadcrumb-container">
        <div className="breadcrumb-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div
                className={`breadcrumb-step ${
                  step.number <= currentStep ? "active" : ""
                } ${step.number === currentStep ? "current" : ""}`}
              >
                <div className="breadcrumb-number">{step.number}</div>
                <div className="breadcrumb-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`breadcrumb-line ${
                    step.number < currentStep ? "completed" : ""
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
