import React, { useState } from 'react';
import { changeUserType } from '../../lib/api';
import { useNotifications } from '../../lib/notificationContext';

interface User {
  _id: string;
  uid: number;
  username: string;
  name: string;
  email: string;
  role?: string;
  userType?: string;
}

interface ChangeUserTypeModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentAdminId: number;
}

const ChangeUserTypeModal: React.FC<ChangeUserTypeModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
  currentAdminId
}) => {
  const { addNotification } = useNotifications();
  const [newUserType, setNewUserType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userTypes = [
    { value: 'user', label: 'User', description: 'Regular user with basic access' },
    { value: 'admin', label: 'Admin', description: 'Full administrative access' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newUserType) {
      setError('Please select a user type');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await changeUserType(user.uid, newUserType, currentAdminId);

      if (result.success) {
        addNotification({
          title: 'User Type Changed',
          message: `Successfully changed ${user.name}'s user type to ${newUserType}`,
          type: 'success'
        });
        
        onSuccess();
        onClose();
        setNewUserType('');
      } else {
        setError(result.message || 'Failed to change user type');
        addNotification({
          title: 'Change Failed',
          message: result.message || 'Failed to change user type',
          type: 'error'
        });
      }
    } catch {
      setError('An unexpected error occurred');
      addNotification({
        title: 'Change Failed',
        message: 'An unexpected error occurred while changing user type',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewUserType('');
    setError(null);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Change User Type
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-xs text-gray-400">ID: #{user.uid}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current Type:</span> {user.userType || user.role || 'User'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New User Type
              </label>
              <div className="space-y-2">
                {userTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      newUserType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={newUserType === type.value}
                      onChange={(e) => setNewUserType(e.target.value)}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                        {type.value === 'admin' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 text-red-600 bg-red-100 border border-red-200 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !newUserType}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing...
                  </div>
                ) : (
                  'Change Type'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserTypeModal; 