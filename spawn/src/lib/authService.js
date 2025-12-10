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
      credentials: 'include',
      body: JSON.stringify({
        usernameOrEmail: username,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    // Extract tokens from response headers
    const accessToken = response.headers.get('Authorization');
    const refreshToken = response.headers.get('X-Refresh-Token');
    
    console.log('Login - Access Token received:', accessToken ? 'Yes' : 'No');
    console.log('Login - Refresh Token received:', refreshToken ? 'Yes' : 'No');
    
    if (!accessToken || !refreshToken) {
      console.error('Missing tokens in response headers');
      throw new Error('Authentication failed: Missing tokens');
    }
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Store authentication state
    localStorage.setItem('admin_authenticated', 'true');
    
    console.log('Tokens stored successfully');
    
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
    
    console.log('Refresh token present:', refreshToken ? 'Yes' : 'No');
    console.log('Refresh token starts with Bearer:', refreshToken?.startsWith('Bearer ') ? 'Yes' : 'No');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Backend expects refresh token with "Bearer " prefix in Authorization header
    const authHeader = refreshToken.startsWith('Bearer ') ? refreshToken : `Bearer ${refreshToken}`;
    console.log('Sending refresh request with auth header starting with:', authHeader.substring(0, 20) + '...');
    
    const response = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, null, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('Refresh response status:', response.status);
    
    if (response.status !== 200) {
      // If refresh fails, clear auth data
      logout();
      throw new Error('Token refresh failed');
    }
    
    // Axios stores headers in response.headers (lowercase object keys)
    const newAccessToken = response.headers['authorization'] || response.headers['Authorization'];
    console.log('New access token received:', newAccessToken ? 'Yes' : 'No');
    
    localStorage.setItem('accessToken', newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    logout();
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
  
  console.log('Authenticated request to:', url);
  console.log('Access token present:', accessToken ? 'Yes' : 'No');
  console.log('Access token starts with Bearer:', accessToken?.startsWith('Bearer ') ? 'Yes' : 'No');
  
  if (!accessToken) {
    throw new Error('Authentication required');
  }
  
  // Set up request with access token
  const requestOptions = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Authorization': accessToken
    }
  };
  
  try {
    let response = await fetch(url, requestOptions);
    
    console.log('Response status:', response.status);
    
    // If unauthorized, try to refresh token and retry
    if (response.status === 401) {
      console.log('Got 401, attempting token refresh...');
      try {
        await refreshAccessToken();
        // Retry with new token
        requestOptions.headers.Authorization = localStorage.getItem('accessToken');
        console.log('Retrying request with new token...');
        response = await fetch(url, requestOptions);
        console.log('Retry response status:', response.status);
      } catch (refreshError) {
        // If refresh fails, force logout
        console.error('Token refresh failed:', refreshError);
        logout();
        throw new Error('Authentication expired. Please login again.');
      }
    }
    
    if (response.status !== 200) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    
    return response;
  } catch (err) {
    console.error('Authenticated request error:', err);
    throw err;
  }
}; 