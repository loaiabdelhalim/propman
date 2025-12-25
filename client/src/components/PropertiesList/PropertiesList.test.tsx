import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertiesList from './PropertiesList';
import { ManagementType } from '../../types/property';

describe('PropertiesList', () => {
  test('renders loading state', () => {
    render(<PropertiesList properties={[]} isLoading={true} error={null} />);
    expect(screen.getByText(/Loading properties.../i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    render(<PropertiesList properties={[]} isLoading={false} error={'Boom'} />);
    expect(screen.getByText(/Error: Boom/)).toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(<PropertiesList properties={[]} isLoading={false} error={null} />);
    expect(screen.getByText(/No properties found/)).toBeInTheDocument();
  });

  test('renders properties and handles click', () => {
    const props = [
      { id: '1', uniqueNumber: 'MV00001', name: 'P1', managementType: ManagementType.MV },
    ];
    const onClick = jest.fn();
    render(<PropertiesList properties={props as any} isLoading={false} error={null} onPropertyClick={onClick} />);

    expect(screen.getByText('P1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('P1'));
    expect(onClick).toHaveBeenCalledWith('1');
  });
});

