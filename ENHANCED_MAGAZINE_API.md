# Enhanced Magazine Creation API Integration

## Overview

The magazine creation system has been enhanced to support audio files and additional metadata fields, fully integrated with the EchoReads API.

## API Endpoint

**External API**: `https://api.echoreads.online/api/v1/admin/create-magzine`
**Local Proxy**: `/api/magazines/create`

### Request Method
- **POST** - Creates a new magazine with enhanced features

## Enhanced Request Schema

### Required Fields
```typescript
interface CreateMagazineRequest {
  name: string;           // Magazine name
  image: string;          // Cover image URL
  file: string;           // Document/PDF URL
}
```

### Optional Fields
```typescript
interface CreateMagazineRequest {
  audioFile?: string;     // Audio file URL (NEW)
  type?: 'free' | 'pro';  // Access type
  magzineType?: 'magzine' | 'article' | 'digest'; // Content type
  description?: string;   // Magazine description
  category?: string;      // Category name
  total_pages?: number;   // Total page count (NEW)
  fileType?: string;      // Document type (pdf, doc, docx) (NEW)
  isActive?: boolean;     // Magazine status (NEW)
  rating?: number;        // Initial rating (0-5) (NEW)
  downloads?: number;     // Initial download count (NEW)
  views?: number;         // Initial view count (NEW)
  likes?: number;         // Initial like count (NEW)
  reads?: number;         // Initial read count (NEW)
}
```

## Enhanced Response Schema

```json
{
  "message": "Magazine created successfully",
  "magazine": {
    "mid": 550523,
    "name": "Tech Weekly Magazine",
    "image": "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/images/tech-weekly-cover.jpg",
    "file": "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/tech-weekly.pdf",
    "type": "pro",
    "fileType": "pdf",
    "magzineType": "magzine",
    "isActive": true,
    "total_pages": 45,
    "category": "technology",
    "audioFile": "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/audio/tech-weekly-audio.mp3",
    "downloads": 0,
    "views": 0,
    "likes": 0,
    "reads": 0,
    "description": "Weekly technology magazine covering latest trends",
    "rating": 0,
    "reviews": [],
    "createdAt": "2025-08-23T11:43:20.077Z",
    "_id": "68a9a958fa3dff039d77dff3",
    "likedBy": [],
    "viewedBy": [],
    "readBy": [],
    "__v": 0
  }
}
```

## New Features

### 🎵 Audio File Support
- **File Types**: MP3, WAV, M4A, OGG, AAC
- **Max Size**: 100MB
- **Storage**: Cloudflare R2 audio folder
- **Optional**: Can be omitted for text-only magazines

### 📄 Total Pages Field
- **Type**: Number (1-1000)
- **Optional**: Can be omitted
- **Purpose**: Track magazine length and reading time

### 📄 File Type Field
- **Type**: String (pdf, doc, docx)
- **Default**: pdf
- **Purpose**: Specify document format

### 🎛️ Magazine Status
- **Type**: Boolean
- **Default**: true
- **Purpose**: Enable/disable magazine visibility

### ⭐ Initial Rating
- **Type**: Number (0-5)
- **Default**: 0
- **Purpose**: Set initial magazine rating

### 📊 Initial Statistics
- **Downloads**: Initial download count
- **Views**: Initial view count
- **Likes**: Initial like count
- **Reads**: Initial read count
- **Purpose**: Set starting analytics values

## Implementation Details

### 1. Backend API (`pages/api/magazines/create.ts`)
```typescript
// Enhanced request body
const requestBody = {
  name,
  image,
  file,
  audioFile: audioFile || null,
  type: type || 'free',
  magzineType: magzineType || 'magzine',
  description: description || '',
  category: category || 'other',
  total_pages: total_pages || null,
  fileType: fileType || 'pdf',
  isActive: isActive !== undefined ? isActive : true,
  rating: rating || 0,
  downloads: downloads || 0,
  views: views || 0,
  likes: likes || 0,
  reads: reads || 0
};
```

### 2. File Upload Support (`pages/api/upload.ts`)
```typescript
// Enhanced file type validation
const allowedTypes = [
  'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac'
];
```

### 3. Frontend Form (`components/magazines/MagazineForm.tsx`)
- **Audio File Input**: Optional audio upload field
- **Total Pages Input**: Number input for page count
- **File Type Selector**: PDF, DOC, DOCX options
- **Status Toggle**: Active/Inactive magazine toggle
- **Initial Rating**: Rating input (0-5)
- **Initial Statistics**: Downloads, Views, Likes, Reads inputs
- **Enhanced Validation**: Audio file type and size validation
- **Progress Tracking**: Multi-step upload progress

### 4. API Integration (`lib/api.ts`)
```typescript
export const createMagazine = async (magazineData: {
  name: string;
  image: string;
  file: string;
  audioFile?: string;
  type: 'free' | 'pro';
  magzineType: 'magzine' | 'article' | 'digest';
  description: string;
  category?: string;
  total_pages?: number;
  fileType?: string;
  isActive?: boolean;
  rating?: number;
  downloads?: number;
  views?: number;
  likes?: number;
  reads?: number;
}): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }>
```

