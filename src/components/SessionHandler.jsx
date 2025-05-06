// src/components/SessionHandler.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SessionHandler = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    // Skip if no token exists or on the login page already
    const token = localStorage.getItem('token');
    if (!token || window.location.pathname === '/login') return;
    
    // First check if token is valid locally
    try {
      const decoded = jwtDecode(token);
      // Check token expiration
      if (decoded.exp < Date.now() / 1000) {
        console.log('Token expired locally');
        localStorage.removeItem('token');
        navigate('/login', { 
          state: { sessionMessage: 'Your session has expired. Please log in again.' }
        });
        return;
      }
    } catch (e) {
      // Token format is invalid
      console.error('Invalid token format:', e);
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    
    // Set up monitoring interval
    const checkSession = async () => {
      try {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
          navigate('/login');
          return;
        }
        
        console.log('Checking session status');
        await axios.get(`${API_URL}/api/auth/session-status`, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          },
          withCredentials: true
        });
        console.log('Session is valid');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Session invalid:', error.response.data);
          // Session is invalid, log out user
          localStorage.removeItem('token');
          
          const reason = error.response.data?.reason;
          const sessionMessage = reason === 'SESSION_INVALIDATED'
            ? 'Your session was ended because you logged in from another device'
            : 'Your session has expired. Please log in again.';
            
          navigate('/login', { state: { sessionMessage } });
        } else {
          // Other errors (network, server, etc.) - don't log out user
          console.error('Session check error:', error);
        }
      }
    };
    
    // Check immediately on mount
    checkSession();
    
    // Then set up interval to check periodically
    const intervalId = setInterval(checkSession, 30000); // 30 seconds
    
    // Clean up on unmount
    return () => {
      console.log('Cleaning up session check interval');
      clearInterval(intervalId);
    }
  }, [navigate, API_URL]);
  
  return null; 
};

export default SessionHandler;
