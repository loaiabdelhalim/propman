export enum ManagementType {
  WEG = 'WEG',
  MV = 'MV',
}

export enum UnitType {
  Apartment = 'Apartment',
  Office = 'Office',
  Garden = 'Garden',
  Parking = 'Parking',
}

export interface Property {
  id: string;
  uniqueNumber: string;
  name: string;
  managementType: ManagementType;
  propertyManagerId?: string;
  accountantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePropertyInput {
  name: string;
  managementType: ManagementType;
  propertyManagerId: string;
  accountantId: string;
  declarationOfDivision?: {
    fileId: string;
    uploadedAt: string;
    aiExtracted: boolean;
  };
}

export interface Address {
  street: string;
  houseNumber: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export interface CreateBuildingInput {
  propertyId: string;
  address: Address;
  additionalDetails?: string;
}

export interface Building {
  id: string;
  propertyId: string;
  address: Address;
  additionalDetails?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitInput {
  buildingId: string;
  unitNumber: string;
  type: UnitType;
  floor?: string;
  entrance?: string;
  sizeSqm: number;
  coOwnershipShare: number;
  constructionYear?: number;
  rooms?: number;
}

export interface Unit {
  id: string;
  buildingId: string;
  unitNumber: string;
  type: UnitType;
  floor?: string;
  entrance?: string;
  sizeSqm: number;
  coOwnershipShare: number;
  constructionYear?: number;
  rooms?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyWizardData {
  // Step 1
  managementType: ManagementType;
  name: string;
  propertyManagerId: string;
  accountantId: string;
  declarationFile?: File;
  
  // Step 2
  buildings: Array<{
    address: Address;
    additionalDetails?: string;
  }>;
  
  // Step 3
  units: Array<{
    buildingIndex: number;
    unitNumber: string;
    type: UnitType;
    floor?: string;
    entrance?: string;
    sizeSqm: number;
    coOwnershipShare: number;
    constructionYear?: number;
    rooms?: number;
  }>;
}

export interface PropertyWithDetails extends Property {
  declarationOfDivision?: {
    fileId: string;
    uploadedAt: string;
    aiExtracted: boolean;
  };
  buildings: Array<Building & {
    units: Unit[];
  }>;
}