## File Upload Process

### 1. Image Upload
- **Folder**: `covers/`
- **Progress**: 20%
- **Validation**: JPEG, PNG, WebP (10MB max)

### 2. Document Upload
- **Folder**: `documents/`
- **Progress**: 60%
- **Validation**: PDF, DOC, DOCX (50MB max)

### 3. Audio Upload (Optional)
- **Folder**: `audio/`
- **Progress**: 90%
- **Validation**: MP3, WAV, M4A, OGG, AAC (100MB max)

## Form Features

### Enhanced UI Components
- **Audio File Input**: Purple-themed file input
- **Total Pages Input**: Number input with validation
- **File Type Selector**: Dropdown for document format
- **Status Toggle**: Checkbox for active/inactive status
- **Initial Rating**: Number input with step validation
- **Statistics Grid**: 4-column grid for initial stats
- **Progress Bar**: Multi-step upload progress
- **File Previews**: Image previews and file names

### Validation Rules
- **Required Fields**: Name, Image, Document
- **Optional Fields**: Audio, Total Pages, Description, Category, File Type, Status, Rating, Statistics
- **File Size Limits**: Images (10MB), Documents (50MB), Audio (100MB)
- **File Type Validation**: Strict MIME type checking
- **Number Validation**: Rating (0-5), Statistics (≥0), Pages (1-1000)
- **Boolean Validation**: Status toggle (true/false)

## Usage Examples

### Basic Magazine Creation
```typescript
const result = await createMagazine({
  name: "Tech Weekly",
  description: "Weekly technology updates",
  category: "Technology",
  type: "free",
  magzineType: "magzine",
  image: "https://example.com/cover.jpg",
  file: "https://example.com/document.pdf"
});
```

### Magazine with Audio
```typescript
const result = await createMagazine({
  name: "Audio Magazine",
  description: "Magazine with audio narration",
  category: "Education",
  type: "pro",
  magzineType: "article",
  image: "https://example.com/cover.jpg",
  file: "https://example.com/document.pdf",
  audioFile: "https://example.com/audio.mp3",
  total_pages: 25
});
```

### Magazine with All Fields
```typescript
const result = await createMagazine({
  name: "Complete Magazine",
  description: "Magazine with all features enabled",
  category: "Technology",
  type: "pro",
  magzineType: "magzine",
  image: "https://example.com/cover.jpg",
  file: "https://example.com/document.pdf",
  audioFile: "https://example.com/audio.mp3",
  total_pages: 50,
  fileType: "pdf",
  isActive: true,
  rating: 4.5,
  downloads: 0,
  views: 0,
  likes: 0,
  reads: 0
});
```

## Error Handling

### File Upload Errors
- **Invalid File Type**: Clear error messages for unsupported formats
- **File Size Exceeded**: Size limit warnings
- **Upload Failures**: Network error handling with retry options

### API Errors
- **Validation Errors**: Field-specific error messages
- **Authentication Errors**: Token validation and refresh
- **Network Errors**: Connection timeout and retry logic

## Security Features

### File Security
- **Type Validation**: Strict MIME type checking
- **Size Limits**: Prevent large file uploads
- **Virus Scanning**: Cloudflare R2 security features
- **Access Control**: Public read, admin write permissions

### API Security
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: API usage limits

## Testing

### Test Page
Navigate to `/test-magazine` to test the enhanced API:
- Test with audio files
- Test with total pages
- Verify response format
- Check error handling

### Manual Testing
1. **Create Magazine**: Use the form at `/magazines/add`
2. **Upload Audio**: Test audio file upload
3. **Set Pages**: Enter total page count
4. **Verify Response**: Check created magazine data

## Future Enhancements

### Planned Features
- **Audio Preview**: Audio player in form
- **Bulk Upload**: Multiple file upload support
- **Audio Transcription**: Auto-generated transcripts
- **Advanced Analytics**: Detailed usage statistics

### Performance Optimizations
- **Chunked Uploads**: Large file upload support
- **Image Optimization**: Automatic image compression
- **Audio Compression**: Audio file optimization
- **Caching**: Response caching for better performance

## Troubleshooting

### Common Issues

1. **Audio Upload Fails**
   - Check file format (MP3, WAV, M4A, OGG, AAC)
   - Verify file size (max 100MB)
   - Check network connection

2. **Total Pages Not Saved**
   - Ensure number is between 1-1000
   - Check form validation
   - Verify API response

3. **File Upload Progress Issues**
   - Check browser console for errors
   - Verify Cloudflare R2 configuration
   - Check network connectivity

### Debug Information
```typescript
// Enable debug logging
localStorage.setItem('debug', 'true');

// Check API response
console.log('API Response:', result);
```

---

**Last Updated**: August 2024
**Version**: 2.0.0
**Status**: Production Ready with Audio Support
