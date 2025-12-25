import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { apiService } from './services/api';

jest.mock('./services/api', () => ({
  apiService: {
    getProperties: jest.fn(),
    createProperty: jest.fn(),
    createBuilding: jest.fn(),
    createUnitsBulk: jest.fn(),
    getPropertyById: jest.fn(),
  },
}));

const mockApi = apiService as unknown as any;

describe('App integration - full create flow', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('creates a property via wizard and refreshes list', async () => {
    // Mock initial properties empty
    mockApi.getProperties.mockResolvedValue([]);

    // Mock API calls for create flow
    const createdProperty = { id: 'prop-1', uniqueNumber: 'MV00001', name: 'New Prop', managementType: 'MV' };
    mockApi.createProperty.mockResolvedValue(createdProperty);

    const createdBuilding = { id: 'b1', propertyId: 'prop-1', address: { street: 'Main', houseNumber: '10' } };
    mockApi.createBuilding.mockResolvedValue(createdBuilding);

    mockApi.createUnitsBulk.mockResolvedValue({ count: 1, units: [{ id: 'u1' }] });

    // After creation, getProperties should return the new property
    mockApi.getProperties.mockResolvedValueOnce([]).mockResolvedValueOnce([createdProperty]);

    render(<App />);

    // Wait for initial fetch
    await waitFor(() => expect(mockApi.getProperties).toHaveBeenCalled());

    // Open wizard
    const createButton = screen.getByText(/\+ Create New Property/i);
    await userEvent.click(createButton);

    // Fill step 1
    await userEvent.type(screen.getByLabelText(/Property Name/i), 'New Prop');
    await userEvent.type(screen.getByLabelText(/Property Manager ID/i), 'pm1');
    await userEvent.type(screen.getByLabelText(/Accountant ID/i), 'acc1');

    // Next
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Add building
    await userEvent.click(screen.getByRole('button', { name: /\+ Add Building/i }));
    await userEvent.type(screen.getByLabelText(/Street/i), 'Main');
    await userEvent.type(screen.getByLabelText(/House Number/i), '10');

    // Next
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Add unit
    const addUnitButtons = screen.getAllByRole('button', { name: /\+ Add Unit/i });
    await userEvent.click(addUnitButtons[0]);
    await userEvent.type(screen.getByLabelText(/Unit Number/i), '101');
    await userEvent.clear(screen.getByLabelText(/Size \(m²\)/i));
    await userEvent.type(screen.getByLabelText(/Size \(m²\)/i), '50');
    await userEvent.clear(screen.getByLabelText(/Co-ownership Share/i));
    await userEvent.type(screen.getByLabelText(/Co-ownership Share/i), '0.25');

    // Create property (submit)
    await userEvent.click(screen.getByRole('button', { name: /Create Property/i }));

    // Ensure API create methods were called
    await waitFor(() => expect(mockApi.createProperty).toHaveBeenCalled());
    await waitFor(() => expect(mockApi.createBuilding).toHaveBeenCalled());
    await waitFor(() => expect(mockApi.createUnitsBulk).toHaveBeenCalled());

    // After completion, the properties list should refresh and show the new property
    await waitFor(() => expect(mockApi.getProperties).toHaveBeenCalledTimes(2));
    expect(screen.getByText('New Prop')).toBeInTheDocument();
  });
});

