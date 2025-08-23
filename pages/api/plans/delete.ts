import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow DELETE and POST requests (POST as fallback)
  if (req.method !== 'DELETE' && req.method !== 'POST') {
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

    // Validate request body
    const { planType, uid } = req.body;
    
    if (!planType) {
      return res.status(400).json({
        success: false,
        message: 'Plan type is required'
      });
    }

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID (uid) is required'
      });
    }

    // Forward request to external API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const requestBody = { planType, uid };

    // Use DELETE method as the external API only accepts DELETE
    const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/plan/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let data;
    let responseText = '';
    
    try {
      // First, get the response as text
      responseText = await externalResponse.text();
      
      // Then try to parse it as JSON
      try {
        data = JSON.parse(responseText);
      } catch {
        return res.status(500).json({
          success: false,
          message: 'Invalid JSON response from external API'
        });
      }
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Failed to read response from external API'
      });
    }

    // Forward the response from external API
    return res.status(externalResponse.status).json(data);

  } catch {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 