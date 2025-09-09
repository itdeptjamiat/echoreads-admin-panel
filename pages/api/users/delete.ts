import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Delete user API called with body
    
    // Get authorization header from the request
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      // No authorization header found
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    // Get the user ID from the request body
    const { uid } = req.body;
    
    if (!uid) {
      // No uid found in request body
      return res.status(400).json({
        success: false,
        message: 'User ID (uid) is required'
      });
    }

    // Deleting user with uid

    // Forward request to external API
    const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/delete-user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ uid })
    });

    const data = await externalResponse.json();

    // Forward the response from external API
    return res.status(externalResponse.status).json(data);

      } catch {
    // Error deleting user silently handled
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 