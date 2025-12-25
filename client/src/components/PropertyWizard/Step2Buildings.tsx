import React from 'react';
import { PropertyWizardData, Address } from '../../types/property';
import './Step2Buildings.css';

interface Step2BuildingsProps {
  data: PropertyWizardData;
  onChange: (data: Partial<PropertyWizardData>) => void;
}

const Step2Buildings = ({ data, onChange }: Step2BuildingsProps) => {
  const buildings = data.buildings || [];

  const addBuilding = () => {
    onChange({
      buildings: [
        ...buildings,
        {
          address: {
            street: '',
            houseNumber: '',
          },
          additionalDetails: '',
        },
      ],
    });
  };

  const removeBuilding = (index: number) => {
    const updatedBuildings = buildings.filter((_, i) => i !== index);
    onChange({ buildings: updatedBuildings });
  };

  const updateBuilding = (index: number, field: 'address' | 'additionalDetails', value: Address | string) => {
    const updatedBuildings = [...buildings];
    updatedBuildings[index] = {
      ...updatedBuildings[index],
      [field]: value,
    };
    onChange({ buildings: updatedBuildings });
  };

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    const updatedBuildings = [...buildings];
    updatedBuildings[index] = {
      ...updatedBuildings[index],
      address: {
        ...updatedBuildings[index].address,
        [field]: value,
      },
    };
    onChange({ buildings: updatedBuildings });
  };

  return (
    <div className="step2-container">
      <div className="step-header">
        <h3>Building Information</h3>
        <button type="button" onClick={addBuilding} className="add-building-button">
          + Add Building
        </button>
      </div>
      <p className="step-description">
        Add one or more buildings to this property. Each building must have at least a street and house number.
      </p>

      {buildings.length === 0 ? (
        <div className="empty-state">
          <p>No buildings added yet. Click "Add Building" to get started.</p>
        </div>
      ) : (
        <div className="buildings-list">
          {buildings.map((building, index) => (
            <div key={index} className="building-card">
              <div className="building-header">
                <h4>Building {index + 1}</h4>
                {buildings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBuilding(index)}
                    className="remove-building-button"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="building-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`street-${index}`}>
                      Street <span className="required">*</span>
                    </label>
                    <input
                      id={`street-${index}`}
                      type="text"
                      value={building.address.street}
                      onChange={(e) => updateAddress(index, 'street', e.target.value)}
                      placeholder="Enter street name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`houseNumber-${index}`}>
                      House Number <span className="required">*</span>
                    </label>
                    <input
                      id={`houseNumber-${index}`}
                      type="text"
                      value={building.address.houseNumber}
                      onChange={(e) => updateAddress(index, 'houseNumber', e.target.value)}
                      placeholder="Enter house number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`postalCode-${index}`}>Postal Code</label>
                    <input
                      id={`postalCode-${index}`}
                      type="text"
                      value={building.address.postalCode || ''}
                      onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`city-${index}`}>City</label>
                    <input
                      id={`city-${index}`}
                      type="text"
                      value={building.address.city || ''}
                      onChange={(e) => updateAddress(index, 'city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`country-${index}`}>Country</label>
                  <input
                    id={`country-${index}`}
                    type="text"
                    value={building.address.country || ''}
                    onChange={(e) => updateAddress(index, 'country', e.target.value)}
                    placeholder="Enter country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`additionalDetails-${index}`}>Additional Details</label>
                  <textarea
                    id={`additionalDetails-${index}`}
                    value={building.additionalDetails || ''}
                    onChange={(e) => updateBuilding(index, 'additionalDetails', e.target.value)}
                    placeholder="Enter any additional building details"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Step2Buildings;
