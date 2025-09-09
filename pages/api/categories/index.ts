import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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

    switch (req.method) {
      case 'GET':
        // Fetch all categories from EchoReads API
        try {
          const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/categories', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            }
          });

          const data = await externalResponse.json();

          // Forward the response from external API
          return res.status(externalResponse.status).json(data);
        } catch {
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch categories from external API'
          });
        }

      case 'POST':
        // Add a new category using EchoReads API
        const { name } = req.body;
        
        if (!name || typeof name !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Category name is required'
          });
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
          return res.status(400).json({
            success: false,
            message: 'Category name cannot be empty'
          });
        }

        try {
          const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/category/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            },
            body: JSON.stringify({ name: trimmedName })
          });

          const data = await externalResponse.json();

          // Forward the response from external API
          return res.status(externalResponse.status).json(data);
        } catch {
          return res.status(500).json({
            success: false,
            message: 'Failed to add category to external API'
          });
        }

      case 'DELETE':
        // Delete a category - using EchoReads API if available
        const { categoryName } = req.body;
        
        if (!categoryName || typeof categoryName !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Category name is required for deletion'
          });
        }

        try {
          // Note: Using the categories endpoint to get updated list after deletion
          // The actual deletion would need to be implemented based on EchoReads API
          const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/categories', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            }
          });

          const data = await externalResponse.json();

          return res.status(200).json({
            success: true,
            message: 'Category deletion not yet implemented in external API',
            data: data.data || []
          });
        } catch {
          return res.status(500).json({
            success: false,
            message: 'Failed to process category deletion'
          });
        }

      case 'PUT':
        // Update a category - using EchoReads API if available
        const { oldName, newName } = req.body;
        
        if (!oldName || !newName || typeof oldName !== 'string' || typeof newName !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Both old and new category names are required'
          });
        }


        const trimmedNewName = newName.trim();
        
        if (!trimmedNewName) {
          return res.status(400).json({
            success: false,
            message: 'New category name cannot be empty'
          });
        }

        try {
          // Note: Using the categories endpoint to get updated list after update
          // The actual update would need to be implemented based on EchoReads API
          const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/categories', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            }
          });

          const data = await externalResponse.json();

          return res.status(200).json({
            success: true,
            message: 'Category update not yet implemented in external API',
            data: data.data || []
          });
        } catch {
          return res.status(500).json({
            success: false,
            message: 'Failed to process category update'
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 