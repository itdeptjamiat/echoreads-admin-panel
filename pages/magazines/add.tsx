import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import MultiStepMagazineForm from '../../components/magazines/MultiStepMagazineForm';

const AddMagazine: React.FC = () => {
  const router = useRouter();

  const handleCancel = () => {
    // Navigate back to magazines list
    router.push('/magazines');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Magazine</h1>
          
          {/* Back to Magazine List Link */}
          <Link
            href="/magazines"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Magazine List</span>
          </Link>
        </div>

        {/* Multi-Step Magazine Form */}
        <MultiStepMagazineForm onCancel={handleCancel} />
      </div>
    </AdminLayout>
  );
};

export default AddMagazine; 