import React from 'react';

export default function WizardProgress({ currentStep, totalSteps, stepTitle }) {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="progress-section">
            <div className="step-title">{stepTitle}</div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <div className="step-indicator">Step {currentStep} of {totalSteps}</div>
        </div>
    );
}
