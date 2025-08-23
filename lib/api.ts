// API utility functions for authentication
import { getLoginApiUrl, API_CONFIG } from './config';
import { 
  setStoredToken, 
  setStoredUser, 
  removeStoredToken, 
  removeStoredUser, 
  getStoredToken, 
  getStoredUser,
  isUserAuthenticated,
  clearAuthData
} from './tokenManager';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  userType?: string;
}

// Token management (using new token manager)
export const getToken = (): string | null => {
  return getStoredToken();
};

export const setToken = (token: string): void => {
  setStoredToken(token);
};

export const removeToken = (): void => {
  removeStoredToken();
};

export const getUser = (): User | null => {
  return getStoredUser();
};

export const setUser = (user: User): void => {
  setStoredUser(user);
};

export const removeUser = (): void => {
  removeStoredUser();
};

// API call functions
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT);

    const apiUrl = getLoginApiUrl();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    // Handle the external API response format
    if (response.ok && (data.success || data.message === 'Login successful')) {
      // Extract token from response (handle different possible formats)
      let token = data.token || data.access_token || data.accessToken || data.jwt || data.user?.jwtToken || data.user?.user?.jwtToken || data.user?.token || data.user?.user?.token;
      
      // If no token found in standard locations, search more thoroughly
      if (!token) {
        // Search through the entire response object for JWT-like strings
        const searchForToken = (obj: unknown): string | null => {
          if (typeof obj === 'string') {
            // Check if this string looks like a JWT token
            if (obj.includes('.') && obj.split('.').length === 3 && obj.length > 50) {
              return obj;
            }
            return null;
          }
          
          if (typeof obj === 'object' && obj !== null) {
            for (const [, value] of Object.entries(obj as Record<string, unknown>)) {
              const result = searchForToken(value);
              if (result) {
                return result;
              }
            }
          }
          
          return null;
        };
        
        token = searchForToken(data);
      }
      
      // Extract user data from response (handle nested user structure)
      const userInfo = data.user?.user || data.user || data;
      const userData = {
        id: userInfo?.id || userInfo?._id || `user-${Date.now()}`,
        email: userInfo?.email || credentials.email,
        name: userInfo?.name || userInfo?.username || 'User',
        role: userInfo?.role || 'user',
        userType: userInfo?.userType || 'user'
      };

      // Check if userType is admin
      if (userData.userType !== 'admin') {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.',
        };
      }

      // Store only the token, not user data
      if (token) {
        try {
          setToken(token);
        } catch {
          // Error storing token silently handled
          // Continue with login even if token storage fails
        }
      } else {
        // Try to extract token from user object if available
        if (data.user && typeof data.user === 'object') {
          const userKeys = Object.keys(data.user);
          
          // Look for any key that might contain a token
          for (const key of userKeys) {
            const value = data.user[key];
            if (typeof value === 'string' && value.length > 50 && value.includes('.')) {
              try {
                setToken(value);
                break;
              } catch {
                // Failed to store extracted token silently handled
              }
            }
          }
        }
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        token: token,
        user: userData // Return user data but don't store it
      };
    } else {
      return {
        success: false,
        message: data.message || 'Invalid email or password',
      };
    }
  } catch (error: unknown) {
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.',
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
};

// Get authorization headers with token
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fetch users from API
export const fetchUsers = async (): Promise<{ success: boolean; data?: Record<string, unknown>[]; message?: string }> => {
  try {
    const token = getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found. Please login again.'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT);

    // Use the proxy API route instead of calling external API directly
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please login again.'
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.'
        };
      }
      
      return {
        success: false,
        message: `Failed to fetch users. Status: ${response.status}`
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.users || data.data || data
    };

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch users. Please try again.'
    };
  }
};

// Fetch magazines from API
export const fetchMagazines = async (): Promise<{ success: boolean; data?: Record<string, unknown>[]; message?: string }> => {
  try {
    const token = getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found. Please login again.'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT);

    // Use the proxy API route instead of calling external API directly
    const response = await fetch('/api/magazines', {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please login again.'
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.'
        };
      }
      
      return {
        success: false,
        message: `Failed to fetch magazines. Status: ${response.status}`
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.magazines || data.data || data
    };

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch magazines. Please try again.'
    };
  }
};

