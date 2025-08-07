import React, { useState } from 'react';

interface BulkFeatureManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeatures: (features: string[]) => void;
  existingFeatures?: string[];
}

const BulkFeatureManager: React.FC<BulkFeatureManagerProps> = ({
  isOpen,
  onClose,
  onAddFeatures,
  existingFeatures = []
}) => {
  const [bulkText, setBulkText] = useState('');

  const [previewFeatures, setPreviewFeatures] = useState<string[]>([]);

  const handleBulkTextChange = (text: string) => {
    setBulkText(text);
    // Parse features from text (one per line)
    const features = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove common prefixes like "- ", "* ", "• ", etc.
        return line.replace(/^[-*•\s]+/, '');
      });
    setPreviewFeatures(features);
  };

  const handleAddFeatures = () => {
    if (previewFeatures.length > 0) {
      onAddFeatures(previewFeatures);
      setBulkText('');
      setPreviewFeatures([]);
      onClose();
    }
  };

  const predefinedFeatures = [
    'Unlimited downloads',
    'Premium magazine access',
    'Ad-free reading experience',
    'Advanced search filters',
    'Personalized recommendations',
    'Family sharing (up to 5 users)',
    'Offline reading',
    'Multiple device sync',
    'Priority customer support',
    'Early access to new features',
    'Full archive access',
    'Interactive features',
    'Reading analytics',
    'Custom reading lists',
    'Export highlights and notes',
    'Access to free magazines',
    'Basic reading interface',
    'Email support',
    'Web and mobile access',
    'Standard content library',
    'Regular updates',
    'Community features',
    'Newsletter subscription'
  ];

  const addPredefinedFeature = (feature: string) => {
    if (!previewFeatures.includes(feature) && !existingFeatures.includes(feature)) {
      setPreviewFeatures([...previewFeatures, feature]);
      setBulkText(prev => prev + (prev ? '\n' : '') + feature);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Bulk Feature Manager</h3>
              <p className="text-blue-100 mt-1">Add multiple features at once</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bulk Input Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bulk Feature Input
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => handleBulkTextChange(e.target.value)}
                placeholder={`Enter features, one per line:
• Feature 1
• Feature 2
• Feature 3`}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
                              <p className="text-sm text-gray-500 mt-2">
                  Enter one feature per line. You can use bullet points (•, -, *) - they&apos;ll be automatically removed.
                </p>
            </div>

            {/* Predefined Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Add Predefined Features
              </label>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
              {predefinedFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => addPredefinedFeature(feature)}
                  disabled={previewFeatures.includes(feature) || existingFeatures.includes(feature)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    previewFeatures.includes(feature) || existingFeatures.includes(feature)
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{feature}</span>
                    {previewFeatures.includes(feature) && (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {existingFeatures.includes(feature) && (
                      <span className="text-xs text-gray-500">Already exists</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            </div>
          </div>

          {/* Preview Section */}
          {previewFeatures.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preview ({previewFeatures.length} features)
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-2">
                  {previewFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        onClick={() => {
                          const newFeatures = previewFeatures.filter((_, i) => i !== index);
                          setPreviewFeatures(newFeatures);
                          setBulkText(newFeatures.join('\n'));
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFeatures}
              disabled={previewFeatures.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Add {previewFeatures.length} Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFeatureManager; 