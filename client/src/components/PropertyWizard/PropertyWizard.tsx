import React, { useState } from 'react';
import Step1GeneralInfo from './Step1GeneralInfo';
import Step2Buildings from './Step2Buildings';
import Step3Units from './Step3Units';
import { PropertyWizardData, ManagementType } from '../../types/property';
import './PropertyWizard.css';

interface PropertyWizardProps {
  onComplete: (data: PropertyWizardData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PropertyWizard = ({ onComplete, onCancel, isLoading = false }: PropertyWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<PropertyWizardData>({
    managementType: ManagementType.WEG,
    name: '',
    propertyManagerId: '',
    accountantId: '',
    buildings: [],
    units: [],
  });

  const updateWizardData = (stepData: Partial<PropertyWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await onComplete(wizardData);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return (
          wizardData.name.trim() !== '' &&
          wizardData.propertyManagerId.trim() !== '' &&
          wizardData.accountantId.trim() !== ''
        );
      case 2:
        return wizardData.buildings.length > 0;
      case 3:
        return wizardData.units.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="property-wizard-overlay" onClick={onCancel}>
      <div className="property-wizard-container" onClick={(e) => e.stopPropagation()}>
        <div className="wizard-header">
          <h2>Create New Property</h2>
          <button className="close-button" onClick={onCancel} type="button" disabled={isLoading}>
            X
          </button>
        </div>

        <div className="wizard-steps">
          <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">General Info</span>
          </div>
          <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Buildings</span>
          </div>
          <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Units</span>
          </div>
        </div>

        <div className="wizard-content">
          {currentStep === 1 && (
            <Step1GeneralInfo
              data={wizardData}
              onChange={updateWizardData}
            />
          )}
          {currentStep === 2 && (
            <Step2Buildings
              data={wizardData}
              onChange={updateWizardData}
            />
          )}
          {currentStep === 3 && (
            <Step3Units
              data={wizardData}
              onChange={updateWizardData}
            />
          )}
        </div>

        <div className="wizard-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <div className="wizard-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="previous-button"
                disabled={isLoading}
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="next-button"
                disabled={!canProceedToNext() || isLoading}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="submit-button"
                disabled={!canProceedToNext() || isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Property'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyWizard;
