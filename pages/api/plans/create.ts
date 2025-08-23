import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

    // Validate request body
    const { 
      planType, 
      price, 
      currency = 'USD', 
      duration = 1, 
      features = [], 
      maxDownloads = 0, 
      maxMagazines = 0, 
      description = '',
      discountPercentage = 0,
      discountValidUntil = null
    } = req.body;
    
    // Debug logging

    
    if (!planType || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: planType and price are required.'
      });
    }

    // Validate that 'planType' is one of the allowed values
    const allowedPlanTypes = ['free', 'echopro', 'echoproplus'];
    if (!allowedPlanTypes.includes(planType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid planType. Must be one of: "free", "echopro", "echoproplus".'
      });
    }

    // Validate price for free plan
    if (planType === 'free' && price !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Free plan must have price set to 0.'
      });
    }

    // Validate discount percentage
    if (discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({
        success: false,
        message: 'Discount percentage must be between 0 and 100.'
      });
    }

    // Prepare data for external API
    const externalApiData = {
      planType,
      price,
      currency,
      duration,
      features,
      maxDownloads,
      maxMagazines,
      description,
      discountPercentage,
      discountValidUntil
    };



    // Forward request to external API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/plan/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(externalApiData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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