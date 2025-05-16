// SessionMonitor.js
import axios from 'axios';

class SessionMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.checkEndpoint = options.checkEndpoint || '/api/auth/session-status';
    this.refreshEndpoint = options.refreshEndpoint || '/api/auth/refresh-token';
    this.onSessionInvalid = options.onSessionInvalid || (() => {});
    this.onError = options.onError || (() => {});
    this.intervalId = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    
    // Set up axios interceptor to handle silent token refreshing
    this.setupAxiosInterceptor();
  }
  
  setupAxiosInterceptor() {
    // Response interceptor to catch 401 errors
    axios.interceptors.response.use(
      response => response,
      async error => {
        // Only attempt refresh if it's a 401 error with TOKEN_EXPIRED reason
        if (error.response?.status === 401 && 
            error.response.data?.reason === 'TOKEN_EXPIRED' &&
            error.config && !error.config.__isRetryRequest) {
          
          // Wait for token refresh
          const refreshed = await this.refreshAuthToken();
          
          if (refreshed) {
            // Clone the original request and retry
            error.config.__isRetryRequest = true;
            return axios(error.config);
          }
        }
        return Promise.reject(error);
      }
    );
  }
  
  start() {
    this.checkSession(); // Initial check
    this.intervalId = setInterval(() => this.checkSession(), this.interval);
    return this;
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    return this;
  }
  
  async refreshAuthToken() {
    // If already refreshing, return the existing promise to prevent multiple calls
    if (this.refreshPromise) return this.refreshPromise;
    
    // Create a new promise for the refresh operation
    this.isRefreshing = true;
    this.refreshPromise = new Promise(async (resolve) => {
      try {
        const response = await axios.post(this.refreshEndpoint, {}, { 
          withCredentials: true,
          headers: { 
            'X-Silent-Refresh': 'true',
            // Prevent axios from following redirects
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response.status === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        resolve(false);
      } finally {
        this.isRefreshing = false;
        // Clear the promise after a short delay
        setTimeout(() => {
          this.refreshPromise = null;
        }, 1000);
      }
    });
    
    return this.refreshPromise;
  }
  
  async checkSession() {
    try {
      const response = await axios.get(this.checkEndpoint, { 
        withCredentials: true,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      
      if (response.data.expiresAt) {
        const expiresAt = new Date(response.data.expiresAt).getTime();
        const now = Date.now();
        
        // If token will expire soon (within 2 minutes), refresh it silently
        if (expiresAt - now < 120000) {
          this.refreshAuthToken();
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401 && 
          error.response.data.reason === 'TOKEN_EXPIRED') {
        
        const refreshed = await this.refreshAuthToken();
        
        if (!refreshed) {
          this.stop();
          this.onSessionInvalid({
            reason: 'REFRESH_FAILED',
            message: 'Your session has expired and could not be refreshed.'
          });
        }
      } else if (error.response && error.response.status === 401) {
        // Only trigger session invalid for non-TOKEN_EXPIRED 401 errors
        this.stop();
        this.onSessionInvalid(error.response.data);
      } else {
        this.onError();
      }
    }
  }
}

export default SessionMonitor;
