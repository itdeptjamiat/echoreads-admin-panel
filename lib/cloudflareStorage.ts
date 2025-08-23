// Cloudflare Storage utility for handling file uploads

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  bucketName: string;
  publicUrl: string;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Get Cloudflare configuration from environment variables
export const getCloudflareConfig = (): CloudflareConfig => {
  return {
    accountId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || '',
    apiToken: process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN || '',
    bucketName: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME || '',
    publicUrl: process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL || '',
  };
};

// Upload file to Cloudflare R2 using signed URLs
export const uploadToCloudflare = async (
  file: File,
  folder: string = 'magazines'
): Promise<UploadResponse> => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `magazines/${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Starting upload process

    // Get signed URL for direct upload
    const signedUrlResponse = await fetch('/api/r2-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType: file.type,
      }),
    });

    // Signed URL response status

    if (!signedUrlResponse.ok) {
      const errorData = await signedUrlResponse.json();
      // Signed URL error silently handled
      throw new Error(errorData.error || `Failed to get signed URL: ${signedUrlResponse.status}`);
    }

    const signedUrlData = await signedUrlResponse.json();

    if (!signedUrlData.uploadURL) {
      throw new Error(signedUrlData.error || 'Failed to get signed URL');
    }

    // Got signed URL, uploading file

    // Upload directly to Cloudflare R2 using signed URL
    const uploadResponse = await fetch(signedUrlData.uploadURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // Upload response status

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      // Upload error response silently handled
      throw new Error(`Upload failed with status: ${uploadResponse.status} - ${errorText}`);
    }

    // Generate public URL - use the fileName directly since it already includes the path
    const publicUrl = `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/${fileName}`;

    // Upload successful, public URL

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    // Cloudflare upload error silently handled
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

// Validate file type and size
export const validateFile = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac'],
  maxSize: number = 50 * 1024 * 1024 // 50MB default
): { valid: boolean; error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  return { valid: true };
};

// Generate public URL for uploaded file
export const getPublicUrl = (fileName: string): string => {
  const config = getCloudflareConfig();
  return `${config.publicUrl}/${fileName}`;
}; 