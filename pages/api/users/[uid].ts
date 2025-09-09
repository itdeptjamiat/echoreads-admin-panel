import { NextApiRequest, NextApiResponse } from 'next';

interface GetUserDetailsResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: Record<string, unknown>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserDetailsResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
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

    const { uid } = req.query;

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'User UID is required'
      });
    }

    // Fetching user details for UID

    // Use the correct endpoint that works with the data structure
    const endpoint = `https://api.echoreads.online/api/v1/user/profile/${uid}`;
    
    // Using endpoint
    
    const externalResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    // Response status

    if (externalResponse.ok) {
      const data = await externalResponse.json();
      // Success response data
      
      // Forward the response from external API
      return res.status(externalResponse.status).json(data);
    } else {
      const errorData = await externalResponse.json();
      // Error response
      return res.status(externalResponse.status).json({
        success: false,
        message: errorData.message || errorData.error || 'Failed to fetch user details',
        error: errorData
      });
    }

      } catch {
    // Error fetching user details silently handled
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 