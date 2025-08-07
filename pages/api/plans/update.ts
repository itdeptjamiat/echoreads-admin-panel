import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header required' });
    }

    const token = authHeader.substring(7);

    // Validate required fields
    const { planType, ...updateData } = req.body;
    if (!planType) {
      return res.status(400).json({ message: 'Plan type is required' });
    }

    // Debug logging


    // Prepare the request to external API
    const apiUrl = 'https://api.echoreads.online/api/v1/admin/plan/update';
    
    const externalApiData = {
      planType,
      ...updateData
    };


    
    const externalResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(externalApiData)
    });

    // Handle response
    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: 'External API error', details: errorText };
      }
      
      
      
      return res.status(externalResponse.status).json({
        success: false,
        message: errorData.message || 'Failed to update plan',
        details: errorData.details || errorText
      });
    }

    const responseData = await externalResponse.json();
    
    
    return res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: responseData.plan || responseData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 