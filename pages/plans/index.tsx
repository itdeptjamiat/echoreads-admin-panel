import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import PlanForm from '../../components/plans/PlanForm';
import DeletePlanModal from '../../components/plans/DeletePlanModal';
import SimplePlanCard from '../../components/plans/SimplePlanCard';
import EditPlanForm from '../../components/plans/EditPlanForm';
import { fetchPlans, Plan } from '../../lib/api';
import { useNotifications } from '../../lib/notificationContext';

const PlansPage: React.FC = () => {
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditPlanForm, setShowEditPlanForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchPlans();
      
      if (result.success && result.data) {
        setPlans(result.data);
      } else {
        addNotification({
          title: 'Error',
          message: result.message || 'Failed to load plans',
          type: 'error'
        });
      }
    } catch {
      addNotification({
        title: 'Error',
        message: 'Failed to load plans',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Fetch plans from API
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleAddPlanSuccess = () => {
    setShowAddPlanForm(false);
    // Refresh the plans list
    loadPlans();
  };

  const handleDeletePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setSelectedPlan(null);
    // Refresh the plans list
    loadPlans();
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowEditPlanForm(true);
  };

  const handleEditSuccess = () => {
    loadPlans();
    setShowEditPlanForm(false);
    setSelectedPlan(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Simple Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Subscription Plans
              </h1>
              <p className="text-lg text-gray-600">Manage your subscription plans and pricing</p>
            </div>
            
            {/* Simple Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddPlanForm(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Plan
              </button>
            </div>
          </div>
        </div>

        {/* Simple Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 text-lg">Loading plans...</p>
              </div>
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plans Found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first subscription plan</p>
                <button
                  onClick={() => setShowAddPlanForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Plan
                </button>
              </div>
            </div>
          ) : (
            plans.map((plan, index) => (
              <SimplePlanCard
                key={plan._id || index}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
              />
            ))
          )}
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-lg font-semibold text-gray-900">{plans.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-lg font-semibold text-gray-900">{plans.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-lg font-semibold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-lg font-semibold text-gray-900">$12,456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Plan Form Modal */}
        {showAddPlanForm && (
          <PlanForm
            onSuccess={handleAddPlanSuccess}
            onCancel={() => setShowAddPlanForm(false)}
          />
        )}

        {/* Delete Plan Modal */}
        {showDeleteModal && selectedPlan && (
          <DeletePlanModal
            plan={selectedPlan}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedPlan(null);
            }}
            onSuccess={handleDeleteSuccess}
          />
        )}

        {/* Edit Plan Modal */}
        {showEditPlanForm && selectedPlan && (
          <EditPlanForm
            plan={selectedPlan}
            onClose={() => {
              setShowEditPlanForm(false);
              setSelectedPlan(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}


      </div>
    </AdminLayout>
  );
};

export default PlansPage; 