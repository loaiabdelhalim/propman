import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step1GeneralInfo from './Step1GeneralInfo';
import { apiService } from '../../services/api';
import { PropertyWizardData, ManagementType } from '../../types/property';

jest.mock('../../services/api', () => ({
  apiService: {
    uploadFileForParse: jest.fn(),
  },
}));

const mockApi = apiService as unknown as { uploadFileForParse: jest.Mock };

describe('Step1GeneralInfo', () => {
  const baseData: PropertyWizardData = {
    managementType: ManagementType.WEG,
    name: '',
    propertyManagerId: '',
    accountantId: '',
    declarationFile: undefined,
    buildings: [],
    units: [],
  };

  test('renders basic fields and shows error for invalid file type (does not call onChange)', async () => {
    const handleChange = jest.fn();
    render(<Step1GeneralInfo data={baseData} onChange={handleChange} />);

    expect(screen.getByLabelText(/Management Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Name/i)).toBeInTheDocument();
    const fileInput = screen.getByLabelText(/Declaration of Division/i) as HTMLInputElement;
    // file input should exist
    expect(fileInput).toBeInTheDocument();

    // Simulate selecting an invalid file type
    const invalidFile = new File(['(⌐□_□)'], 'chucknorris.txt', { type: 'text/plain' });
    Object.defineProperty(invalidFile, 'size', { value: 1024 });

    await userEvent.upload(fileInput, invalidFile);

    // onChange should NOT be called for invalid type
    await waitFor(() => expect(handleChange).not.toHaveBeenCalled());
    expect(screen.getByText(/Please upload a PDF or image file/i)).toBeInTheDocument();
  });

  test('calls apiService.uploadFileForParse for PDF and applies parsed data', async () => {
    const handleChange = jest.fn();
    const parsed = { buildings: [{ address: { street: 'Main', houseNumber: '1' } }], units: [{ buildingIndex: 0, unitNumber: '101', type: 'Apartment', sizeSqm: 50, coOwnershipShare: 0.5 }] };
    mockApi.uploadFileForParse.mockResolvedValue({ parsed });

    render(<Step1GeneralInfo data={baseData} onChange={handleChange} />);

    const fileInput = screen.getByLabelText(/Declaration of Division/i) as HTMLInputElement;
    const pdfFile = new File(['%PDF-1.4'], 'doc.pdf', { type: 'application/pdf' });
    Object.defineProperty(pdfFile, 'size', { value: 1024 });

    await userEvent.upload(fileInput, pdfFile);

    // First onChange call should be with declarationFile
    await waitFor(() => expect(handleChange).toHaveBeenCalledWith({ declarationFile: pdfFile }));

    // Wait for parsing to complete and for parsed data to be applied in a single call
    await waitFor(() => expect(mockApi.uploadFileForParse).toHaveBeenCalled());
    await waitFor(() => expect(handleChange).toHaveBeenCalledWith({ buildings: parsed.buildings, units: parsed.units }));
  });

  test('shows error for file too large (does not call onChange)', async () => {
    const handleChange = jest.fn();
    render(<Step1GeneralInfo data={baseData} onChange={handleChange} />);

    const fileInput = screen.getByLabelText(/Declaration of Division/i) as HTMLInputElement;
    // Create large file > 10MB (simulate by size property)
    const largeFile = new File(['a'.repeat(1024 * 1024)], 'big.pdf', { type: 'application/pdf' });

    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

    await userEvent.upload(fileInput, largeFile);

    // onChange should NOT be called for too large files
    await waitFor(() => expect(handleChange).not.toHaveBeenCalled());
    expect(screen.getByText(/File size must be less than 10MB/)).toBeInTheDocument();
  });
});
