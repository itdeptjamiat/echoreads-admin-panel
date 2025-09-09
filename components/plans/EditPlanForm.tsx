import React, { useState } from 'react';
import { Plan, updatePlan } from '../../lib/api';
import { useNotifications } from '../../lib/notificationContext';

interface EditPlanFormProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPlanForm: React.FC<EditPlanFormProps> = ({ plan, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    planType: plan.planType,
    price: plan.price,
    currency: plan.currency || 'USD',
    duration: plan.duration || 30,
    description: plan.description || '',
    discountPercentage: plan.discountPercentage || 0,
    discountValidUntil: plan.discountValidUntil ? new Date(plan.discountValidUntil).toISOString().split('T')[0] : '',
    maxDownloads: plan.maxDownloads || 0,
    maxMagazines: plan.maxMagazines || 0,
    isActive: plan.isActive !== false
  });

  const [features, setFeatures] = useState<string[]>(plan.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { addNotification } = useNotifications();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs properly
    let processedValue: string | number | boolean = value;
    if (['price', 'duration', 'discountPercentage', 'maxDownloads', 'maxMagazines'].includes(name)) {
      processedValue = value === '' ? 0 : Number(value);
      // Allow -1 for "no access", but ensure other values are non-negative
      if (processedValue < -1) processedValue = -1;
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (error) setError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        features,
        discountValidUntil: formData.discountValidUntil ? new Date(formData.discountValidUntil).toISOString() : undefined
      };

      const result = await updatePlan(plan.planType, updateData);

      if (result.success) {
        addNotification({
          title: 'Success',
          message: 'Plan updated successfully',
          type: 'success'
        });
        onSuccess();
        onClose();
      } else {
        setError(result.message || 'Failed to update plan');
        addNotification({
          title: 'Error',
          message: result.message || 'Failed to update plan',
          type: 'error'
        });
      }
    } catch {
      setError('An unexpected error occurred');
      addNotification({
        title: 'Error',
        message: 'An unexpected error occurred',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

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

          {/* Plan Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Type
            </label>
            <select
              name="planType"
              value={formData.planType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled
            >
              <option value="free">Free</option>
              <option value="echopro">EchoPro</option>
              <option value="echoproplus">EchoPro Plus</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Plan type cannot be changed</p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onWheel={(e) => e.currentTarget.blur()}
                min="0"
                step="0.01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            {formData.discountPercentage > 0 && formData.price > 0 && (
              <p className="mt-1 text-xs text-green-600">
                Final price: ${discountedPrice.toFixed(2)} (after {formData.discountPercentage}% discount)
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              onWheel={(e) => e.currentTarget.blur()}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter plan description..."
            />
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Downloads
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="maxDownloads"
                  value={formData.maxDownloads}
                  onChange={handleInputChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="-1"
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="-1 for no access, 0 for unlimited"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Magazines
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="maxMagazines"
                  value={formData.maxMagazines}
                  onChange={handleInputChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="-1"
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="-1 for no access, 0 for unlimited"
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

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                onWheel={(e) => e.currentTarget.blur()}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Valid Until
              </label>
              <input
                type="date"
                name="discountValidUntil"
                value={formData.discountValidUntil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Plan is active
            </label>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanForm; 