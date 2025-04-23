import React, { useState } from 'react';
import axios from 'axios';

const InviteModal = ({ onClose, onInvite }) => {
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

export default InviteModal;
