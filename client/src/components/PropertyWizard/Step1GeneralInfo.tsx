import React, { useState, useRef } from 'react';
import { PropertyWizardData, ManagementType } from '../../types/property';
import './Step1GeneralInfo.css';
import { apiService } from '../../services/api';

interface Step1GeneralInfoProps {
  data: PropertyWizardData;
  onChange: (data: Partial<PropertyWizardData>) => void;
}

const Step1GeneralInfo = ({ data, onChange }: Step1GeneralInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      // Validate file type (PDF, images, etc.)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFileError('Please upload a PDF or image file (PDF, JPG, PNG)');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setFileError('File size must be less than 10MB');
        return;
      }

      onChange({ declarationFile: file });

      // For PDFs, upload to backend for text extraction + AI parse
      if (file.type === 'application/pdf') {
        (async () => {
          try {
            setIsParsing(true);
            setFileError(null);
            const res = await apiService.uploadFileForParse(file);
            const parsed = res?.parsed;
            if (parsed) {
              const parsedBuildings = Array.isArray(parsed.buildings) ? parsed.buildings : [];
              const parsedUnits = Array.isArray(parsed.units) ? parsed.units : [];
              onChange({ buildings: parsedBuildings, units: parsedUnits });
            } else {
              setFileError('No structured data returned from AI');
            }
          } catch (err: any) {
            console.error('Error parsing PDF:', err);
            setFileError(err?.message || 'Failed to parse PDF');
          } finally {
            setIsParsing(false);
          }
        })();
      }
    }
  };

  const handleRemoveFile = () => {
    onChange({ declarationFile: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="step1-container">
      <h3>General Information</h3>
      <p className="step-description">
        Enter the basic property information. You can optionally upload a Declaration of Division (Teilungserklärung) 
        file to extract property details automatically.
      </p>

      <div className="form-group">
        <label htmlFor="managementType">
          Management Type <span className="required">*</span>
        </label>
        <select
          id="managementType"
          value={data.managementType}
          onChange={(e) => onChange({ managementType: e.target.value as ManagementType })}
        >
          <option value={ManagementType.WEG}>WEG</option>
          <option value={ManagementType.MV}>MV</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="name">
          Property Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter property name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="propertyManagerId">
          Property Manager ID <span className="required">*</span>
        </label>
        <input
          id="propertyManagerId"
          type="text"
          value={data.propertyManagerId}
          onChange={(e) => onChange({ propertyManagerId: e.target.value })}
          placeholder="Enter property manager UUID"
        />
      </div>

      <div className="form-group">
        <label htmlFor="accountantId">
          Accountant ID <span className="required">*</span>
        </label>
        <input
          id="accountantId"
          type="text"
          value={data.accountantId}
          onChange={(e) => onChange({ accountantId: e.target.value })}
          placeholder="Enter accountant UUID"
        />
      </div>

      <div className="form-group">
        <label htmlFor="declarationFile">
          Declaration of Division (Teilungserklärung) <span className="optional">(Optional)</span>
        </label>
        <div className="file-upload-section">
          {!data.declarationFile ? (
            <div className="file-upload-area">
              <input
                ref={fileInputRef}
                id="declarationFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isParsing}
                className="file-input"
              />
              <label htmlFor="declarationFile" className="file-upload-label">
                <span className="upload-icon">📄</span>
                <span>Click to upload or drag and drop</span>
                <span className="file-hint">PDF, JPG, or PNG (max 10MB)</span>
              </label>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{data.declarationFile.name}</span>
                  <span className="file-size">
                    {(data.declarationFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="remove-file-button"
              >
                Remove
              </button>
            </div>
          )}
          {fileError && <div className="error-message">{fileError}</div>}
          {isParsing && (
            <div className="parsing-status">
              <span>Parsing document — this may take a few seconds...</span>
            </div>
          )}
        </div>
        <p className="field-hint">
          Upload the Declaration of Division document. The system may use AI to extract and pre-fill 
          property, building, and unit information.
        </p>
      </div>
    </div>
  );
};

export default Step1GeneralInfo;
