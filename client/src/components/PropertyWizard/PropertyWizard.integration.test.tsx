import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyWizard from './PropertyWizard';
import { PropertyWizardData, ManagementType, UnitType } from '../../types/property';

describe('PropertyWizard integration', () => {
  test('navigates through steps and calls onComplete with collected data', async () => {
    const onComplete = jest.fn().mockResolvedValue(undefined);
    const onCancel = jest.fn();

    render(<PropertyWizard onComplete={onComplete} onCancel={onCancel} />);

    // Step 1: fill required fields
    const nameInput = screen.getByLabelText(/Property Name/i);
    const managerInput = screen.getByLabelText(/Property Manager ID/i);
    const accountantInput = screen.getByLabelText(/Accountant ID/i);

    await userEvent.type(nameInput, 'Integration Property');
    await userEvent.type(managerInput, 'manager-123');
    await userEvent.type(accountantInput, 'accountant-456');

    // Next button should be enabled
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).toBeEnabled();
    await userEvent.click(nextButton);

    // Step 2: no buildings yet, add one
    expect(screen.getByText(/Building Information/i)).toBeInTheDocument();
    const addBuildingButton = screen.getByRole('button', { name: /\+ Add Building/i });
    await userEvent.click(addBuildingButton);

    // Fill building address
    const streetInput = screen.getByLabelText(/Street/i);
    const houseNumberInput = screen.getByLabelText(/House Number/i);
    await userEvent.type(streetInput, 'Main St');
    await userEvent.type(houseNumberInput, '10');

    // Next to step 3
    await userEvent.click(nextButton);

    // Step 3: add unit for the building
    expect(screen.getByText(/Units Information/i)).toBeInTheDocument();
    const addUnitButtons = screen.getAllByRole('button', { name: /\+ Add Unit/i });
    // Click add unit for the first building section
    await userEvent.click(addUnitButtons[0]);

    // Fill unit fields
    const unitNumberInput = screen.getByLabelText(/Unit Number/i);
    const sizeInput = screen.getByLabelText(/Size \(m²\)/i);
    const coShareInput = screen.getByLabelText(/Co-ownership Share/i);

    await userEvent.type(unitNumberInput, '101');
    await userEvent.clear(sizeInput);
    await userEvent.type(sizeInput, '45.5');
    await userEvent.clear(coShareInput);
    await userEvent.type(coShareInput, '0.345');

    // Submit (Create Property) button should be enabled
    const createButton = screen.getByRole('button', { name: /Create Property/i });
    expect(createButton).toBeEnabled();

    await userEvent.click(createButton);

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));

    const calledWith = (onComplete.mock.calls[0][0] as PropertyWizardData);
    expect(calledWith.name).toBe('Integration Property');
    expect(calledWith.buildings.length).toBe(1);
    expect(calledWith.units.length).toBe(1);
    expect(calledWith.units[0].unitNumber).toBe('101');
  });
});

