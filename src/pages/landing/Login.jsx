import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, ScrollRestoration } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        if (!isExpired) {
          navigate('/admin/dashboard');
          return;
        }
      } catch (e) {
        console.warn('Invalid token in localStorage');
      }
    }

    const API_URL = import.meta.env.VITE_API_URL;
    const checkCookieToken = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/verify-cookie`, {
          withCredentials: true 
        });

        if (res.status === 200 && res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/admin/dashboard');
        }
      } catch (e) {
      }
    };

    checkCookieToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Needed for cookie
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto  z mx-auto flex flex-col items-center justify-center pt-7 h-screen min-h-screen bg-[#1C1B19] overflow-hidden">
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
            {error && <div className="text-red-400 text-center mb-4">{error}</div>}
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
