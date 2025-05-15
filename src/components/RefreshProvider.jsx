// RefreshProvider.jsx
import React, { useEffect } from 'react';
import SessionMonitor from '../utils/services/SessionMonitor';
const RefreshProvider = ({ children }) => {
  useEffect(() => {
    // Initialize session monitor
    const sessionMonitor = new SessionMonitor({
      interval: 30000, // 30 seconds
      onSessionInvalid: (data) => {
        // Only redirect to login if we're not just refreshing token
        if (data.reason !== 'TOKEN_EXPIRED') {
          // You can redirect to login here if needed
          window.location.href = '/login';
        }
      }
    });
    
    // Start session monitoring
    sessionMonitor.start();
    
    return () => {
      // Clean up
      sessionMonitor.stop();
    };
  }, []);
  
  return <>{children}</>;
};

export default RefreshProvider;
