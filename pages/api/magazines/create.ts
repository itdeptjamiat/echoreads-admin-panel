import type { NextApiRequest, NextApiResponse } from 'next';

interface CreateMagazineRequest {
  name: string;
  image: string;
  file: string;
  audioFile?: string;
  type?: 'free' | 'pro';
  magzineType?: 'magzine' | 'article' | 'digest';
  description?: string;
  category?: string;
  total_pages?: number;
  fileType?: string;
  isActive?: boolean;
  rating?: number;
  downloads?: number;
  views?: number;
  likes?: number;
  reads?: number;
}

interface CreateMagazineResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateMagazineResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get authorization header from the request
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    const { 
      name, image, file, audioFile, type, magzineType, description, category, total_pages,
      fileType, isActive, rating, downloads, views, likes, reads 
    }: CreateMagazineRequest = req.body;

    // Validate required fields
    if (!name || !image || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, image, and file are required'
      });
    }

    // Validate type enum if provided
    if (type && !['free', 'pro'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "free" or "pro"'
      });
    }

    // Validate magzineType enum if provided
    if (magzineType && !['magzine', 'article', 'digest'].includes(magzineType)) {
      return res.status(400).json({
        success: false,
        message: 'MagzineType must be either "magzine", "article", or "digest"'
      });
    }

    // Prepare request body - include all supported fields
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

    // Forward request to external API
    const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/create-magzine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(requestBody)
    });

    const data = await externalResponse.json();

    // Debug: Log the external API response
    console.log('External API Response Status:', externalResponse.status);
    console.log('External API Response Data:', data);
    console.log('External API Response Keys:', Object.keys(data));

    // Forward the response from external API
    return res.status(externalResponse.status).json(data);

      } catch {
    // Error creating magazine silently handled
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 