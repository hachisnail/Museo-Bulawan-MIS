import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminLayout from '../../components/layout/AdminLayout'; 
import axios from 'axios';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
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
      window.location.href = "/login";
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
    
    // console.log(`Token will expire in ${timeToExpiry/1000} seconds, setting logout timer for ${timeoutDuration/1000} seconds`); 
    
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
            credentials: 'include',  // Ensures cookies are sent with the request (like withCredentials: true in axios)
          });

          token = res.data.token;
          if (token) {
            localStorage.setItem('token', token);
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

  useEffect(() => {
    if (!valid) return;
    
    const intervalId = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setValid(false);
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          console.warn("Token expired during interval check");
          handleLogout(true);
        }
      } catch (err) {
        console.error("Token validation failed:", err);
        handleLogout();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, [valid]);

  if (loading) return null;
  if (!valid) return <Navigate to="/login" replace />;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default PrivateRoute;