// Create magazine API
export const createMagazine = async (magazineData: {
  name: string; 
  image: string; 
  file: string; 
  audioFile?: string;
  type: 'free' | 'pro'; 
  magzineType: 'magzine' | 'article' | 'digest'; 
  description: string; 
  category?: string;
  total_pages?: number;
  fileType?: string;
  isActive?: boolean;
  rating?: number;
  downloads?: number;
  views?: number;
  likes?: number;
  reads?: number;
}): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/magazines/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(magazineData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.error || errorData.message || 'Failed to create magazine' };
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch {
    // Error creating magazine silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Update magazine API
export const updateMagazine = async (mid: number, magazineData: {
  name?: string; image?: string; file?: string; type?: 'free' | 'pro'; magzineType?: 'magzine' | 'article' | 'digest'; description?: string; category?: string;
}): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/magazines/update', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mid, ...magazineData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to update magazine' };
    }

    const data = await response.json();
    return { success: true, data: data.magazine || data.data || data, message: data.message || 'Magazine updated successfully' };
  } catch {
    // Error updating magazine silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Delete magazine API
export const deleteMagazine = async (mid: number | string): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    // Ensure mid is a number
    const numericMid = Number(mid);
    if (isNaN(numericMid)) {
      return { success: false, message: 'Invalid magazine ID' };
    }

    const response = await fetch('/api/magazines/delete', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mid: numericMid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to delete magazine' };
    }

    const data = await response.json();
    return { success: true, message: data.message || 'Magazine deleted successfully' };
  } catch {
    // Error deleting magazine silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Get magazine details by MID API
export const getMagazineDetails = async (mid: string | number): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    // getMagazineDetails called with mid
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    // Ensure mid is a number for the API call
    const numericMid = Number(mid);
    if (isNaN(numericMid)) {
      return { success: false, message: 'Invalid magazine ID' };
    }

    const response = await fetch(`/api/magazines/${numericMid}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to fetch magazine details' };
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch {
    // Error fetching magazine details silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Get user details by UID API
export const getUserDetails = async (uid: string | number): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    // getUserDetails called with uid
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    // Ensure uid is a number for the API call
    const numericUid = Number(uid);
    if (isNaN(numericUid)) {
      return { success: false, message: 'Invalid user ID' };
    }

    const response = await fetch(`/api/users/${numericUid}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to fetch user details' };
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch {
    // Error fetching user details silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Delete user API
export const deleteUser = async (uid: string | number): Promise<{ success: boolean; message?: string }> => {
  try {
    // deleteUser called with uid
    const token = getToken();
    if (!token) {
      // No token found
      return { success: false, message: 'No authentication token found' };
    }

    // Ensure uid is a number
    const numericUid = Number(uid);
    if (isNaN(numericUid)) {
      return { success: false, message: 'Invalid user ID' };
    }

    // Making delete request to /api/users/delete with numeric uid
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ uid: numericUid }),
    });

    // Delete response status
    if (!response.ok) {
      const errorData = await response.json();
      // Delete error response
      return { success: false, message: errorData.message || errorData.error || 'Failed to delete user' };
    }

    const data = await response.json();
    // Delete success response
    return { success: true, message: data.message || 'User deleted successfully' };
  } catch {
    // Error deleting user silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Create user API
export const createUser = async (userData: {
  email: string;
  username: string;
  password: string;
  name: string;
}): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    // createUser called with data
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    // Create user response status
    if (!response.ok) {
      const errorData = await response.json();
      // Create user error response
      return { success: false, message: errorData.message || errorData.error || 'Failed to create user' };
    }

    const data = await response.json();
    // Create user success response
    return { success: true, data: data.data || data, message: data.message || 'User created successfully' };
  } catch {
    // Error creating user silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const logoutUser = (): void => {
  clearAuthData();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return isUserAuthenticated();
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getUser();
};

// Extract user ID from JWT token
export const extractUserIdFromToken = (): string | null => {
  try {
    const token = getToken();
    if (!token) return null;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Look for user ID in common fields (prioritize numeric uid over MongoDB ObjectId)
    const uid = payload.uid || payload.userId || payload.user_id || payload.id || payload.sub || payload._id || null;
    
    return uid;
  } catch {
    return null;
  }
};

