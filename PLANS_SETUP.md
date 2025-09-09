# Plans Management Setup

This document describes the implementation of the subscription plans management feature in the EchoReads Admin Panel.

## Overview

The plans management feature allows administrators to create and manage subscription plans for the EchoReads platform. It includes three predefined plan types: Free, EchoPro, and EchoPro Plus.

## Features

### Plan Types
- **Free Plan**: $0/month - Basic access with limitations
- **EchoPro**: $9.99/month - Enhanced features and unlimited access
- **EchoPro Plus**: $19.99/month - Premium features with family sharing

### Plan Management
- Create new plans with custom pricing and features
- Delete existing plans (except free plan)
- Set usage limits (downloads, magazines)
- Configure discounts and promotional offers
- Manage plan status (active/inactive)

## API Integration

### Backend Implementation
The backend uses MongoDB with Mongoose for data persistence:

**Schema**: `planPriceSchema`
- `planType`: String (enum: 'free', 'echopro', 'echoproplus')
- `price`: Number (required, default: 0)
- `currency`: String (default: 'USD')
- `duration`: Number (in months, default: 1)
- `features`: Array of Strings
- `maxDownloads`: Number (0 = unlimited, default: 0)
- `maxMagazines`: Number (0 = unlimited, default: 0)
- `isActive`: Boolean (default: true)
- `description`: String
- `discountPercentage`: Number (default: 0)
- `discountValidUntil`: Date
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-updated)

**Backend Logic**:
- Validates required fields (planType, price)
- Checks for existing plans (prevents duplicates)
- Validates plan type enum values
- Enforces free plan price = 0
- Validates discount percentage (0-100)
- Creates new plan in database
- Returns 201 status with plan data

**Delete Plan Logic**:
- Validates planType and uid
- Verifies admin authorization
- Prevents deletion of free plan (essential)
- Checks for active subscribers
- Deletes plan if no active users
- Returns appropriate error messages

### External API Endpoints
- **Create**: `https://api.echoreads.online/api/v1/admin/plan/create` (POST)
- **Delete**: `https://api.echoreads.online/api/v1/admin/plan/delete` (DELETE)
- **Authentication**: Bearer token required

### Local API Routes
- **Create**: `/api/plans/create` (POST)
- **Fetch**: `/api/plans` (GET)
- **Delete**: `/api/plans/delete` (DELETE)
- **Features**: 
  - CORS handling
  - Request validation
  - Error handling
  - Timeout protection (10 seconds)
  - Response formatting

## Implementation Details

### 1. API Route (`pages/api/plans/create.ts`)
- Handles CORS and preflight requests
- Validates authorization header
- Validates request body parameters
- Forwards requests to external API
- Provides comprehensive error handling

### 2. API Functions (`lib/api.ts`)
- `createPlan(planData: Plan)` function
- `fetchPlans()` function to retrieve all plans
- `deletePlan(planType: string, uid: string)` function
- TypeScript interfaces for plan data
- Authentication token management
- Error handling and response formatting

### 3. Plan Form Component (`components/plans/PlanForm.tsx`)
- Modern form interface with validation
- Dynamic feature management
- File upload support
- Real-time validation
- Success/error notifications

### 4. Delete Plan Modal (`components/plans/DeletePlanModal.tsx`)
- Confirmation modal for plan deletion
- Warning messages and safety checks
- Loading states during deletion
- Error handling and notifications

### 5. Plans Page (`pages/plans/index.tsx`)
- Fetches and displays real plans from API
- Loading states and error handling
- Plan statistics and metrics
- Quick actions for plan management (create, delete)
- Delete buttons for non-free plans
- Responsive design for all devices

### 6. API Routes
- `pages/api/plans/create.ts` - Create new plans
- `pages/api/plans/index.ts` - Fetch all plans
- `pages/api/plans/delete.ts` - Delete plans

### 7. Navigation Integration
- Added "Plans" link to sidebar navigation
- Added quick action to dashboard
- Consistent with existing navigation patterns

## Plan Schema

```typescript
interface Plan {
  planType: 'free' | 'echopro' | 'echoproplus';
  price: number;
  currency?: string;
  duration?: number;
  features?: string[];
  maxDownloads?: number;
  maxMagazines?: number;
  description?: string;
  discountPercentage?: number;
  discountValidUntil?: string;
  isActive?: boolean;
}
```

## Request Format

