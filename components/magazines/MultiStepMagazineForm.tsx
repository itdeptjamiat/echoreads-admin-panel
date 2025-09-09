import React, { useState, useEffect } from 'react';
import MagazineForm from './MagazineForm';
import PDFImagesUpload from './PDFImagesUpload';

interface MultiStepMagazineFormProps {
  onCancel?: () => void;
}

const MultiStepMagazineForm: React.FC<MultiStepMagazineFormProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [magazineId, setMagazineId] = useState<string | null>(null);
  const [magazineData, setMagazineData] = useState<Record<string, unknown> | null>(null);

  // Listen for magazine creation success
  useEffect(() => {
    const handleMagazineCreated = (event: CustomEvent) => {
      const { magazineId: mid, magazineData: data } = event.detail;
      if (mid && data) {
        setMagazineData(data);
        setMagazineId(String(mid));
        setCurrentStep(2);
      }
    };

    // Add event listener for magazine creation success
    window.addEventListener('magazine-created', handleMagazineCreated as EventListener);
    
    return () => {
      window.removeEventListener('magazine-created', handleMagazineCreated as EventListener);
    };
  }, []);

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setMagazineId(null);
    setMagazineData(null);
  };

  const handleComplete = () => {
    // Magazine creation and image upload completed
    if (onCancel) {
      onCancel();
    }
  };

  // Custom submit handler that will dispatch an event when magazine is created
  const handleMagazineSubmit = (formData: Record<string, unknown>) => {
    // The existing MagazineForm will handle the actual submission
    // We'll listen for the success event to get the magazine ID
    console.log('Magazine form submitted:', formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header with Step Indicator */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStep === 1 ? 'Create Magazine' : 'Upload PDF Pages'}
              </h3>
              
              {/* Step Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`w-2 h-0.5 ${
                  currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
            
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Step Description */}
          <p className="text-sm text-gray-600 mt-2">
            {currentStep === 1 
              ? 'Fill in the magazine details and create the magazine'
              : `Upload PDF pages for magazine: ${magazineData?.name || 'Unknown'}`
            }
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStep === 1 ? (
            <MagazineForm 
              onSubmit={handleMagazineSubmit}
              onCancel={onCancel}
              isMultiStep={true}
            />
          ) : (
            <PDFImagesUpload
              magazineId={magazineId!}
              magazineName={magazineData?.name ? String(magazineData.name) : 'Unknown Magazine'}
              onBack={handleBackToStep1}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepMagazineForm;