// Extract admin ID from JWT token (returns numeric ID)
export const extractAdminIdFromToken = (): number | null => {
  try {
    const token = getToken();
    if (!token) return null;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Look for user ID in common fields and convert to number
    const uid = payload.uid || payload.userId || payload.user_id || payload.id || payload.sub || payload._id || null;
    
    if (uid) {
      const numericUid = Number(uid);
      return isNaN(numericUid) ? null : numericUid;
    }
    
    return null;
  } catch {
    return null;
  }
}; 

// Categories API functions
export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const fetchCategories = async (): Promise<{ success: boolean; data?: Category[]; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message || 'Failed to fetch categories' };
    }
  } catch {
    // Error fetching categories silently handled
    return { success: false, message: 'Failed to fetch categories' };
  }
};

export const addCategory = async (name: string): Promise<{ success: boolean; data?: Category[]; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // After successful addition, fetch the updated list
      const updatedCategories = await fetchCategories();
      return { 
        success: true, 
        data: updatedCategories.data, 
        message: data.message || 'Category added successfully' 
      };
    } else {
      return { success: false, message: data.message || 'Failed to add category' };
    }
  } catch {
    // Error adding category silently handled
    return { success: false, message: 'Failed to add category' };
  }
};

export const deleteCategory = async (categoryName: string): Promise<{ success: boolean; data?: Category[]; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/categories', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ categoryName }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, message: data.message || 'Failed to delete category' };
    }
  } catch {
    // Error deleting category silently handled
    return { success: false, message: 'Failed to delete category' };
  }
};

export const updateCategory = async (oldName: string, newName: string): Promise<{ success: boolean; data?: Category[]; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldName, newName }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, message: data.message || 'Failed to update category' };
    }
  } catch {
    // Error updating category silently handled
    return { success: false, message: 'Failed to update category' };
  }
};

// Plan API functions
export interface Plan {
  _id?: string;
  planType: 'free' | 'echopro' | 'echoproplus';
  price: number;
  currency?: string;
  duration?: number;
  features?: string[];
  maxDownloads?: number;
  maxMagazines?: number;
  description?: string;
  discountPercentage?: number;
  discountValidUntil?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const createPlan = async (planData: Plan): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }



    const response = await fetch('/api/plans/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to create plan' };
    }

    const data = await response.json();

    return { success: true, data: data.plan || data.data || data, message: data.message || 'Plan created successfully' };
  } catch {
    // Error creating plan silently handled
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const fetchPlans = async (): Promise<{ success: boolean; data?: Plan[]; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/plans', {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to fetch plans' };
    }

    const data = await response.json();
    return { success: true, data: data.plans || data.data || [], message: data.message || 'Plans fetched successfully' };
  } catch {
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const deletePlan = async (planType: string, uid: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/plans/delete', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planType, uid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to delete plan' };
    }

    const data = await response.json();
    return { success: true, message: data.message || 'Plan deleted successfully' };
  } catch {
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const updatePlan = async (planType: string, updateData: Partial<Plan>): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/plans/update', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        planType,
        ...updateData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to update plan' };
    }

    const data = await response.json();
    return { success: true, data: data.plan || data.data || data, message: data.message || 'Plan updated successfully' };
  } catch {
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Change user type API
export const changeUserType = async (userId: number, newUserType: string, adminId: number): Promise<{ success: boolean; data?: Record<string, unknown>; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    // Validate inputs
    if (!userId || !newUserType || !adminId) {
      return { success: false, message: 'userId, newUserType, and adminId are required' };
    }

    // Ensure numeric values
    const numericUserId = Number(userId);
    const numericAdminId = Number(adminId);

    if (isNaN(numericUserId) || isNaN(numericAdminId)) {
      return { success: false, message: 'userId and adminId must be valid numbers' };
    }

    // Validate user type
    const validUserTypes = ['admin', 'user'];
    if (!validUserTypes.includes(newUserType)) {
      return { success: false, message: 'newUserType must be one of: admin, user' };
    }

    const requestBody = {
      userId: numericUserId,
      newUserType: newUserType,
      adminId: numericAdminId
    };

    const response = await fetch('/api/users/change-type', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || errorData.error || 'Failed to change user type' };
    }

    const data = await response.json();
    return { success: true, data: data.data || data, message: data.message || 'User type changed successfully' };
  } catch {
    return { success: false, message: 'An unexpected error occurred' };
  }
}; 