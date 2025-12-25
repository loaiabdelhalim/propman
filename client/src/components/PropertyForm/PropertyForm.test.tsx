import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyForm from './PropertyForm';
import { ManagementType } from '../../types/property';

describe('PropertyForm', () => {
  test('validates required fields and calls onSubmit', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onCancel = jest.fn();

    render(<PropertyForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Submit with empty form should show validation errors
    fireEvent.click(screen.getByText(/Create Property/i));
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Property Manager ID is required/)).toBeInTheDocument();
    expect(screen.getByText(/Accountant ID is required/)).toBeInTheDocument();

    // Fill fields and submit
    fireEvent.change(screen.getByLabelText(/Property Name/i), { target: { value: 'Test Prop' } });
    fireEvent.change(screen.getByLabelText(/Property Manager ID/i), { target: { value: 'pm1' } });
    fireEvent.change(screen.getByLabelText(/Accountant ID/i), { target: { value: 'acc1' } });

    fireEvent.click(screen.getByText(/Create Property/i));

    // onSubmit should be called once
    await Promise.resolve();
    expect(onSubmit).toHaveBeenCalled();
  });

  test('calls onCancel when clicking cancel', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    render(<PropertyForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(onCancel).toHaveBeenCalled();
  });
});

