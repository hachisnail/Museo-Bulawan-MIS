import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, ScrollRestoration, useLocation } from 'react-router-dom';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [clientIP, setClientIP] = useState(null); // Track the client's real IP
  const navigate = useNavigate();
  const location = useLocation(); // To access router state
  const API_URL = import.meta.env.VITE_API_URL;

  // Detect the client's real IP address when component mounts
  useEffect(() => {
    const detectClientIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        if (response.data && response.data.ip) {
          console.log('Client IP detected:', response.data.ip);
          setClientIP(response.data.ip);
        }
      } catch (error) {
        console.error('Error detecting client IP:', error);
      }
    };
    detectClientIP();
  }, []);

  // Check for session messages passed from SessionHandler
  useEffect(() => {
    if (location.state?.sessionMessage) {
      console.log('Session message from redirect:', location.state.sessionMessage);
      setError(location.state.sessionMessage);
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Check if user already has an active session
  useEffect(() => {
    console.log('Checking for existing session');
    
    // Try to refresh token first (if user has a valid refresh token)
    const tryRefreshToken = async () => {
      try {
        console.log('Trying to refresh token');
        const refreshResponse = await axios.post(
          `${API_URL}/api/auth/refresh-token`, 
          {}, 
          { withCredentials: true }
        );
        
        if (refreshResponse.status === 200) {
          console.log('Token refreshed successfully');
          // For backward compatibility
          // if (refreshResponse.data.token) {
          //   localStorage.setItem('token', refreshResponse.data.token);
          // }
          navigate('/admin/dashboard');
          return true;
        }
      } catch (err) {
        console.log('No valid refresh token or refresh failed');
        return false;
      }
    };
    
    // If refresh fails or user doesn't have a refresh token, check session
    const checkSession = async () => {
      try {
        console.log('Checking session status');
        const response = await axios.get(
          `${API_URL}/api/auth/session-status`,
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          console.log('Valid session found');
          navigate('/admin/dashboard');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          if (err.response.data?.reason === 'SESSION_INVALIDATED') {
            setError('Your session was ended because you logged in from another device');
          } else if (err.response.data?.reason === 'TOKEN_EXPIRED') {
            // This should be handled by refresh token, but just in case
            setError('Your session has expired. Please log in again.');
          }
          // Clear any localStorage token for backward compatibility
          localStorage.removeItem('token');
        }
      }
    };
    
    // Try refresh first, if it fails check session
    tryRefreshToken().then(refreshed => {
      if (!refreshed) {
        checkSession();
      }
    });
  }, [navigate, API_URL]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    console.log('Attempting login');
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password, clientIP },
      { withCredentials: true }
    );

    if (response.status === 200) {
      console.log('Login successful');

      // Fetch the encoded user profile
      const profileResponse = await axios.get(`${API_URL}/api/auth/profile`, {
        withCredentials: true,
      });

      if (profileResponse.status === 200) {
        const encodedProfile = profileResponse.data.profile;

        // Store the encoded profile in localStorage
        localStorage.setItem('userProfile', encodedProfile);
      }

      navigate('/admin/dashboard');
    }
  } catch (err) {
    console.error('Login failed:', err);
    setError(err.response?.data?.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="w-auto z mx-auto flex flex-col items-center justify-center pt-7 h-screen min-h-screen bg-[#1C1B19] overflow-hidden">
      <ScrollRestoration />

      <div className="text-left w-screen fixed top-10 left-10 overflow-hidden">
        <Link to="/" className="text-white hover:text-blue-300 text-sm font-medium">
          <i className="fa-solid fa-arrow-left"></i> &nbsp;&nbsp; Return to homepage
        </Link>
      </div>
      <div className="w-full h-fit max-w-md overflow-hidden">
        <div id='container1' className="mx-auto">
          <img src="LOGO.png" alt="Logo" className="w-60 mx-auto" />
        </div>
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6 font-medium">
            <div>
              <label htmlFor="user" className="block text-white text-lg mb-2">
                Email
              </label>
              <input
                id="user"
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-transparent border-2 border-white text-white placeholder-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="pass" className="block text-white text-lg mb-2">
                Password
              </label>
              <input
                id="pass"
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-transparent border-2 border-white text-white placeholder-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-red-400 text-center mb-4 p-3 bg-red-900/30 rounded">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="w-full flex justify-end">
              <span className="text-white hover:text-blue-300 text-sm font-medium cursor-pointer">
                Forgot Password
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
