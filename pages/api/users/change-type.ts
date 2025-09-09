import type { NextApiRequest, NextApiResponse } from 'next';

interface ChangeUserTypeRequest {
  userId: number;
  newUserType: string;
  adminId: number;
}

interface ChangeUserTypeResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: Record<string, unknown>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChangeUserTypeResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow PUT requests
  if (req.method !== 'PUT') {
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

    const { userId, newUserType, adminId }: ChangeUserTypeRequest = req.body;

    // Validate required fields
    if (!userId || !newUserType || !adminId) {
      return res.status(400).json({
        success: false,
        message: 'userId, newUserType, and adminId are required'
      });
    }

    // Ensure userId and adminId are numbers
    const numericUserId = Number(userId);
    const numericAdminId = Number(adminId);

    // Validate that the values are valid numbers
    if (isNaN(numericUserId) || isNaN(numericAdminId)) {
      return res.status(400).json({
        success: false,
        message: 'userId and adminId must be valid numbers'
      });
    }

    // Validate user type
    const validUserTypes = ['admin', 'user'];
    if (!validUserTypes.includes(newUserType)) {
      return res.status(400).json({
        success: false,
        message: 'newUserType must be one of: admin, user'
      });
    }

    // Prepare request body with numeric data
    const requestBody = {
      userId: numericUserId,
      newUserType: newUserType,
      adminId: numericAdminId
    };

    // Forward request to external API
    const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/change-user-type', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(requestBody)
    });

    const data = await externalResponse.json();



    // Forward the response from external API
    return res.status(externalResponse.status).json(data);

  } catch {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 