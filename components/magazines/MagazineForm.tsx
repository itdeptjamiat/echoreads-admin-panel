import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Magazine } from '../../lib/mockData';
import { validateFile } from '../../lib/cloudflareStorage';
import { simpleUpload } from '../../lib/simpleUpload';
import { fetchCategories, Category, createMagazine } from '../../lib/api';
import { useNotifications } from '../../lib/notificationContext';

// Define interfaces for API responses
// interface MagazineData {
//   mid?: number;
//   id?: string;
//   _id?: string;
//   magazineId?: number;
//   magazine?: {
//     mid?: number;
//     id?: string;
//     _id?: string;
//   };
//   [key: string]: unknown;
// }

// interface ApiResponse {
//   success: boolean;
//   data?: MagazineData;
//   message?: string;
// }

const magazineTypes = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' }
];

const magazineContentTypes = [
  { value: 'magzine', label: 'Magazine' },
  { value: 'article', label: 'Article' },
  { value: 'digest', label: 'Digest' }
];

interface MagazineFormProps {
  onSubmit?: (data: {
    name: string;
    description: string;
    category: string;
    type: 'free' | 'pro';
    magzineType: 'magzine' | 'article' | 'digest';
    image: string;
    file: string;
    coverImage: File | null;
    pdfFile: File | null;
  }) => void;
  onCancel?: () => void;
  initialData?: Magazine;
  isMultiStep?: boolean; // New prop to indicate if this is part of a multi-step flow
}

