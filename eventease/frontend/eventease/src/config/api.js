// src/config/api.js

// API Base URL - uses proxy in development, direct URL in production
const getApiBaseUrl = () => {
  // In development: use /api proxy (configured in vite.config.js)
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // In production: use environment variable or direct URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF: 1.5
  },
  HEALTH_CHECK_URL: '/api/health',
  HEALTH_CHECK_INTERVAL: 10000
};

// Fetch with retry logic
export const fetchWithRetry = async (url, options = {}, maxAttempts = API_CONFIG.RETRY.MAX_ATTEMPTS) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF, attempt - 1);
        console.warn(`Request failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(API_CONFIG.HEALTH_CHECK_URL, {
      method: 'GET'
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed');
    return false;
  }
};

export default API_CONFIG;