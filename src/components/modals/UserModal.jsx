import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const InviteModal = ({ onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    role: 'admin',
    position: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field when it changes
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleContact = (e) => {
    const { name, value } = e.target;
    
    if (name === "contact_number") {
      // Allow only digits and common phone number characters
      const sanitizedValue = value.replace(/[^\d+()-\s]/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
      
      // Clear error for this field when it changes
      if (errors.contact_number) {
        setErrors({
          ...errors,
          contact_number: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation if provided
    if (formData.contact_number) {
      const phoneRegex = /^\+?[0-9\s()-]{7,15}$/;
      if (!phoneRegex.test(formData.contact_number)) {
        newErrors.contact_number = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/auth/invitations`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      onInvite(response.data.invitation);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[43rem] min-h-fit bg-[#1C1B19] border-1 border-[#3A3A3A] flex flex-col rounded-sm">
        <div className="w-full items-center min-h-15 bg-[#373737] flex justify-between px-5">
          <span className="text-2xl font-semibold text-white">Invite Member</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white h-full w-fit">
            <i className="fa-solid fa-xmark text-4xl"></i>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-200 p-3 m-4 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
        <div className='p-5'>

            <div className="grid grid-cols-2 gap-x-2 mb-4">
              <div>
                <label className="block text-gray-300 text-lg mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-[#2D2D2D] text-white rounded border-0"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-gray-300 text-lg mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-[#2D2D2D] text-white rounded border-0"
                  placeholder=""
                />
              </div>
            </div>
          
          
          <div className="mb-4">
            <label className="block text-gray-300 text-lg mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-2 bg-[#2D2D2D] text-white rounded border-0 ${errors.email ? 'border border-red-500' : ''}`}
              placeholder="example@domain.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-lg mb-1">Contact</label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleContact}
              className={`w-full p-2 bg-[#2D2D2D] text-white rounded border-0 ${errors.contact_number ? 'border border-red-500' : ''}`}
              placeholder="+1 (123) 456-7890"
              inputMode="tel"
            />
            {errors.contact_number && (
              <p className="text-red-400 text-sm mt-1">{errors.contact_number}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-lg mb-1">Role</label>
            <div className="mt-2 space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="radio"
                    id="admin-role"
                    name="role"
                    checked={formData.role === 'admin'}
                    onChange={() => handleRoleChange('admin')}
                    className="hidden"
                  />
                  <div 
                    onClick={() => handleRoleChange('admin')}
                    className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center cursor-pointer ${formData.role === 'admin' ? 'bg-[#6F3FFF]' : 'border border-gray-500'}`}
                  >
                    {formData.role === 'admin' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <div className="ml-2">
                  <label 
                    htmlFor="admin-role" 
                    className={`cursor-pointer ${formData.role === 'admin' ? 'text-white' : 'text-gray-400'}`}
                  >
                    <div className="text-lg font-medium">Administrator</div>
                    <div className="text-sm text-gray-400">Administrators can do everything, including managing users and deleting current administrators.</div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="radio"
                    id="staff-role"
                    name="role"
                    checked={formData.role === 'staff'}
                    onChange={() => handleRoleChange('staff')}
                    className="hidden"
                  />
                  <div 
                    onClick={() => handleRoleChange('staff')}
                    className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center cursor-pointer ${formData.role === 'staff' ? 'bg-[#6F3FFF]' : 'border border-gray-500'}`}
                  >
                    {formData.role === 'staff' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <div className="ml-2">
                  <label 
                    htmlFor="staff-role" 
                    className={`cursor-pointer ${formData.role === 'staff' ? 'text-white' : 'text-gray-400'}`}
                  >
                    <div className="text-lg font-medium">Reviewer</div>
                    <div className="text-sm text-gray-400">Reviewers cannot view logs and edit users. Reviewers can manage all transactions.</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-lg mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 bg-[#2D2D2D] text-white rounded border-0"
              placeholder=""
            />
          </div>
        </div>
          
          <div className="w-full items-center min-h-15 bg-[#373737] flex justify-end gap-x-5 px-5">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2  text-white rounded flex items-center justify-center cursor-pointer border-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-[#6F3FFF] text-white rounded flex items-center justify-center cursor-pointer border-1"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const UserView = ({ userId, onClose }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [loginLogs, setLoginLogs] = useState([])
  const token = localStorage.getItem('token')

  const colorMap = {
    A: '#FF6666', B: '#FF9933', C: '#FFD700', D: '#66CC66', E: '#0099CC',
    F: '#9933CC', G: '#FF3399', H: '#6666FF', I: '#00CC99', J: '#FF6600',
    K: '#3399FF', L: '#FF3366', M: '#33CC33', N: '#FFCC00', O: '#336699',
    P: '#990000', Q: '#FF6699', R: '#666600', S: '#669900', T: '#009999',
    U: '#6600CC', V: '#CC3300', W: '#99CC00', X: '#9966FF', Y: '#FF0000',
    Z: '#33CCCC',
  }

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchLogs = () => {
    axios
      .get(`${API_URL}/api/auth/login-logs/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const logs = res.data.logs
        setLoginLogs(logs && logs.length > 0 ? logs : [])
      })
      .catch((err) => {
        console.error('Error fetching login logs:', err.response?.data || err.message)
      })
  }
  
  


  const fetchUsers = () => {
    axios
      .get(`${API_URL}/api/auth/fetchUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetchedUser = res.data
        setUser(fetchedUser)
        setRole(fetchedUser?.Credential?.role || 'staff')
      })
      .catch((err) => {
        console.error('Error fetching user:', err.response?.data || err.message)
      })
  }

  useEffect(() => {
    fetchLogs()
    fetchUsers()
  }, [userId])

  // console.log(loginLogs);
  const formatLogs = () => {
    if (!loginLogs.length) return []
  
    const sorted = [...loginLogs].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    )
  
    return sorted.map((log) => {
      const loginTime = new Date(log.start)
      const logoutTime = log.end ? new Date(log.end) : null
  
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
  
      const start = loginTime.toLocaleString('en-US', dateOptions)
      const end = logoutTime
        ? logoutTime.toLocaleString('en-US', dateOptions)
        : '—'
  
      let duration = '-'
      if (logoutTime) {
        const diff = logoutTime - loginTime
        const hours = Math.floor(diff / 1000 / 60 / 60)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        duration = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${
          minutes !== 1 ? 's' : ''
        }`
      }
  
      return {
        id: log.id,
        start,
        end,
        duration,
      }
    })
  }
  
  console.log(loginLogs);

  const firstInitial = user?.Credential?.first_name?.charAt(0).toUpperCase()
  const lastInitial = user?.Credential?.last_name?.charAt(0).toUpperCase()
  const bgColor = colorMap[firstInitial] || '#FFFFFF'

  if (!user) return null // loading or fallback

  return (
    <div className="w-screen h-screen fixed backdrop-blur-xs z-50 flex items-center justify-center select-none">
      <div className="w-[70rem] min-h-fit bg-[#1C1B19] border-1 border-[#3A3A3A] flex flex-col rounded-sm">
        {/* Header */}
        <div className="w-full min-h-15 bg-[#373737] flex justify-between">
          <div className="h-15 w-fit flex items-center px-5">
            <span className="text-2xl text-white font-semibold">View User</span>
          </div>
          <div className="w-15 h-15 flex items-center justify-center">
            <i className="fa-solid fa-user text-white text-3xl"></i>
          </div>
        </div>

        {/* User Info */}
        <div className="w-full h-full flex flex-col gap-y-2">
          <div className="w-full h-[10rem] flex gap-x-10">
            <div className="w-fit h-full pt-7 px-15 ml-10">
              <div className="h-[4.5rem] w-[4.5rem] flex items-center justify-center bg-white rounded-full">
                <div
                  className="w-[4rem] h-[4rem] rounded-full border-1 flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-3xl font-semibold">
                    {firstInitial}
                    {lastInitial}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[30rem] h-full flex flex-col justify-center gap-y-2">
              <span className="w-fit text-xl text-[#949494]">
                {user?.Credential?.position}
              </span>
              <span className="text-3xl text-white font-semibold">
                {user?.Credential?.first_name} {user?.Credential?.last_name}
              </span>
              <span className="text-xl text-[#9C9C9C] font-semibold">
                <i className="fa-solid fa-envelope"></i> &nbsp;
                {user?.Credential?.email}
              </span>
            </div>

            <div className="w-full h-full flex flex-col gap-y-2 justify-end pb-5">
              <span className="text-xl text-white font-semibold">
                <i className="fa-solid fa-phone"></i> &nbsp;
                {user?.Credential?.contact_number}
              </span>
              <span className="text-xl text-white font-semibold w-[10rem] text-center py-2 rounded border bg-[#3A3A3A] border-[#A6A6A6]">
                {user?.Credential?.role.charAt(0).toUpperCase() +
                  user?.Credential?.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Login Logs Table */}
          <div className="w-full sm:min-w-[70rem] h-full bg-[#151515] border border-[#373737] overflow-y-scroll">
            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 py-4 text-white font-semibold text-sm border-b border-[#373737]">
              <div>*</div>
              <div>Start</div>
              <div>End</div>
              <div>Duration</div>
            </div>

            {/* Table Body */}
            <div className="w-full h-50 overflow-y-scroll">
              {formatLogs().map((log, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 px-6 py-4 text-[#E6E6E6] text-sm border-b border-[#373737] items-center"
                >
                  <div>{log.id}</div>
                  <div>{log.start}</div>
                  <div>{log.end}</div>
                  <div>
                    <span className=" py-1 rounded text-[#B7B7B7]">
                      {log.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full min-h-15 bg-[#373737] flex px-5 justify-end">
          <div className="w-fit h-15 flex items-center gap-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-30 h-8 bg-[#6F3FFF] border flex items-center justify-center border-white rounded-sm cursor-pointer"
            >
              <span className="text-white text-xl font-semibold">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}