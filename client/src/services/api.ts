import { Address, CreateBuildingInput, CreateUnitInput, Building, Unit, Property, PropertyWithDetails } from '../types/property';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Properties
  async getProperties() {
    return this.request<Array<{ id: string; uniqueNumber: string; name: string; managementType: 'WEG' | 'MV' }>>('/properties');
  }

  async getPropertyById(id: string) {
    return this.request<PropertyWithDetails>(`/properties/${id}`);
  }

  async createProperty(data: {
    name: string;
    managementType: string;
    propertyManagerId: string;
    accountantId: string;
    declarationOfDivision?: {
      fileId: string;
      uploadedAt: string;
      aiExtracted: boolean;
    };
  }): Promise<Property> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Buildings
  async createBuilding(data: CreateBuildingInput): Promise<Building> {
    return this.request<Building>('/buildings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Units
  async createUnitsBulk(data: {
    buildingId: string;
    units: Omit<CreateUnitInput, 'buildingId'>[];
  }): Promise<{ count: number; units: Unit[] }> {
    return this.request<{ count: number; units: Unit[] }>('/units/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload a PDF file to the backend for AI parsing
  async uploadFileForParse(file: File): Promise<any> {
    const url = `${API_BASE_URL}/ai/parse-file`;
    const form = new FormData();
    form.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
