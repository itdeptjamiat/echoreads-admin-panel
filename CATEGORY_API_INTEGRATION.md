# Category API Integration with EchoReads

## Overview

The category management system has been updated to use the official EchoReads API endpoints for fetching and creating categories. This ensures data consistency and real-time synchronization with the main EchoReads platform.

## API Endpoints

### Fetch Categories
- **Endpoint**: `https://api.echoreads.online/api/v1/admin/categories`
- **Method**: `GET`
- **Authentication**: Required (JWT Bearer token)
- **Response Format**:
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "_id": "68a97c55657b7e6b6f3b6a63",
      "name": "test category",
      "createdAt": "2025-08-23T08:31:17.487Z",
      "updatedAt": "2025-08-23T08:31:17.487Z",
      "__v": 0
    }
  ]
}
```

### Create Category
- **Endpoint**: `https://api.echoreads.online/api/v1/admin/category/add`
- **Method**: `POST`
- **Authentication**: Required (JWT Bearer token)
- **Request Body**:
```json
{
  "name": "New Category Name"
}
```
- **Response Format**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "68a97c55657b7e6b6f3b6a63",
    "name": "New Category Name",
    "createdAt": "2025-08-23T08:31:17.487Z",
    "updatedAt": "2025-08-23T08:31:17.487Z",
    "__v": 0
  }
}
```

## Implementation Details

### Backend API Routes (`pages/api/categories/index.ts`)

The backend API routes now act as a proxy to the EchoReads API:

1. **Authentication**: All requests require a valid JWT token in the Authorization header
2. **Error Handling**: Comprehensive error handling for network issues and API failures
3. **Response Forwarding**: Responses from the EchoReads API are forwarded to the frontend
4. **CORS Support**: Proper CORS headers for cross-origin requests

### Frontend Integration (`lib/api.ts`)

The frontend API functions have been updated to:

1. **Type Safety**: Added `Category` interface for type safety
2. **Authentication**: Include JWT tokens in all requests
3. **Error Handling**: Proper error handling and user feedback
4. **Data Refresh**: Automatically refresh category list after successful operations

### Category Interface

```typescript
export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
```

## Updated Components

### Categories Page (`pages/categories/index.tsx`)
- Updated to handle `Category` objects instead of simple strings
- Proper display of category names and metadata
- Enhanced error handling and user feedback

### Magazine Forms
- **MagazineForm.tsx**: Updated to use Category objects in dropdowns
- **EditMagazineForm.tsx**: Updated to use Category objects in dropdowns
- Fallback categories provided for offline scenarios

## Features

### ✅ Implemented
- **Fetch Categories**: Real-time category fetching from EchoReads API
- **Create Categories**: Add new categories through the EchoReads API
- **Authentication**: Secure JWT-based authentication
- **Error Handling**: Comprehensive error handling and user feedback
- **Type Safety**: Full TypeScript support with proper interfaces
- **Fallback Support**: Default categories for offline scenarios

### 🔄 Partially Implemented
- **Delete Categories**: Placeholder implementation (requires EchoReads API endpoint)
- **Update Categories**: Placeholder implementation (requires EchoReads API endpoint)

### 📋 Future Enhancements
- **Category Deletion**: Implement when EchoReads API endpoint is available
- **Category Updates**: Implement when EchoReads API endpoint is available
- **Category Sorting**: Add sorting and filtering options
- **Category Search**: Add search functionality
- **Category Statistics**: Show usage statistics for each category

## Usage Examples

### Fetching Categories
```typescript
const result = await fetchCategories();
if (result.success && result.data) {
  const categories = result.data; // Category[]
  console.log('Categories:', categories.map(cat => cat.name));
}
```

### Creating a Category
```typescript
const result = await addCategory('New Technology Category');
if (result.success) {
  console.log('Category created successfully');
  // Categories list is automatically refreshed
}
```

### Using Categories in Magazine Forms
```typescript
// Categories are automatically loaded and displayed in dropdowns
// Users can select from the fetched categories
const selectedCategory = 'Technology'; // Category name
```

## Error Handling

The system includes comprehensive error handling:

1. **Network Errors**: Proper handling of network connectivity issues
2. **Authentication Errors**: Clear messages for invalid or expired tokens
3. **API Errors**: Forwarded error messages from the EchoReads API
4. **Validation Errors**: Client-side validation for category names
5. **Fallback Support**: Default categories when API is unavailable

## Security Considerations

1. **JWT Authentication**: All requests require valid authentication tokens
2. **Input Validation**: Server-side validation of category names
3. **CORS Protection**: Proper CORS headers for secure cross-origin requests
4. **Error Sanitization**: Error messages are sanitized to prevent information leakage

## Testing

To test the category integration:

1. **Login**: Ensure you're logged in as an admin user
2. **Navigate**: Go to the Categories page (`/categories`)
3. **Fetch**: Categories should load automatically from the EchoReads API
4. **Create**: Try adding a new category
5. **Verify**: Check that the new category appears in the list

## Troubleshooting

### Common Issues

1. **Categories Not Loading**
   - Check authentication token
   - Verify network connectivity
   - Check browser console for errors

2. **Cannot Create Categories**
   - Ensure you have admin privileges
   - Check category name validation
   - Verify API endpoint availability

3. **Authentication Errors**
   - Re-login to refresh JWT token
   - Check token expiration
   - Verify admin user type

### Debug Information

Enable debug mode in the browser console to see detailed API requests and responses:

```typescript
// In browser console
localStorage.setItem('debug', 'true');
```

## API Reference

### EchoReads Category API

- **Base URL**: `https://api.echoreads.online/api/v1/admin`
- **Authentication**: Bearer token required
- **Rate Limiting**: Subject to EchoReads API rate limits
- **Error Codes**: Standard HTTP status codes

### Local API Proxy

- **Base URL**: `/api/categories`
- **Authentication**: JWT token from localStorage
- **Methods**: GET, POST, PUT, DELETE
- **CORS**: Enabled for all origins

---

**Last Updated**: August 2024
**Version**: 1.0.0
**Status**: Production Ready (Core Features)
