import React from "react";
import "../styles/Breadcrumb.css";
import { useTranslation } from "react-i18next";

const Breadcrumb = ({ currentStep, steps }) => {
  const { t } = useTranslation();

  const resolvedSteps =
    steps ?? t("breadcrumb.default_steps", { returnObjects: true });

  return (
    <div className="breadcrumb">
      <div className="breadcrumb-container">
        <div className="breadcrumb-steps">
          {resolvedSteps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div
                className={`breadcrumb-step ${
                  step.number <= currentStep ? "active" : ""
                } ${step.number === currentStep ? "current" : ""}`}
              >
                <div className="breadcrumb-number">{step.number}</div>
                <div className="breadcrumb-label">{step.label}</div>
              </div>
              {index < resolvedSteps.length - 1 && (
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
