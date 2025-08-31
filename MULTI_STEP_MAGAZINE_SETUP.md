# Multi-Step Magazine Creation System

## Overview
This system replaces the single-page magazine creation with a two-step process:
1. **Step 1**: Create magazine (existing form, unchanged)
2. **Step 2**: Upload PDF pages as images using the magazine ID

## How It Works

### Step 1: Magazine Creation
- Uses the existing `MagazineForm` component unchanged
- Creates the magazine through the existing API
- Dispatches a `magazine-created` event with the magazine ID
- Automatically proceeds to Step 2

### Step 2: PDF Pages Upload
- New `PDFImagesUpload` component
- Accepts multiple image files or folder selection
- Uploads images to R2 using the magazine ID as folder name
- Uses the API: `https://api.echoreads.online/api/v1/user/add-image-to-folder`
- Shows upload progress and queue management

## API Integration

### Image Upload API
- **Endpoint**: `POST https://api.echoreads.online/api/v1/user/add-image-to-folder`
- **Body**: Form-data with `image` (file) and `folderName` (magazine ID)
- **Response**: Success confirmation with file details

### Folder Structure
Images are organized in R2 as:
```
uploads/{magazineId}/
├── page_1.jpg
├── page_2.jpg
├── page_3.jpg
└── ...
```

## Components

### MultiStepMagazineForm
- Wrapper component that manages the two-step flow
- Handles step transitions and data passing
- Listens for magazine creation events

### PDFImagesUpload
- Handles multiple image selection (files or folder)
- Manages upload queue and progress
- Sequential upload with progress tracking
- Error handling and retry capabilities

## Usage

1. Navigate to `/magazines/add`
2. Fill out the magazine form (Step 1)
3. Submit to create the magazine
4. Automatically proceed to Step 2 (PDF pages upload)
5. Select images or folder containing page images
6. Start upload process
7. Monitor progress and completion

## Features

- **File Selection**: Individual files or entire folder
- **Queue Management**: Add/remove files, clear all
- **Progress Tracking**: Individual and overall progress
- **Error Handling**: Per-file error tracking
- **Sequential Upload**: One image at a time to avoid overwhelming server
- **Status Display**: Visual indicators for pending, uploading, completed, error states

## Technical Details

- **Event System**: Custom events for step communication
- **State Management**: React hooks for step and data management
- **File Handling**: Support for multiple file types and folder selection
- **API Integration**: Direct integration with existing magazine creation API
- **Error Recovery**: Graceful handling of upload failures

## Benefits

1. **Preserves Existing Functionality**: No changes to current magazine creation
2. **Adds New Capability**: PDF pages as images with organized storage
3. **User Experience**: Clear step-by-step process with progress feedback
4. **Scalability**: Sequential uploads prevent server overload
5. **Maintainability**: Clean separation of concerns between steps
