import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import AWS from 'aws-sdk';
import fs from 'fs';

// Disable body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  data?: {
    url: string;
    key: string;
    fileName: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  console.log('Upload API called:', req.method, req.url);
  
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowEmptyFiles: false,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
        } else {
          console.log('Form parsed successfully. Fields:', Object.keys(fields), 'Files:', Object.keys(files));
          resolve([fields, files]);
        }
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const image = Array.isArray(files.image) ? files.image[0] : files.image;
    const fileName = Array.isArray(fields.fileName) ? fields.fileName[0] : fields.fileName;
    const folderName = Array.isArray(fields.folderName) ? fields.folderName[0] : fields.folderName;
    
    // Use image field if available (for PDFImagesUpload), otherwise use file field
    const uploadFile = image || file;

    if (!uploadFile) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    // Generate file name if not provided
    const finalFileName = fileName || uploadFile.originalFilename || `upload_${Date.now()}`;
    
    // If folderName is provided, create folder structure
    const uploadKey = folderName ? `${folderName}/${finalFileName}` : finalFileName;

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac'
    ];
    if (!allowedTypes.includes(uploadFile.mimetype || '')) {
      return res.status(400).json({
        success: false,
        error: `File type ${uploadFile.mimetype} is not allowed`
      });
    }

    // Get Cloudflare R2 configuration (hardcoded for now)
    // const accountId = 'ef6de2d4389d2f6608f081f1c3405a28';
    const accessKeyId = 'e680e4254dfba4e0bf0d481cd0c7c0bf';
    const secretAccessKey = '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e';
    const bucketName = 'echoreads';
    const publicUrl = 'https://pub-b8050509235e4bcca261901d10608e30.r2.dev';

    // Initialize S3 client for Cloudflare R2
    const s3 = new AWS.S3({
      endpoint: 'https://ef6de2d4389d2f6608f081f1c3405a28.r2.cloudflarestorage.com',
      accessKeyId,
      secretAccessKey,
      region: 'auto',
      signatureVersion: 'v4',
    });

    // Read file buffer
    const fileBuffer = fs.readFileSync(uploadFile.filepath);

    // Upload to Cloudflare R2
    await s3.upload({
      Bucket: bucketName,
      Key: uploadKey,
      Body: fileBuffer,
      ContentType: uploadFile.mimetype || 'application/octet-stream',
      ACL: 'public-read',
    }).promise();

    // Generate public URL
    const publicFileUrl = `${publicUrl}/${uploadKey}`;

    // Clean up temporary file
    fs.unlinkSync(uploadFile.filepath);

    return res.status(200).json({
      success: true,
      url: publicFileUrl,
      data: {
        url: publicFileUrl,
        key: uploadKey,
        fileName: finalFileName
      }
    });

  } catch (error) {
    // Upload error silently handled
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    });
  }
} 