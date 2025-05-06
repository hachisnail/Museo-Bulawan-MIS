// src/components/routes/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminLayout from '../../components/layout/AdminLayout'; 
import axios from 'axios';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();
  let logoutTimer = null;

  // Enhanced logout function with proper error handling
  const handleLogout = async (isExpired = false) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Clear any pending timers
        if (logoutTimer) {
          clearTimeout(logoutTimer);
          logoutTimer = null;
        }
        const API_URL = import.meta.env.VITE_API_URL;
        // Use axios for consistency and better error handling
        await axios.post(`${API_URL}/api/auth/logout`, {
          isExpired: isExpired // Let the server know if this was due to token expiration
        },  {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true // Important for cookies
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
      // Even if the request fails, we should still clear local storage
    } finally {
      localStorage.removeItem('token');
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

  // Setup expiration timer with buffer time
  const setupExpirationTimer = (decodedToken) => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    
    const expiryTimeMs = decodedToken.exp * 1000;
    const currentTimeMs = Date.now();
    const timeToExpiry = expiryTimeMs - currentTimeMs;
    
    // Add some buffer (5 seconds) to ensure we logout before expiration
    const bufferTime = 5000; 
    const timeoutDuration = timeToExpiry > bufferTime ? timeToExpiry - bufferTime : 0;
    
    logoutTimer = setTimeout(() => {
      console.warn("Token expiring soon, logging out...");
      handleLogout(true); // true indicates this is due to expiration
    }, timeoutDuration);
  };

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('token');
      
      if (!token) {
        try {
          const API_URL = import.meta.env.VITE_API_URL;
          const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: 'GET',
            credentials: 'include',  // Ensures cookies are sent with the request
          });

          if (res.ok) {
            const data = await res.json();
            token = data.token;
            if (token) {
              localStorage.setItem('token', token);
            } else {
              return handleLogout();
            }
          } else {
            return handleLogout();
          }
        } catch (err) {
          console.error("Failed to refresh token:", err);
          return handleLogout();
        }
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          console.warn("Token already expired, logging out...");
          return handleLogout(true);
        }
        
        setupExpirationTimer(decoded);
        
        setValid(true);
        setLoading(false);
      } catch (err) {
        console.error("Invalid token, logging out...", err);
        return handleLogout();
      }
    };

    checkAuth();
    
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, []);

  // Regular session validation check
  useEffect(() => {
    if (!valid) return;
    
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setValid(false);
          navigate('/login');
          return;
        }
        
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.get(`${API_URL}/api/auth/session-status`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Session invalid in admin area:', error.response.data);
          
          // Session is invalid, log out user and redirect
          localStorage.removeItem('token');
          
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
