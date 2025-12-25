import React, { useState } from 'react';
import { PropertyWizardData, UnitType } from '../../types/property';
import './Step3Units.css';

interface Step3UnitsProps {
  data: PropertyWizardData;
  onChange: (data: Partial<PropertyWizardData>) => void;
}

const Step3Units = ({ data, onChange }: Step3UnitsProps) => {
  const units = data.units || [];
  const buildings = data.buildings || [];
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number | null>(
    buildings.length > 0 ? 0 : null
  );

  const addUnit = (buildingIndex?: number) => {
    const targetBuildingIndex = buildingIndex !== undefined ? buildingIndex : selectedBuildingIndex;
    if (targetBuildingIndex === null) return;
    
    onChange({
      units: [
        ...units,
        {
          buildingIndex: targetBuildingIndex,
          unitNumber: '',
          type: UnitType.Apartment,
          floor: '',
          entrance: '',
          sizeSqm: 0,
          coOwnershipShare: 0.01, // Default to 0.01 instead of 0 to avoid validation error
          constructionYear: undefined,
          rooms: undefined,
        },
      ],
    });
    
    // Also set as selected building if not already selected
    if (buildingIndex !== undefined && selectedBuildingIndex !== buildingIndex) {
      setSelectedBuildingIndex(buildingIndex);
    }
  };

  const removeUnit = (index: number) => {
    const updatedUnits = units.filter((_, i) => i !== index);
    onChange({ units: updatedUnits });
  };

  const updateUnit = (index: number, field: string, value: any) => {
    const updatedUnits = [...units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      [field]: value,
    };
    onChange({ units: updatedUnits });
  };

  const getUnitsForBuilding = (buildingIndex: number) => {
    return units.filter((unit) => unit.buildingIndex === buildingIndex);
  };

  const groupedUnitsByBuilding = buildings.map((_, index) => ({
    buildingIndex: index,
    building: buildings[index],
    units: getUnitsForBuilding(index),
  }));

  return (
    <div className="step3-container">
      <div className="step-header">
        <h3>Units Information</h3>
        {selectedBuildingIndex !== null && (
          <button type="button" onClick={() => addUnit()} className="add-unit-button">
            + Add Unit
          </button>
        )}
      </div>
      <p className="step-description">
        Add units to your buildings. Each unit must be assigned to a building and include required information.
      </p>

      {buildings.length === 0 ? (
        <div className="empty-state">
          <p>No buildings available. Please add buildings in the previous step.</p>
        </div>
      ) : (
        <div className="units-container">
          {groupedUnitsByBuilding.map(({ buildingIndex, building, units: buildingUnits }) => (
            <div key={buildingIndex} className="building-units-section">
              <div className="building-units-header">
                <h4>
                  Building {buildingIndex + 1}: {building.address.street} {building.address.houseNumber}
                </h4>
                <button
                  type="button"
                  onClick={() => addUnit(buildingIndex)}
                  className={`select-building-button ${
                    selectedBuildingIndex === buildingIndex ? 'active' : ''
                  }`}
                >
                  + Add Unit to This Building
                </button>
              </div>

              {buildingUnits.length === 0 ? (
                <div className="no-units-message">
                  No units added yet for this building.
                </div>
              ) : (
                <div className="units-list">
                  {buildingUnits.map((unit, unitIndex) => {
                    // Find the actual index in the units array
                    let actualUnitIndex = -1;
                    let count = 0;
                    for (let i = 0; i < units.length; i++) {
                      if (units[i].buildingIndex === buildingIndex) {
                        if (count === unitIndex) {
                          actualUnitIndex = i;
                          break;
                        }
                        count++;
                      }
                    }
                    
                    const uniqueId = `${buildingIndex}-${unitIndex}`;
                    
                    return (
                      <div key={uniqueId} className="unit-card">
                        <div className="unit-header">
                          <h5>Unit {unitIndex + 1}</h5>
                          <button
                            type="button"
                            onClick={() => removeUnit(actualUnitIndex)}
                            className="remove-unit-button"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="unit-form">
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor={`unitNumber-${uniqueId}`}>
                                Unit Number <span className="required">*</span>
                              </label>
                              <input
                                id={`unitNumber-${uniqueId}`}
                                type="text"
                                value={unit.unitNumber}
                                onChange={(e) => updateUnit(actualUnitIndex, 'unitNumber', e.target.value)}
                                placeholder="e.g., 1A, 2B"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor={`type-${uniqueId}`}>
                                Unit Type <span className="required">*</span>
                              </label>
                              <select
                                id={`type-${uniqueId}`}
                                value={unit.type}
                                onChange={(e) => updateUnit(actualUnitIndex, 'type', e.target.value as UnitType)}
                              >
                                <option value={UnitType.Apartment}>Apartment</option>
                                <option value={UnitType.Office}>Office</option>
                                <option value={UnitType.Garden}>Garden</option>
                                <option value={UnitType.Parking}>Parking</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor={`floor-${uniqueId}`}>Floor</label>
                              <input
                                id={`floor-${uniqueId}`}
                                type="text"
                                value={unit.floor || ''}
                                onChange={(e) => updateUnit(actualUnitIndex, 'floor', e.target.value)}
                                placeholder="e.g., 1, 2, Ground"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor={`entrance-${uniqueId}`}>Entrance</label>
                              <input
                                id={`entrance-${uniqueId}`}
                                type="text"
                                value={unit.entrance || ''}
                                onChange={(e) => updateUnit(actualUnitIndex, 'entrance', e.target.value)}
                                placeholder="e.g., A, B, Main"
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor={`sizeSqm-${uniqueId}`}>
                                Size (m²) <span className="required">*</span>
                              </label>
                              <input
                                id={`sizeSqm-${uniqueId}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={unit.sizeSqm || ''}
                                onChange={(e) => updateUnit(actualUnitIndex, 'sizeSqm', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor={`coOwnershipShare-${uniqueId}`}>
                                Co-ownership Share <span className="required">*</span>
                              </label>
                              <input
                                id={`coOwnershipShare-${uniqueId}`}
                                type="number"
                                step="0.001"
                                min="0"
                                max="1"
                                value={unit.coOwnershipShare || ''}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  updateUnit(actualUnitIndex, 'coOwnershipShare', isNaN(value) ? 0 : value);
                                }}
                                placeholder="0.000"
                              />
                              <span className="field-hint">Value between 0 and 1 (inclusive)</span>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor={`constructionYear-${uniqueId}`}>Construction Year</label>
                              <input
                                id={`constructionYear-${uniqueId}`}
                                type="number"
                                min="1800"
                                max={new Date().getFullYear()}
                                value={unit.constructionYear || ''}
                                onChange={(e) => updateUnit(actualUnitIndex, 'constructionYear', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="e.g., 2020"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor={`rooms-${uniqueId}`}>Number of Rooms</label>
                              <input
                                id={`rooms-${uniqueId}`}
                                type="number"
                                min="0"
                                value={unit.rooms || ''}
                                onChange={(e) => updateUnit(actualUnitIndex, 'rooms', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="e.g., 3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Step3Units;
