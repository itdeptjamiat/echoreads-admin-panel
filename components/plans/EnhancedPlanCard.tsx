import React, { useState } from 'react';
import { Plan } from '../../lib/api';

interface EnhancedPlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  onViewDetails: (plan: Plan) => void;
}

const EnhancedPlanCard: React.FC<EnhancedPlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const maxFeaturesToShow = 5;

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free':
        return {
          gradient: 'from-gray-500 to-gray-600',
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          accent: 'text-gray-600'
        };
      case 'echopro':
        return {
          gradient: 'from-blue-500 to-blue-600',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          accent: 'text-blue-600'
        };
      case 'echoproplus':
        return {
          gradient: 'from-purple-500 to-purple-600',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          accent: 'text-purple-600'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          accent: 'text-gray-600'
        };
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (plan.discountPercentage && plan.discountPercentage > 0 && plan.price > 0) {
      return plan.price * (1 - plan.discountPercentage / 100);
    }
    return plan.price;
  };

  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount = plan.discountPercentage && plan.discountPercentage > 0 && plan.price > 0;
  const colors = getPlanColor(plan.planType);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      {/* Enhanced Header with 3D Effect */}
      <div className={`bg-gradient-to-br ${colors.gradient} p-8 text-white relative overflow-hidden`}>
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12 animate-pulse delay-500"></div>
        
        <div className="relative z-10">
          {/* Plan Badge and Discount */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${colors.badge} backdrop-blur-sm`}>
              {plan.planType.toUpperCase()}
            </span>
            {hasDiscount && (
              <div className="relative">
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  {plan.discountPercentage}% OFF
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
              </div>
            )}
          </div>
          
          {/* Plan Title and Price */}
          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
            {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} Plan
          </h3>
          <div className="flex items-baseline space-x-2 mb-3">
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-2xl font-black line-through opacity-75">
                  {formatPrice(plan.price, plan.currency || 'USD')}
                </span>
                <span className="text-4xl font-black text-green-300">
                  {formatPrice(discountedPrice, plan.currency || 'USD')}
                </span>
              </div>
            ) : (
              <span className="text-4xl font-black">{formatPrice(plan.price, plan.currency || 'USD')}</span>
            )}
            {plan.price > 0 && (
              <span className="text-lg opacity-90">/month</span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-sm opacity-90 leading-relaxed">
            {plan.description || 'Premium access to EchoReads magazines'}
          </p>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-8">
        {/* Features Section */}
        {plan.features && plan.features.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Features</h4>
            </div>
            <div className="space-y-3">
              {(showAllFeatures ? plan.features : plan.features.slice(0, maxFeaturesToShow)).map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 transition-all duration-200 hover:bg-gray-100">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
              {plan.features.length > maxFeaturesToShow && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  {showAllFeatures ? 'Show Less' : `Show ${plan.features.length - maxFeaturesToShow} More Features`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Usage Limits with Enhanced Design */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Usage Limits
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-gray-900">
                {plan.maxDownloads === -1 ? 'No Access' : plan.maxDownloads === 0 ? '∞' : plan.maxDownloads}
              </div>
              <div className="text-xs text-gray-500">Downloads</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-gray-900">
                {plan.maxMagazines === -1 ? 'No Access' : plan.maxMagazines === 0 ? '∞' : plan.maxMagazines}
              </div>
              <div className="text-xs text-gray-500">Magazines</div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => onEdit(plan)}
            className="w-full group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Plan
          </button>
          
          <button 
            onClick={() => onViewDetails(plan)}
            className="w-full group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
          
          {plan.planType !== 'free' && (
            <button 
              onClick={() => onDelete(plan)}
              className="w-full group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-red-700 bg-white border-2 border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Plan
            </button>
          )}
        </div>

        {/* Status Badge */}
        <div className="mt-6 flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
            plan.isActive 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              plan.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {plan.isActive ? 'Active' : 'Inactive'}
          </span>
          
          {/* Plan Type Indicator */}
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
            {plan.planType.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPlanCard; 