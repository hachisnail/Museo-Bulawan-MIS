// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Logging out user');
      
      await axios.post(
        `${API_URL}/api/auth/logout`, 
        {}, 
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );
      
      console.log('Logout successful');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still remove token and redirect even if server request fails
      localStorage.removeItem('token');
      navigate('/login');
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      className={`text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded ${className}`}
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