### Create Plan Request
```json
{
  "planType": "echopro",
  "price": 9.99,
  "currency": "USD",
  "duration": 1,
  "features": [
    "Unlimited magazine access",
    "Premium content",
    "Priority support"
  ],
  "maxDownloads": 0,
  "maxMagazines": 0,
  "description": "Enhanced reading experience",
  "discountPercentage": 0,
  "discountValidUntil": null
}
```

### Delete Plan Request
```json
{
  "planType": "echopro",
  "uid": "user123"
}
```

## Response Format

**Success Response (201 Created)**:
```json
{
  "message": "Plan created successfully",
  "plan": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "planType": "echopro",
    "price": 9.99,
    "currency": "USD",
    "duration": 1,
    "features": ["Unlimited magazine access", "Premium content"],
    "maxDownloads": 0,
    "maxMagazines": 0,
    "isActive": true,
    "description": "Enhanced reading experience",
    "discountPercentage": 0,
    "discountValidUntil": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Plan type \"echopro\" already exists. Use update instead."
}
```

**Delete Plan Success Response (200 OK)**:
```json
{
  "message": "Plan \"echopro\" deleted successfully"
}
```

**Delete Plan Error Response (400 Bad Request)**:
```json
{
  "message": "Cannot delete the free plan as it is essential for the application"
}
```

**Delete Plan Error Response (400 Bad Request)**:
```json
{
  "message": "Cannot delete plan \"echopro\" as 5 user(s) are currently subscribed to it. Please migrate users to another plan first."
}
```

## Validation Rules

### Plan Type Validation
- Must be one of: 'free', 'echopro', 'echoproplus'
- Free plans must have price set to 0
- Plan types must be unique

### Price Validation
- Must be a positive number
- Free plans must have price = 0
- Supports decimal values

### Discount Validation
- Must be between 0 and 100
- Optional discount expiration date
- Applied as percentage off original price

### Usage Limits
- 0 means unlimited
- Positive numbers set specific limits
- Applies to downloads and magazine access

## Error Handling

### Network Errors
- Connection timeout (10 seconds)
- Network connectivity issues
- External service unavailability

### Validation Errors
- Missing required fields
- Invalid plan types
- Price validation failures
- Discount percentage out of range

### API Errors
- Authentication failures
- Server errors
- Invalid response formats

## User Experience

### Form Features
- Pre-populated with sensible defaults
- Real-time validation feedback
- Dynamic feature management
- Progress indicators
- Success/error notifications

### Visual Design
- Modern card-based layout
- Color-coded plan types
- Gradient backgrounds
- Responsive design
- Hover effects and animations

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management

## Security Features

### Authentication
- Bearer token required for all requests
- Token validation on every request
- Secure token transmission

### Input Validation
- Server-side validation
- Client-side validation
- XSS prevention
- SQL injection protection

### Error Sanitization
- Safe error messages
- No sensitive data exposure
- Proper logging

## Usage Instructions

### Creating a New Plan
1. Navigate to Plans page (`/plans`)
2. Click "Add New Plan" button
3. Fill in plan details:
   - Select plan type
   - Set price and currency
   - Add features
   - Set usage limits
   - Configure discounts (optional)
4. Click "Create Plan"
5. Plan will be created and displayed in the list

### Managing Existing Plans
- View plan details in card layout
- Edit plans (future feature)
- Toggle plan status (future feature)
- View plan statistics

## Future Enhancements

### Planned Features
- Plan editing functionality
- Plan deletion with confirmation
- Bulk plan operations
- Plan analytics and reporting
- Subscription management
- Payment integration

### Technical Improvements
- Real-time plan updates
- Caching for better performance
- Advanced filtering and search
- Export functionality
- API rate limiting

## Testing

### Manual Testing
1. Navigate to `/plans`
2. Verify all three plans are displayed
3. Click "Add New Plan"
4. Test form validation
5. Submit form and verify success
6. Check error handling

### API Testing
1. Test with valid data
2. Test with invalid data
3. Test authentication failures
4. Test network timeouts
5. Test external API errors

## Dependencies

- `lib/api.ts` - API communication
- `lib/notificationContext.tsx` - User notifications
- `components/layouts/AdminLayout.tsx` - Page layout
- `pages/api/plans/create.ts` - API route

## Performance Considerations

- Lazy loading of plan components
- Optimized bundle size
- Efficient re-rendering
- Minimal API calls
- Cached plan data

This implementation provides a solid foundation for subscription plan management with room for future enhancements and scalability. 