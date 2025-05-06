import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, ScrollRestoration, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // To access router state
  const API_URL = import.meta.env.VITE_API_URL;

  // Check for session messages passed from SessionHandler
  useEffect(() => {
    if (location.state?.sessionMessage) {
      console.log('Session message from redirect:', location.state.sessionMessage);
      setError(location.state.sessionMessage);
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        
        if (!isExpired) {
          console.log('Token found and not expired, verifying session');
          // Token looks valid, but let's verify the session is still active
          axios.get(`${API_URL}/api/auth/session-status`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          })
          .then(() => {
            // Session is still valid, redirect to dashboard
            console.log('Session verified, redirecting to dashboard');
            navigate('/admin/dashboard');
          })
          .catch(err => {
            // Session might be invalidated
            console.error('Session verification failed:', err);
            if (err.response?.status === 401) {
              localStorage.removeItem('token');
              if (err.response.data?.reason === 'SESSION_INVALIDATED') {
                setError('Your session was ended because you logged in from another device');
              } else {
                setError('Your session has expired. Please log in again.');
              }
            }
          });
          return;
        } else {
          // Token is expired
          console.log('Token found but expired');
          localStorage.removeItem('token');
        }
      } catch (e) {
        console.warn('Invalid token in localStorage');
        localStorage.removeItem('token');
      }
    }

    console.log('Checking for fallback cookie token');
    const checkCookieToken = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/verify-cookie`, {
          withCredentials: true 
        });

        if (res.status === 200 && res.data.token) {
          console.log('Valid cookie token found');
          localStorage.setItem('token', res.data.token);
          navigate('/admin/dashboard');
        }
      } catch (e) {
        // Cookie not valid, that's okay
        console.log('No valid cookie token found');
      }
    };

    checkCookieToken();
  }, [navigate, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login');
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Needed for cookie
      );

      if (response.status === 200) {
        console.log('Login successful');
        localStorage.setItem('token', response.data.token);
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
