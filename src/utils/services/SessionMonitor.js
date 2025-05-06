// frontend/src/services/sessionMonitor.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

class SessionMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.checkEndpoint = options.checkEndpoint || '/api/auth/session-status';
    this.onSessionInvalid = options.onSessionInvalid || (() => {});
    this.onError = options.onError || console.error;
    this.intervalId = null;
    this.token = null;
  }
  
  start() {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      console.log('No token found, not starting session monitor');
      return;
    }
    
    // Check token validity locally first
    try {
      const decoded = jwtDecode(this.token);
      if (decoded.exp < Date.now() / 1000) {
        // Token already expired locally
        console.log('Token already expired locally');
        this.onSessionInvalid({
          reason: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.'
        });
        return;
      }
    } catch (e) {
      console.error('Invalid token format:', e);
      this.onSessionInvalid({
        reason: 'INVALID_TOKEN',
        message: 'Invalid session token. Please log in again.'
      });
      return;
    }
    
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
  
  async checkSession() {
    try {
      // Refresh token from localStorage in case it changed
      this.token = localStorage.getItem('token');
      if (!this.token) {
        console.log('No token found during check, stopping monitor');
        this.stop();
        return;
      }
      
      console.log('Checking session status');
      await axios.get(this.checkEndpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        withCredentials: true
      });
      
      // Session is valid
      console.log('Session confirmed valid');
    } catch (error) {
      if (error.response && error.response.status === 401) {
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
