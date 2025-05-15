// SessionMonitor.js
import axios from 'axios';

class SessionMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.checkEndpoint = options.checkEndpoint || '/api/auth/session-status';
    this.refreshEndpoint = options.refreshEndpoint || '/api/auth/refresh-token';
    this.onSessionInvalid = options.onSessionInvalid || (() => {});
    this.onError = options.onError || (() => {}); // Silent error handling
    this.intervalId = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
  
  start() {
    // No console logs for security
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
        // Silent refresh - no console logs
        const response = await axios.post(this.refreshEndpoint, {}, { 
          withCredentials: true,
          // Important: This prevents navigation/redirection during refresh
          headers: { 'X-Silent-Refresh': 'true' } 
        });
        
        // Handle successful refresh
        if (response.status === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        // Silent failure - don't log errors publicly
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
      // Check session without logging
      const response = await axios.get(this.checkEndpoint, { 
        withCredentials: true 
      });
      
      // Get token expiration from response if available
      if (response.data.expiresAt) {
        const expiresAt = new Date(response.data.expiresAt).getTime();
        const now = Date.now();
        
        // If token will expire soon (within 2 minutes), refresh it silently
        if (expiresAt - now < 120000) {
          this.refreshAuthToken();
        }
      }
    } catch (error) {
      // If access token expired, try to refresh it silently
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
        // Other auth errors like SESSION_INVALIDATED
        this.stop();
        this.onSessionInvalid(error.response.data);
      } else {
        // Network or other errors - silent handling
        this.onError();
      }
    }
  }
}

export default SessionMonitor;
