// src/components/routes/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout'; 
import axios from 'axios';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  // Enhanced logout function with proper error handling
  const handleLogout = async (isExpired = false) => {
    try {
      // Clear any pending timers
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Use HTTP-only cookie for authentication instead of Bearer token
      await axios.post(`${API_URL}/api/auth/logout`, {
        isExpired: isExpired // Let the server know if this was due to token expiration
      }, {
        withCredentials: true // Important for sending cookies
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Use React Router's navigate instead of window.location for better UX
      navigate('/login', { 
        state: { 
          sessionMessage: isExpired 
            ? 'Your session has expired. Please log in again.' 
            : 'You have been logged out.'
        } 
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        
        // Try to get session status using HTTP-only cookie
        const response = await axios.get(`${API_URL}/api/auth/session-status`, {
          withCredentials: true
        });
        
        if (response.status === 200 && response.data.isValid) {
          setValid(true);
          setLoading(false);
        } else {
          // Try to refresh the token if session is invalid
          try {
            const refreshResponse = await axios.post(
              `${API_URL}/api/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            
            if (refreshResponse.status === 200) {
              setValid(true);
              setLoading(false);
            } else {
              handleLogout(true);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            handleLogout(true);
          }
        }
      } catch (err) {
        console.error("Failed to validate session:", err);
        
        // If response has a 401, try to refresh token
        if (err.response && err.response.status === 401 && err.response.data.reason === 'TOKEN_EXPIRED') {
          try {
            const API_URL = import.meta.env.VITE_API_URL;
            const refreshResponse = await axios.post(
              `${API_URL}/api/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            
            if (refreshResponse.status === 200) {
              setValid(true);
              setLoading(false);
              return;
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        }
        
        handleLogout(true);
      }
    };

    checkAuth();
  }, [navigate]);

  // Regular session validation check
  useEffect(() => {
    if (!valid) return;
    
    const checkSession = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.get(`${API_URL}/api/auth/session-status`, {
          withCredentials: true // Important for sending cookies
        });
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Session invalid in admin area:', error.response.data);
          
          // If token is just expired, try refreshing it
          if (error.response.data?.reason === 'TOKEN_EXPIRED') {
            try {
              const API_URL = import.meta.env.VITE_API_URL;
              await axios.post(
                `${API_URL}/api/auth/refresh-token`,
                {},
                { withCredentials: true }
              );
              return; // Token refreshed successfully
            } catch (refreshError) {
              console.error("Failed to refresh token:", refreshError);
            }
          }
          
          // For other auth errors, log out
          const reason = error.response.data?.reason;
          const sessionMessage = reason === 'SESSION_INVALIDATED'
            ? 'Your session was ended because you logged in from another device'
            : 'Your session has expired. Please log in again.';
            
          navigate('/login', { state: { sessionMessage } });
        }
      }
    };
    
    // Check immediately on mount
    checkSession();
    
    // Then check periodically
    const intervalId = setInterval(checkSession, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [valid, navigate]);

  if (loading) return null;
  if (!valid) return <Navigate to="/login" replace />;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default PrivateRoute;
