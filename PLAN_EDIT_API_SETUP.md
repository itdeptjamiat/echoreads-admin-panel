# Plan Edit API Setup

## Overview
This document outlines the implementation of the plan edit functionality for the EchoReads admin panel.

## API Endpoint

### Backend API
- **URL**: `https://api.echoreads.online/api/v1/admin/plan/update`
- **Method**: `PUT`
- **Authentication**: Bearer token required in header

### Frontend API Route
- **URL**: `/api/plans/update`
- **Method**: `PUT`
- **File**: `pages/api/plans/update.ts`

## Backend Implementation

### Schema (planPriceSchema.js)
```javascript
const PlanPrice = require('../models/planPriceSchema');
```

### Update Function
```javascript
const updatePlan = async (req, res) => {
    try {
        const { planType, ...updateData } = req.body;

        if (!planType) {
            return res.status(400).json({ message: 'Plan type is required' });
        }

        // Validate planType if provided in updateData
        if (updateData.planType) {
            const allowedPlanTypes = ['free', 'echopro', 'echoproplus'];
            if (!allowedPlanTypes.includes(updateData.planType)) {
                return res.status(400).json({ 
                    message: 'Invalid planType. Must be one of: "free", "echopro", "echoproplus".' 
                });
            }
        }

        // Validate price for free plan
        if (updateData.price !== undefined) {
            if (planType === 'free' && updateData.price !== 0) {
                return res.status(400).json({ 
                    message: 'Free plan must have price set to 0.' 
                });
            }
        }

        // Validate discount percentage
        if (updateData.discountPercentage !== undefined) {
            if (updateData.discountPercentage < 0 || updateData.discountPercentage > 100) {
                return res.status(400).json({ 
                    message: 'Discount percentage must be between 0 and 100.' 
                });
            }
        }

        // Handle discount expiry date
        if (updateData.discountValidUntil) {
            updateData.discountValidUntil = new Date(updateData.discountValidUntil);
        }

        const updatedPlan = await PlanPrice.findOneAndUpdate(
            { planType },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({
            message: 'Plan updated successfully',
            plan: updatedPlan
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
```

## Frontend Implementation

### API Function (`lib/api.ts`)
```typescript
export const updatePlan = async (planType: string, updateData: Partial<Plan>): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/plans/update', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        planType,
        ...updateData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to update plan' };
    }

    const data = await response.json();
    return { success: true, data: data.plan || data.data || data, message: data.message || 'Plan updated successfully' };
  } catch {
    return { success: false, message: 'An unexpected error occurred' };
  }
};
```

### Edit Plan Form Component (`components/plans/EditPlanForm.tsx`)
- **Features**: Complete form for editing all plan properties
- **Validation**: Client-side validation for all fields
- **Features Management**: Add/remove features dynamically
- **Modal Design**: Clean, responsive modal interface

### Integration (`pages/plans/index.tsx`)
- **Edit Button**: Triggers edit modal for each plan
- **State Management**: Handles edit form visibility and plan selection
- **Success Handling**: Refreshes plan list after successful update

## Request/Response Format

### Request Body
```json
{
  "planType": "echopro",
  "price": 9.99,
  "currency": "USD",
  "duration": 30,
  "description": "Premium plan with advanced features",
  "discountPercentage": 10,
  "discountValidUntil": "2024-12-31T23:59:59.000Z",
  "maxDownloads": 100,
  "maxMagazines": 50,
  "isActive": true,
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

### Success Response
```json
{
  "success": true,
  "message": "Plan updated successfully",
  "data": {
    "planType": "echopro",
    "price": 9.99,
    "currency": "USD",
    "duration": 30,
    "description": "Premium plan with advanced features",
    "discountPercentage": 10,
    "discountValidUntil": "2024-12-31T23:59:59.000Z",
    "maxDownloads": 100,
    "maxMagazines": 50,
    "isActive": true,
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation error message",
  "details": "Additional error details"
}
```

## Validation Rules

1. **Plan Type**: Required, must be one of: 'free', 'echopro', 'echoproplus'
2. **Price**: 
   - Free plan must have price = 0
   - Other plans can have any positive value
3. **Discount Percentage**: Must be between 0 and 100
4. **Duration**: Must be a positive integer
5. **Max Downloads/Magazines**: Must be non-negative (0 = unlimited)

## Features

### ✅ Implemented
- [x] Complete plan editing functionality
- [x] Form validation (client and server-side)
- [x] Features management (add/remove)
- [x] Modal interface
- [x] Error handling
- [x] Success notifications
- [x] Plan list refresh after update
- [x] Authentication middleware
- [x] CORS handling

### 🎯 User Experience
- **Intuitive Interface**: Clean, modern form design
- **Real-time Validation**: Immediate feedback on form errors
- **Feature Management**: Easy add/remove of plan features
- **Responsive Design**: Works on all device sizes
- **Loading States**: Clear feedback during API calls
- **Error Handling**: User-friendly error messages

## Usage

1. **Access**: Click "Edit Plan" button on any plan card
2. **Modify**: Update any plan properties in the form
3. **Features**: Add/remove features as needed
4. **Save**: Click "Update Plan" to save changes
5. **Result**: Plan is updated and list refreshes automatically

## Security

- **Authentication**: Bearer token required for all requests
- **Validation**: Comprehensive server-side validation
- **CORS**: Proper CORS headers for cross-origin requests
- **Error Handling**: Secure error responses without sensitive data exposure 