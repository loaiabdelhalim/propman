import React from 'react';
import { Property } from '../../types/property';
import './PropertiesList.css';

interface PropertiesListProps {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  onPropertyClick?: (propertyId: string) => void;
}

const PropertiesList = ({ properties, isLoading, error, onPropertyClick }: PropertiesListProps) => {
  if (isLoading) {
    return <div className="properties-list-loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="properties-list-error">Error: {error}</div>;
  }

  if (properties.length === 0) {
    return <div className="properties-list-empty">No properties found. Create your first property!</div>;
  }

  return (
    <div className="properties-list">
      <h2>Properties</h2>
      <table className="properties-table">
        <thead>
          <tr>
            <th>Unique Number</th>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr 
              key={property.id}
              onClick={() => onPropertyClick?.(property.id)}
            >
              <td className="property-id">{property.uniqueNumber}</td>
              <td className="property-name">{property.name}</td>
              <td className="property-type">
                <span className={`type-badge type-${property.managementType.toLowerCase()}`}>
                  {property.managementType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesList;
