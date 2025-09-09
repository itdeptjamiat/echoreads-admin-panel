import React, { useState } from 'react';
import { deletePlan, extractUserIdFromToken } from '../../lib/api';
import { useNotifications } from '../../lib/notificationContext';
import { useAuth } from '../../lib/authContext';

interface DeletePlanModalProps {
  plan: {
    planType: string;
    price: number;
    currency?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const DeletePlanModal: React.FC<DeletePlanModalProps> = ({ plan, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Get admin UID from JWT token first (most reliable)
      let uid = extractUserIdFromToken();
      
      // Fallback: try to get from auth context if JWT extraction fails
      if (!uid) {
        uid = user?.id || null;
      }
      

      
      if (!uid) {
        addNotification({
          title: 'Error',
          message: 'User ID not found. Please login again.',
          type: 'error'
        });
        return;
      }

      const result = await deletePlan(plan.planType, uid);
      
      if (result.success) {
        addNotification({
          title: 'Success',
          message: result.message || 'Plan deleted successfully',
          type: 'success'
        });
        onSuccess();
        onClose();
      } else {
        addNotification({
          title: 'Error',
          message: result.message || 'Failed to delete plan',
          type: 'error'
        });
      }
    } catch {
      addNotification({
        title: 'Error',
        message: 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Plan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to delete this plan?
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Plan Details:</p>
            <p className="font-medium text-gray-900">
              {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} Plan
            </p>
            <p className="text-sm text-gray-600">
              {formatPrice(plan.price, plan.currency || 'USD')}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            This action cannot be undone. All data associated with this plan will be permanently deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </div>
            ) : (
              'Delete Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlanModal; 