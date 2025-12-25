import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Property Management System/i);
  expect(headerElement).toBeInTheDocument();
});
