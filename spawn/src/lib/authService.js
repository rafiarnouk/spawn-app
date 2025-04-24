import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Login function to authenticate using the backend API
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    // Extract tokens from response headers
    const accessToken = response.headers.get('Authorization');
    const refreshToken = response.headers.get('X-Refresh-Token');
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Store authentication state
    localStorage.setItem('admin_authenticated', 'true');
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Refresh the access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.get(`${API_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': refreshToken
      }
    });
    
    if (!response.ok) {
      // If refresh fails, clear auth data
      logout();
      throw new Error('Token refresh failed');
    }
    
    const newAccessToken = response.headers.get('Authorization');
    localStorage.setItem('accessToken', newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

// Logout function
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('admin_authenticated');
};

// Authenticated API request with token refresh handling
export const authenticatedRequest = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    throw new Error('Authentication required');
  }
  
  // Set up request with access token
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': accessToken
    }
  };
  
  try {
    let response = await axios.get(url, requestOptions);
    
    // If unauthorized, try to refresh token and retry
    if (response.status === 401) {
      try {
        await refreshAccessToken();
        // Retry with new token
        requestOptions.headers.Authorization = localStorage.getItem('accessToken');
        response = await fetch(url, requestOptions);
      } catch (refreshError) {
        // If refresh fails, force logout
        logout();
        throw new Error('Authentication expired. Please login again.');
      }
    }
    
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Authenticated request error:', error);
    throw error;
  }
}; 