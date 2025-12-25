import React, { useState, useEffect } from 'react';
import './App.css';
import PropertiesList from './components/PropertiesList/PropertiesList';
import PropertyWizard from './components/PropertyWizard/PropertyWizard';
import PropertyDetail from './components/PropertyDetail/PropertyDetail';
import { apiService } from './services/api';
import { Property, ManagementType, PropertyWizardData, PropertyWithDetails } from './types/property';
import Spinner from './components/Spinner/Spinner';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [propertyDetail, setPropertyDetail] = useState<PropertyWithDetails | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getProperties();
      // Map the data to ensure proper type conversion
      const properties: Property[] = data.map(prop => ({
        id: prop.id,
        uniqueNumber: prop.uniqueNumber,
        name: prop.name,
        managementType: prop.managementType as ManagementType,
      }));
      setProperties(properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties().then(r => console.log('Fetched properties'));
  }, []);

  const handlePropertyClick = async (propertyId: string) => {
    try {
      setIsLoadingDetail(true);
      setError(null);
      const property = await apiService.getPropertyById(propertyId);
      setPropertyDetail(property);
      setSelectedPropertyId(propertyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property details');
      console.error('Error fetching property details:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleClosePropertyDetail = () => {
    setPropertyDetail(null);
    setSelectedPropertyId(null);
  };

  const handleCreateProperty = async (wizardData: PropertyWizardData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate building addresses before calling API
      for (let i = 0; i < wizardData.buildings.length; i++) {
        const b = wizardData.buildings[i];
        const addr = b.address || ({} as any);
        if (!addr.street || !addr.houseNumber) {
          setError(`Building ${i + 1} address must include street and houseNumber`);
          setIsSubmitting(false);
          return;
        }
      }

      // Step 1: Create property
      const declarationOfDivision = wizardData.declarationFile
        ? {
            fileId: `file-${Date.now()}`, // In a real app, upload file first and get fileId
            uploadedAt: new Date().toISOString(),
            aiExtracted: false, // Set to true if AI extraction is performed
          }
        : undefined;

      const propertyResponse = await apiService.createProperty({
        name: wizardData.name,
        managementType: wizardData.managementType,
        propertyManagerId: wizardData.propertyManagerId,
        accountantId: wizardData.accountantId,
        declarationOfDivision,
      });

      const propertyId = propertyResponse.id;

      // Step 2: Create buildings
      const buildingPromises = wizardData.buildings.map((building) =>
        apiService.createBuilding({
          propertyId,
          address: building.address,
          additionalDetails: building.additionalDetails,
        })
      );

      const buildings = await Promise.all(buildingPromises);

      // Step 3: Create units in bulk per building
      const unitPromises = buildings.map(async (building, buildingIndex) => {
        const unitsForBuilding = wizardData.units.filter(
          (unit) => unit.buildingIndex === buildingIndex
        );

        if (unitsForBuilding.length > 0) {
          return apiService.createUnitsBulk({
            buildingId: building.id,
            units: unitsForBuilding.map((unit) => ({
              unitNumber: unit.unitNumber,
              type: unit.type,
              floor: unit.floor,
              entrance: unit.entrance,
              sizeSqm: unit.sizeSqm,
              coOwnershipShare: unit.coOwnershipShare,
              constructionYear: unit.constructionYear,
              rooms: unit.rooms,
            })),
          });
        }
        return null;
      });

      await Promise.all(unitPromises);

      setShowCreateWizard(false);
      // Refresh the properties list
      await fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      throw err; // Re-throw to let the wizard handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Property Management System</h1>
        <button 
          className="create-property-button"
          onClick={() => setShowCreateWizard(true)}
        >
          + Create New Property
        </button>
      </header>

      <main className="App-main">
        <PropertiesList 
          properties={properties}
          isLoading={isLoading}
          error={error}
          onPropertyClick={handlePropertyClick}
        />
      </main>

      {showCreateWizard && (
        <PropertyWizard
          onComplete={handleCreateProperty}
          onCancel={() => setShowCreateWizard(false)}
          isLoading={isSubmitting}
        />
      )}

      {isLoadingDetail && !propertyDetail && (
        <div className="detail-loading-overlay">
          <Spinner size={48} />
          <div className="detail-loading-text">Loading property details...</div>
        </div>
      )}

      {propertyDetail && (
        <PropertyDetail
          property={propertyDetail}
          onClose={handleClosePropertyDetail}
        />
      )}
    </div>
  );
}

export default App;
