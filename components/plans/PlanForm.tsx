import React, { useState, FormEvent, ChangeEvent } from 'react';
import { createPlan, Plan } from '../../lib/api';
import { useNotifications } from '../../lib/notificationContext';

interface PlanFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const planTypes = [
  { value: 'free', label: 'Free Plan' },
  { value: 'echopro', label: 'EchoPro' },
  { value: 'echoproplus', label: 'EchoPro Plus' }
];

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' }
];

const PlanForm: React.FC<PlanFormProps> = ({ onSuccess, onCancel }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    planType: 'free' as 'free' | 'echopro' | 'echoproplus',
    price: 0,
    currency: 'USD',
    duration: 1,
    description: '',
    discountPercentage: 0,
    discountValidUntil: '',
    maxDownloads: 0,
    maxMagazines: 0
  });
  const [features, setFeatures] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs properly
    let processedValue: string | number = value;
    if (['price', 'duration', 'discountPercentage', 'maxDownloads', 'maxMagazines'].includes(name)) {
      processedValue = value === '' ? 0 : Number(value);
      // Allow -1 for "no access", but ensure other values are non-negative
      if (processedValue < -1) processedValue = -1;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Reset price to 0 for free plan
    if (name === 'planType' && value === 'free') {
      setFormData(prev => ({ ...prev, price: 0 }));
    }

    if (error) setError('');
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  const validateForm = (): boolean => {
    // Validate required fields
    if (!formData.planType) {
      setError('Plan type is required');
      return false;
    }

    // Validate price for free plan
    if (formData.planType === 'free' && formData.price !== 0) {
      setError('Free plan must have price set to 0');
      return false;
    }

    // Validate price for paid plans
    if (formData.planType !== 'free' && formData.price <= 0) {
      setError('Paid plans must have a price greater than 0');
      return false;
    }

    // Validate discount percentage
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      setError('Discount percentage must be between 0 and 100');
      return false;
    }

    // Validate numeric fields
    if (formData.maxDownloads < -1) {
      setError('Max downloads cannot be less than -1');
      return false;
    }

    if (formData.maxMagazines < -1) {
      setError('Max magazines cannot be less than -1');
      return false;
    }

    if (formData.duration < 1) {
      setError('Duration must be at least 1');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Filter out empty features
      const filteredFeatures = features.filter(feature => feature.trim() !== '');

      const planData: Plan = {
        planType: formData.planType,
        price: Number(formData.price),
        currency: formData.currency,
        duration: Number(formData.duration),
        features: filteredFeatures,
        maxDownloads: Number(formData.maxDownloads),
        maxMagazines: Number(formData.maxMagazines),
        description: formData.description,
        discountPercentage: Number(formData.discountPercentage),
        discountValidUntil: formData.discountValidUntil || undefined
      };

      // Debug logging
      

      const result = await createPlan(planData);
      
      if (result.success) {
        // Add notification for successful plan creation
        addNotification({
          title: 'Plan Created Successfully',
          message: `${formData.planType} plan has been created`,
          type: 'success',
          action: {
            label: 'View Plans',
            href: '/plans'
          }
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.message || 'Failed to create plan');
        addNotification({
          title: 'Plan Creation Failed',
          message: result.message || 'Failed to create plan. Please try again.',
          type: 'error'
        });
      }
    } catch {
      setError('An unexpected error occurred');
      addNotification({
        title: 'Plan Creation Failed',
        message: 'Failed to create plan. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate discounted price for display
  const calculateDiscountedPrice = () => {
    if (formData.discountPercentage > 0 && formData.price > 0) {
      return formData.price * (1 - formData.discountPercentage / 100);
    }
    return formData.price;
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Create New Plan</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan Type */}
              <div>
                <label htmlFor="planType" className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Type *
                </label>
                <select
                  id="planType"
                  name="planType"
                  value={formData.planType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  {planTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="0"
                  step="0.01"
                  disabled={formData.planType === 'free'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="0.00"
                  required
                />
                {formData.planType === 'free' && (
                  <p className="mt-1 text-xs text-gray-500">Free plans must have price set to 0</p>
                )}
                {formData.discountPercentage > 0 && formData.price > 0 && (
                  <p className="mt-1 text-xs text-green-600">
                    Final price: ${discountedPrice.toFixed(2)} (after {formData.discountPercentage}% discount)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Currency */}
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (months)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="1"
                />
              </div>

              {/* Discount Percentage */}
              <div>
                <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter plan description"
              />
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Usage Limits</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max Downloads */}
              <div>
                <label htmlFor="maxDownloads" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Downloads
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="maxDownloads"
                    name="maxDownloads"
                    value={formData.maxDownloads}
                    onChange={handleInputChange}
                    onWheel={(e) => e.currentTarget.blur()}
                    min="-1"
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="-1 (no access), 0 (unlimited), or number"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(-1, (formData.maxDownloads || 0) + 1);
                        setFormData(prev => ({ ...prev, maxDownloads: newValue }));
                      }}
                      className="flex-1 px-2 border-l border-gray-300 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(-1, (formData.maxDownloads || 0) - 1);
                        setFormData(prev => ({ ...prev, maxDownloads: newValue }));
                      }}
                      className="flex-1 px-2 border-l border-gray-300 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  -1 = No access, 0 = Unlimited, 1+ = Limited to that number
                </p>
              </div>

              {/* Max Magazines */}
              <div>
                <label htmlFor="maxMagazines" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Magazines
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="maxMagazines"
                    name="maxMagazines"
                    value={formData.maxMagazines}
                    onChange={handleInputChange}
                    onWheel={(e) => e.currentTarget.blur()}
                    min="-1"
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="-1 (no access), 0 (unlimited), or number"
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(-1, (formData.maxMagazines || 0) + 1);
                        setFormData(prev => ({ ...prev, maxMagazines: newValue }));
                      }}
                      className="flex-1 px-2 border-l border-gray-300 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = Math.max(-1, (formData.maxMagazines || 0) - 1);
                        setFormData(prev => ({ ...prev, maxMagazines: newValue }));
                      }}
                      className="flex-1 px-2 border-l border-gray-300 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  -1 = No access, 0 = Unlimited, 1+ = Limited to that number
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h4 className="text-md font-medium text-gray-900">Features</h4>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Feature
              </button>
            </div>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter feature description"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discount Valid Until */}
          {formData.discountPercentage > 0 && (
            <div>
              <label htmlFor="discountValidUntil" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Valid Until
              </label>
              <input
                type="datetime-local"
                id="discountValidUntil"
                name="discountValidUntil"
                value={formData.discountValidUntil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                'Create Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm; 