const MagazineForm: React.FC<MagazineFormProps> = ({ onSubmit, onCancel, initialData, isMultiStep = false }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    total_pages: initialData?.total_pages || '',
    fileType: initialData?.fileType || 'pdf',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    rating: initialData?.rating || 0,
    downloads: initialData?.downloads || 0,
    views: initialData?.views || 0,
    likes: initialData?.likes || 0,
    reads: initialData?.reads || 0
  });
  const [type, setType] = useState<'free' | 'pro'>('free');
  const [magzineType, setMagzineType] = useState<'magzine' | 'article' | 'digest'>('magzine');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // const router = useRouter(); // Removed unused variable

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const result = await fetchCategories();
              if (result.success && result.data) {
        setCategories(result.data);
      } else {
        // Failed to load categories silently handled
        // Fallback to default categories if API fails
        setCategories([
          { _id: '1', name: 'Technology', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '2', name: 'Fashion', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '3', name: 'Sports', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '4', name: 'Health', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '5', name: 'Business', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '6', name: 'Travel', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '7', name: 'Food', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '8', name: 'Science', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '9', name: 'Arts', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '10', name: 'Environment', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '11', name: 'Finance', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '12', name: 'Education', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '13', name: 'Lifestyle', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '14', name: 'Automotive', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '15', name: 'Home', createdAt: '', updatedAt: '', __v: 0 },
          { _id: '16', name: 'other', createdAt: '', updatedAt: '', __v: 0 }
        ]);
      }
    } catch {
      // Error loading categories silently handled
      // Fallback to default categories
      setCategories([
        { _id: '1', name: 'Technology', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '2', name: 'Fashion', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '3', name: 'Sports', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '4', name: 'Health', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '5', name: 'Business', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '6', name: 'Travel', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '7', name: 'Food', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '8', name: 'Science', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '9', name: 'Arts', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '10', name: 'Environment', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '11', name: 'Finance', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '12', name: 'Education', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '13', name: 'Lifestyle', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '14', name: 'Automotive', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '15', name: 'Home', createdAt: '', updatedAt: '', __v: 0 },
        { _id: '16', name: 'other', createdAt: '', updatedAt: '', __v: 0 }
      ]);
    } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const validation = validateFile(file, ['image/jpeg', 'image/png', 'image/webp'], 10 * 1024 * 1024); // 10MB for images
      if (!validation.valid) {
        setError(validation.error || 'Invalid image file');
        return;
      }
      
      setError('');
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const validation = validateFile(file, ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 50 * 1024 * 1024); // 50MB for documents
      if (!validation.valid) {
        setError(validation.error || 'Invalid document file');
        return;
      }
      
      setError('');
      setSelectedFile(file);
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate audio file
      const validation = validateFile(file, ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac'], 100 * 1024 * 1024); // 100MB for audio files
      if (!validation.valid) {
        setError(validation.error || 'Invalid audio file');
        return;
      }
      
      setError('');
      setSelectedAudio(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      let fileUrl = '';
      let audioUrl = '';

      // Upload image if provided
      if (selectedImage) {
        setUploadProgress(20);
        try {
          const imageResult = await simpleUpload(selectedImage, 'cover');
          if (!imageResult.success) {
            setError(imageResult.error || 'Failed to upload image');
            setLoading(false);
            return;
          }
          imageUrl = imageResult.url || '';
          setUploadProgress(40);
        } catch {
          setError('Failed to upload image');
          setLoading(false);
          return;
        }
      }

      // Upload document if provided (optional)
      if (selectedFile) {
        setUploadProgress(60);
        try {
          const fileResult = await simpleUpload(selectedFile, 'documents');
          if (!fileResult.success) {
            setError(fileResult.error || 'Failed to upload document');
            setLoading(false);
            return;
          }
          fileUrl = fileResult.url || '';
          setUploadProgress(80);
        } catch {
          setError('Failed to upload document');
          setLoading(false);
          return;
        }
      } else {
        // No document file provided, skip to next step
        setUploadProgress(80);
      }

      // Upload audio if provided
      if (selectedAudio) {
        setUploadProgress(90);
        try {
          const audioResult = await simpleUpload(selectedAudio, 'audio');
          if (!audioResult.success) {
            setError(audioResult.error || 'Failed to upload audio');
            setLoading(false);
            return;
          }
          audioUrl = audioResult.url || '';
          setUploadProgress(100);
        } catch {
          setError('Failed to upload audio');
          setLoading(false);
          return;
        }
      }

      // Create magazine data
      const magazineData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type,
        magzineType,
        image: imageUrl,
        file: fileUrl,
        audioFile: audioUrl || undefined,
        total_pages: formData.total_pages ? parseInt(String(formData.total_pages)) : undefined,
        fileType: formData.fileType,
        isActive: formData.isActive,
        rating: parseInt(String(formData.rating)),
        downloads: parseInt(String(formData.downloads)),
        views: parseInt(String(formData.views)),
        likes: parseInt(String(formData.likes)),
        reads: parseInt(String(formData.reads))
      };

      // Actually create the magazine through the API
      const result = await createMagazine(magazineData);

      // Debug: Log the full response to see its structure
      console.log('Full API Response:', result);
      console.log('Response data:', result.data);
      console.log('Response success:', result.success);

      if (result.success && result.data) {
        // Extract the magazine ID from the response
        // The API response structure may vary, so we'll try different possible fields
        const data = result.data as Record<string, unknown>;
        let mid = data.mid || data.id || data._id || data.magazineId;
        
        // If still no ID, try to find it in nested structures
        if (!mid && data.magazine) {
          const magazine = data.magazine as Record<string, unknown>;
          mid = magazine.mid || magazine.id || magazine._id;
        }
        
        // If still no ID, try to find any numeric ID field
        if (!mid) {
          const allKeys = Object.keys(data);
          for (const key of allKeys) {
            const value = data[key];
            if (typeof value === 'number' && value > 0) {
              mid = value;
              console.log(`Found potential ID in field '${key}':`, value);
              break;
            }
          }
        }
        
        console.log('Extracted magazine ID:', mid);
        console.log('Available fields in result.data:', Object.keys(data));
        
        if (mid) {
          if (isMultiStep) {
            // Dispatch event for multi-step wrapper to capture
            const event = new CustomEvent('magazine-created', {
              detail: {
                magazineId: mid,
                magazineData: {
                  name: formData.name,
                  description: formData.description,
                  category: formData.category,
                  type,
                  magzineType,
                  ...(result.data as Record<string, unknown>)
                }
              }
            });
            window.dispatchEvent(event);
          } else {
            // Call onSubmit with the form data (for standalone usage)
            if (onSubmit) {
              onSubmit({
                name: magazineData.name,
                description: magazineData.description,
                category: magazineData.category,
                type: magazineData.type,
                magzineType: magazineData.magzineType,
                image: magazineData.image,
                file: magazineData.file,
                coverImage: selectedImage,
                pdfFile: selectedFile
              });
            }
          }

          // Add notification for successful magazine creation
          addNotification({
            title: 'Magazine Created Successfully',
            message: `"${formData.name}" has been added to the platform`,
            type: 'success',
            action: {
              label: 'View Magazines',
              href: '/magazines'
            }
          });

          setLoading(false);
          setUploadProgress(0);
          return;
        } else {
          // If we can't find the ID, show an error with manual input option
          const manualId = prompt(
            'Magazine created successfully but could not get magazine ID automatically.\n\n' +
            'Please check the console for the API response and enter the magazine ID manually:'
          );
          
          if (manualId && manualId.trim()) {
            // Use the manually entered ID
            const event = new CustomEvent('magazine-created', {
              detail: {
                magazineId: manualId.trim(),
                magazineData: {
                  name: formData.name,
                  description: formData.description,
                  category: formData.category,
                  type,
                  magzineType,
                  ...(result.data as Record<string, unknown>)
                }
              }
            });
            window.dispatchEvent(event);

            // Call onSubmit with the form data (for backward compatibility)
            if (onSubmit) {
              onSubmit({
                name: magazineData.name,
                description: magazineData.description,
                category: magazineData.category,
                type: magazineData.type,
                magzineType: magazineData.magzineType,
                image: magazineData.image,
                file: magazineData.file,
                coverImage: selectedImage,
                pdfFile: selectedFile
              });
            }

            // Add notification for successful magazine creation
            addNotification({
              title: 'Magazine Created Successfully',
              message: `"${formData.name}" has been added to the platform`,
              type: 'success',
              action: {
                label: 'View Magazines',
                href: '/magazines'
              }
            });

            setLoading(false);
            setUploadProgress(0);
            return;
          } else {
            // User cancelled or didn't enter ID
            setError('Magazine created successfully but could not get magazine ID. Please check the response.');
            console.error('Magazine creation response:', result);
            console.error('Available fields in result.data:', Object.keys(result.data));
            console.error('Full result.data object:', result.data);
            setLoading(false);
            return;
          }
        }
      } else {
        setError(result.message || 'Failed to create magazine');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Magazine creation error:', err);
      setError('An unexpected error occurred');
      addNotification({
        title: 'Magazine Creation Failed',
        message: 'Failed to create magazine. Please try again.',
        type: 'error'
      });
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // const handleCancel = () => {
  //   if (onCancel) {
  //     onCancel();
  //   } else {
  //     router.push('/magazines');
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add New Magazine</h3>
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
            
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Magazine Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter magazine name"
                required
              />
            </div>

            {/* Description Field */}
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
                placeholder="Enter magazine description"
              />
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Select a category</option>
                {categoriesLoading ? (
                  <option value="">Loading categories...</option>
                ) : (
                                categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))
                )}
              </select>
            </div>

            {/* Total Pages Field */}
            <div>
              <label htmlFor="total_pages" className="block text-sm font-medium text-gray-700 mb-1">
                Total Pages (Optional)
              </label>
              <input
                type="number"
                id="total_pages"
                name="total_pages"
                value={formData.total_pages}
                onChange={handleInputChange}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter total number of pages"
              />
            </div>

            {/* File Type Field */}
            <div>
              <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1">
                File Type
              </label>
              <select
                id="fileType"
                name="fileType"
                value={formData.fileType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
              </select>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Advanced Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Toggle */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active Magazine</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Enable or disable magazine visibility</p>
              </div>

              {/* Initial Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Rating
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Initial Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Downloads */}
              <div>
                <label htmlFor="downloads" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Downloads
                </label>
                <input
                  type="number"
                  id="downloads"
                  name="downloads"
                  value={formData.downloads}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0"
                />
              </div>

              {/* Views */}
              <div>
                <label htmlFor="views" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Views
                </label>
                <input
                  type="number"
                  id="views"
                  name="views"
                  value={formData.views}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0"
                />
              </div>

              {/* Likes */}
              <div>
                <label htmlFor="likes" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Likes
                </label>
                <input
                  type="number"
                  id="likes"
                  name="likes"
                  value={formData.likes}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0"
                />
              </div>

              {/* Reads */}
              <div>
                <label htmlFor="reads" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Reads
                </label>
                <input
                  type="number"
                  id="reads"
                  name="reads"
                  value={formData.reads}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Type and Access Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Type & Access Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Type */}
              <div>
                <label htmlFor="magzineType" className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type *
                </label>
                <select
                  id="magzineType"
                  value={magzineType}
                  onChange={(e) => setMagzineType(e.target.value as 'magzine' | 'article' | 'digest')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  {magazineContentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Access Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Type *
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'free' | 'pro')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  {magazineTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">File Uploads</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cover Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image *
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-20 h-28 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Document File */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  Document File (Optional)
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {selectedFile && (
                  <p className="mt-1 text-sm text-gray-600">{selectedFile.name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">You can upload the PDF later if needed</p>
              </div>
            </div>

            {/* Audio File */}
            <div>
              <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
                Audio File (Optional)
              </label>
              <input
                type="file"
                id="audio"
                accept="audio/*"
                onChange={handleAudioChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {selectedAudio && (
                <p className="mt-1 text-sm text-gray-600">{selectedAudio.name}</p>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {uploadProgress < 40 ? 'Uploading image...' : 
                   uploadProgress < 80 ? 'Uploading document...' : 
                   uploadProgress < 100 ? 'Uploading audio...' : 'Processing...'}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
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
              disabled={loading || uploadProgress > 0 && uploadProgress < 100}
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
                'Create Magazine'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MagazineForm; 