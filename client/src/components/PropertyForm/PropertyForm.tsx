import React, { useState } from 'react';
import { ManagementType, CreatePropertyInput } from '../../types/property';
import './PropertyForm.css';

interface PropertyFormProps {
  onSubmit: (data: CreatePropertyInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PropertyForm = ({ onSubmit, onCancel, isLoading = false }: PropertyFormProps) => {
  const [formData, setFormData] = useState<CreatePropertyInput>({
    name: '',
    managementType: ManagementType.WEG,
    propertyManagerId: '',
    accountantId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePropertyInput, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePropertyInput, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.propertyManagerId.trim()) {
      newErrors.propertyManagerId = 'Property Manager ID is required';
    }

    if (!formData.accountantId.trim()) {
      newErrors.accountantId = 'Accountant ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field: keyof CreatePropertyInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="property-form-overlay" onClick={onCancel}>
      <div className="property-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="property-form-header">
          <h2>Create New Property</h2>
          <button className="close-button" onClick={onCancel} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-group">
            <label htmlFor="name">
              Property Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="managementType">
              Management Type <span className="required">*</span>
            </label>
            <select
              id="managementType"
              value={formData.managementType}
              onChange={(e) => handleChange('managementType', e.target.value as ManagementType)}
              disabled={isLoading}
            >
              <option value={ManagementType.WEG}>WEG</option>
              <option value={ManagementType.MV}>MV</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="propertyManagerId">
              Property Manager ID <span className="required">*</span>
            </label>
            <input
              id="propertyManagerId"
              type="text"
              value={formData.propertyManagerId}
              onChange={(e) => handleChange('propertyManagerId', e.target.value)}
              className={errors.propertyManagerId ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter manager UUID"
            />
            {errors.propertyManagerId && (
              <span className="error-message">{errors.propertyManagerId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountantId">
              Accountant ID <span className="required">*</span>
            </label>
            <input
              id="accountantId"
              type="text"
              value={formData.accountantId}
              onChange={(e) => handleChange('accountantId', e.target.value)}
              className={errors.accountantId ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter accountant UUID"
            />
            {errors.accountantId && <span className="error-message">{errors.accountantId}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
