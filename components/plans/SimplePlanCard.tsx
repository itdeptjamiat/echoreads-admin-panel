import React from 'react';
import { Plan } from '../../lib/api';

interface SimplePlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

const SimplePlanCard: React.FC<SimplePlanCardProps> = ({
  plan,
  onEdit,
  onDelete
}) => {
  const getPlanTheme = (planType: string) => {
    switch (planType) {
      case 'free':
        return {
          gradient: 'from-gray-400 to-gray-600',
          accent: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
      case 'echopro':
        return {
          gradient: 'from-blue-500 to-blue-700',
          accent: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'echoproplus':
        return {
          gradient: 'from-purple-500 to-purple-700',
          accent: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          gradient: 'from-gray-400 to-gray-600',
          accent: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700'
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
  const theme = getPlanTheme(plan.planType);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group flex flex-col h-full">
      {/* Header */}
      <div className={`bg-gradient-to-br ${theme.gradient} p-6 text-white relative`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          {/* Plan Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${theme.badge} backdrop-blur-sm`}>
              {plan.planType.toUpperCase()}
            </span>
            {hasDiscount && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                {plan.discountPercentage}% OFF
              </span>
            )}
          </div>
          
          {/* Plan Title */}
          <h3 className="text-2xl font-bold mb-2">
            {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} Plan
          </h3>
          
          {/* Price */}
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

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <div className="mb-6 flex-grow">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Features
            </h4>
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Limits */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Usage Limits
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {plan.maxDownloads === -1 ? 'No Access' : plan.maxDownloads === 0 ? '∞' : plan.maxDownloads}
              </div>
              <div className="text-xs text-gray-500">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {plan.maxMagazines === -1 ? 'No Access' : plan.maxMagazines === 0 ? '∞' : plan.maxMagazines}
              </div>
              <div className="text-xs text-gray-500">Magazines</div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
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
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          <button 
            onClick={() => onEdit(plan)}
            className={`w-full py-3 px-4 text-white font-semibold rounded-xl ${theme.button} transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg`}
          >
            Edit Plan
          </button>
          
          {plan.planType !== 'free' && (
            <button 
              onClick={() => onDelete(plan)}
              className="w-full py-3 px-4 border-2 border-red-300 text-red-700 font-semibold rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200"
            >
              Delete Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplePlanCard; 