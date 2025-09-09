import React, { useState, useRef } from 'react';

interface PDFImagesUploadProps {
  magazineId: string;
  magazineName: string;
  onBack: () => void;
  onComplete: () => void;
}

interface UploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  response?: Record<string, unknown>;
}

const PDFImagesUpload: React.FC<PDFImagesUploadProps> = ({
  magazineId,
  magazineName,
  onBack,
  onComplete
}) => {
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newItems: UploadItem[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0
    }));

    setUploadQueue(prev => [...prev, ...newItems]);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle folder selection
  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Sort files by name to maintain page order
    const sortedFiles = files.sort((a, b) => {
      const aMatch = a.name.match(/page_(\d+)\./);
      const bMatch = b.name.match(/page_(\d+)\./);
      
      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1]);
      }
      return a.name.localeCompare(b.name);
    });

    const newItems: UploadItem[] = sortedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0
    }));

    setUploadQueue(prev => [...prev, ...newItems]);
    
    // Clear the input
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  // Remove item from queue
  const removeFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  // Clear all items
  const clearQueue = () => {
    setUploadQueue([]);
    setTotalProgress(0);
    setCurrentUploadIndex(0);
  };

  // Upload single image
  const uploadImage = async (item: UploadItem): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('image', item.file);
      formData.append('folderName', magazineId);

      // Update status to uploading
      setUploadQueue(prev => prev.map(queueItem => 
        queueItem.id === item.id 
          ? { ...queueItem, status: 'uploading', progress: 0 }
          : queueItem
      ));

      console.log('Attempting to upload:', item.name, 'to folder:', magazineId);
      
      // Try to make the request with error handling
      let response;
      try {
        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type, let browser set it with boundary for FormData
          },
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown network error'}`);
      }

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update status to completed
        setUploadQueue(prev => prev.map(queueItem => 
          queueItem.id === item.id 
            ? { ...queueItem, status: 'completed', progress: 100, response: result.data }
            : queueItem
        ));
        return true;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error for', item.name, ':', error);
      // Update status to error
      setUploadQueue(prev => prev.map(queueItem => 
        queueItem.id === item.id 
          ? { ...queueItem, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
          : queueItem
      ));
      return false;
    }
  };

  // Start uploading queue
  const startUpload = async () => {
    if (uploadQueue.length === 0 || isUploading) return;

    setIsUploading(true);
    setCurrentUploadIndex(0);
    setTotalProgress(0);

    const pendingItems = uploadQueue.filter(item => item.status === 'pending');
    
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      setCurrentUploadIndex(i + 1);
      
      const success = await uploadImage(item);
      
      // Update total progress
      const completedCount = uploadQueue.filter(item => item.status === 'completed').length + (success ? 1 : 0);
      const newProgress = Math.round((completedCount / uploadQueue.length) * 100);
      setTotalProgress(newProgress);
      
      // Small delay between uploads to avoid overwhelming the server
      if (i < pendingItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsUploading(false);
  };

  // Get status color
  const getStatusColor = (status: UploadItem['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'uploading': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'uploading': return '📤';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Upload PDF Pages</h2>
        <p className="text-gray-600 mt-2">
          Magazine: <span className="font-semibold">{magazineName}</span> (ID: {magazineId})
        </p>
      </div>

      {/* File Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Individual Files */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Select Multiple Images
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Choose individual image files (page_1.png, page_2.png, etc.)
          </p>
        </div>

        {/* Folder Selection */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            ref={folderInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFolderSelect}
            className="hidden"
            {...({ webkitdirectory: "" } as Record<string, unknown>)}
          />
          <button
            onClick={() => folderInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Select Folder
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Choose a folder containing all page images
          </p>
        </div>
      </div>

      {/* Queue Display */}
      {uploadQueue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Upload Queue ({uploadQueue.length} files)
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={clearQueue}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
              >
                Clear All
              </button>
              <button
                onClick={startUpload}
                disabled={isUploading || uploadQueue.filter(item => item.status === 'pending').length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Start Upload'}
              </button>
            </div>
          </div>

          {/* Total Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Overall Progress</span>
                <span>{totalProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Uploading {currentUploadIndex} of {uploadQueue.length} files
              </p>
            </div>
          )}

          {/* File List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg">{getStatusIcon(item.status)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(item.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  
                  {item.status === 'uploading' && (
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {item.status === 'error' && (
                    <p className="text-xs text-red-600 max-w-32 truncate" title={item.error}>
                      {item.error}
                    </p>
                  )}
                  
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={item.status === 'uploading'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ← Back to Magazine Form
        </button>
        
        <button
          onClick={onComplete}
          disabled={uploadQueue.filter(item => item.status === 'completed').length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default PDFImagesUpload;
