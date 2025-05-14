import axios from 'axios';

class SessionMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.checkEndpoint = options.checkEndpoint || '/api/auth/session-status';
    this.refreshEndpoint = options.refreshEndpoint || '/api/auth/refresh-token';
    this.onSessionInvalid = options.onSessionInvalid || (() => {});
    this.onError = options.onError || console.error;
    this.intervalId = null;
    this.isRefreshing = false;
  }
  
  start() {
    console.log('Starting session monitor');
    this.checkSession(); // Initial check
    this.intervalId = setInterval(() => this.checkSession(), this.interval);
    return this;
  }
  
  stop() {
    if (this.intervalId) {
      console.log('Stopping session monitor');
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    return this;
  }
  
  async refreshAuthToken() {
    if (this.isRefreshing) return;
    
    this.isRefreshing = true;
    try {
      console.log('Refreshing auth token');
      const response = await axios.post(this.refreshEndpoint, {}, { withCredentials: true });
      
      if (response.status === 200 && response.data.token) {
        // For backward compatibility, store token in localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token refreshed successfully');
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }
  
  async checkSession() {
    try {
      console.log('Checking session status');
      
      await axios.get(this.checkEndpoint, { 
        withCredentials: true 
      });
      
      // Session is valid
      console.log('Session confirmed valid');
    } catch (error) {
      // If access token expired, try to refresh it
      if (error.response && error.response.status === 401 && error.response.data.reason === 'TOKEN_EXPIRED') {
        console.log('Access token expired, attempting refresh');
        const refreshed = await this.refreshAuthToken();
        
        if (!refreshed) {
          // If refresh failed, stop monitoring and trigger callback
          this.stop();
          this.onSessionInvalid({
            reason: 'REFRESH_FAILED',
            message: 'Your session has expired and could not be refreshed.'
          });
        }
      } else if (error.response && error.response.status === 401) {
        // Other auth errors like SESSION_INVALIDATED
        console.log('Session invalid:', error.response.data);
        this.stop();
        this.onSessionInvalid(error.response.data);
      } else {
        // Network or other errors - log but don't invalidate session
        this.onError('Session check error:', error);
      }
    }
  }
}

export default SessionMonitor;
