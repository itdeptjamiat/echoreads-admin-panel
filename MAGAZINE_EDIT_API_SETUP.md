# Magazine Edit API Setup

This document describes the implementation of the magazine edit functionality in the EchoReads Admin Panel.

## Overview

The magazine edit feature allows administrators to update existing magazines through a user-friendly interface that integrates with the external API.

## API Endpoint

**External API**: `http://api.echoreads.online/api/v1/admin/update-magzine`
**Local Proxy**: `/api/magazines/update`

### Request Method
- **PUT** - Updates an existing magazine

### Request Body
```json
{
  "mid": 123,
  "name": "Updated Magazine Name",
  "description": "Updated description",
  "category": "Technology",
  "type": "free",
  "magzineType": "magzine",
  "image": "https://example.com/cover.jpg",
  "file": "https://example.com/document.pdf"
}
```

### Response
```json
{
  "message": "Magazine updated successfully",
  "magazine": {
    "mid": 123,
    "name": "Updated Magazine Name",
    "description": "Updated description",
    "category": "Technology",
    "type": "free",
    "magzineType": "magzine",
    "image": "https://example.com/cover.jpg",
    "file": "https://example.com/document.pdf"
  }
}
```

## Implementation Details

### 1. API Route (`pages/api/magazines/update.ts`)
- Handles CORS and preflight requests
- Validates authorization header
- Forwards requests to external API
- Returns appropriate error responses

### 2. API Function (`lib/api.ts`)
- `updateMagazine(mid: number, magazineData: object)` function
- Handles authentication token
- Manages request/response formatting
- Provides error handling

### 3. Edit Form Component (`components/magazines/EditMagazineForm.tsx`)
- Pre-populates form with existing magazine data
- Supports file uploads for new images/documents
- Validates form inputs
- Shows upload progress
- Handles success/error states

### 4. Table Integration (`components/magazines/MagazineTable.tsx`)
- Added edit button to each magazine row
- Passes magazine object to edit handler
- Maintains existing view/delete functionality

### 5. Page Integration (`pages/magazines/index.tsx`)
- Manages edit form modal state
- Handles edit success/cancel actions
- Refreshes magazine list after successful edit

## Features

### Form Pre-population
- Automatically fills form with existing magazine data
- Shows current cover image preview
- Maintains existing file references

### File Upload Support
- Optional image upload (keeps existing if not changed)
- Optional document upload (keeps existing if not changed)
- File validation and size limits
- Upload progress indication

### Validation
- Required field validation
- File type validation
- File size limits (10MB for images, 50MB for documents)
- Magazine ID validation

### User Experience
- Modal-based editing interface
- Loading states and progress indicators
- Success/error notifications
- Responsive design for mobile/desktop

## Usage

1. Navigate to the Magazines page
2. Click the "Edit" button on any magazine row
3. Modify the magazine details in the form
4. Optionally upload new cover image or document
5. Click "Update Magazine" to save changes
6. Form closes automatically on success

## Error Handling

- **Network errors**: Displayed to user with retry option
- **Validation errors**: Form-level validation with specific messages
- **API errors**: Forwarded from external API with user-friendly messages
- **File upload errors**: Specific error messages for upload failures

## Security

- Authentication token required for all requests
- File type validation prevents malicious uploads
- Input sanitization and validation
- CORS handling for cross-origin requests

## Dependencies

- `lib/cloudflareStorage.ts` - File validation
- `lib/simpleUpload.ts` - File upload functionality
- `lib/api.ts` - API communication
- `lib/notificationContext.tsx` - User notifications

## Testing

To test the edit functionality:

1. Ensure you have admin authentication
2. Navigate to `/magazines`
3. Click edit on any magazine
4. Modify some fields
5. Submit the form
6. Verify changes are reflected in the list

## Future Enhancements

- Bulk edit functionality
- Version history tracking
- Advanced image editing
- Document preview
- Auto-save functionality 