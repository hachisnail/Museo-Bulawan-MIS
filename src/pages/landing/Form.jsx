// Form.jsx
import { ScrollRestoration } from 'react-router-dom';
import LandingNav from '../../components/navbar/LandingNav';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useAddressLogic from '../../components/function/AddressHook'; // Custom hook for province/city/barangay logic

// Optional typed dropdown component used for selecting province/city/barangay
function TypedDropdown({
  placeholder,
  options,
  selectedItem,
  onChange,
  disabled = false
}) {
  const [inputText, setInputText] = useState(selectedItem?.name || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Update inputText if parent changes the selectedItem
  useEffect(() => {
    setInputText(selectedItem?.name || '');
  }, [selectedItem]);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onChange(item);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange(null);
    setInputText('');
    setShowDropdown(false);
  };

  // Filter options based on typed input
  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(inputText.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex border-2 border-black rounded-2xl px-4 py-3 
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <input
          className="outline-none flex-grow placeholder-gray-500 text-base md:text-lg disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={inputText}
          disabled={disabled}
          onChange={(e) => {
            setInputText(e.target.value);
            if (!disabled) {
              setShowDropdown(true);
            }
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
        />
        {selectedItem && !disabled && (
          <button
            type="button"
            className="ml-2 text-black font-bold"
            onClick={handleClear}
          >
            X
          </button>
        )}
      </div>

      {showDropdown && !disabled && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-400 shadow-md rounded-md">
          {filteredOptions.length ? (
            filteredOptions.map((o) => (
              <li
                key={o.code}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(o)}
              >
                {o.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}

const Form = () => {
  // Which form type are we submitting? (donation or lending)
  const [formType, setFormType] = useState('donation');

  // Address fields from custom hook
  const {
    provinces,
    cities,
    barangays,
    selectedProvince,
    setSelectedProvince,
    selectedCity,
    setSelectedCity,
    selectedBarangay,
    setSelectedBarangay
  } = useAddressLogic();

  // Basic info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [street, setStreet] = useState('');

  // Artifact / form details
  const [artifactName, setArtifactName] = useState('');
  const [description, setDescription] = useState('');
  const [acquired, setAcquired] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [narrative, setNarrative] = useState('');
  const [images, setImages] = useState([]);
  const [relatedImages, setRelatedImages] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Lending-specific fields
  const [durationPeriod, setDurationPeriod] = useState('');
  const [remarks, setRemarks] = useState('');
  const [reason, setReason] = useState('');
  const [condition, setCondition] = useState('');

  // UI states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Capitalize first letter of First/Last Name
  const handleFirstNameChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFirstName(value);
  };
  
  const handleLastNameChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setLastName(value);
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleRelatedImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setRelatedImages(files);
  };

// Handle document uploads - store files in state, not localStorage
const handleDocumentUpload = (e) => {
  const files = Array.from(e.target.files);
  setDocumentFiles(prev => [...prev, ...files]);
  
  // Display info about uploaded files
  const newDocumentFiles = files.map(file => ({
    name: file.name,
    size: file.size,
    type: file.type
  }));
  
  setUploadedDocuments(prev => [...prev, ...newDocumentFiles]);
  
  // Reset the input value to allow selecting the same file again
  e.target.value = '';
};

// Remove document from state by index
const removeDocument = (indexToRemove) => {
  setUploadedDocuments(prev => prev.filter((_, index) => index !== indexToRemove));
  setDocumentFiles(prev => prev.filter((_, index) => index !== indexToRemove));
};


  // Open the confirmation modal before final submit
  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    
    // Validate required fields before showing confirmation
    if (!firstName || !lastName || !age || !email || !selectedProvince || 
        !selectedCity || !selectedBarangay || !artifactName || !description || 
        !acquired || images.length === 0) {
      setErrorMessage('Please fill in all required fields marked with *');
      return;
    }
    
    // Additional validation for lending form
    if (formType === 'lending' && (!durationPeriod || !remarks || !reason || !condition)) {
      setErrorMessage('Please fill in all required lending fields marked with *');
      return;
    }
    
    // Clear any previous error messages
    setErrorMessage('');
    setShowConfirmationModal(true);
  };

  // Submit the form to the server
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmationModal(false);
  
    try {
      const formData = new FormData();
      
      // Add basic info to formData
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('sex', sex);
      formData.append('age', age);
      formData.append('phone', phone);
      formData.append('organization', organization);
      formData.append('province', selectedProvince?.name || '');
      formData.append('city_municipality', selectedCity?.name || '');
      formData.append('barangay', selectedBarangay?.name || '');
      formData.append('street', street);
  
      // Add artifact details
      formData.append('artifact_name', artifactName);
      formData.append('description', description);
      formData.append('acquired', acquired);
      formData.append('additional_info', additionalInfo);
      formData.append('narrative', narrative);
      
      // Append image files
      images.forEach(image => {
        formData.append('images', image);
      });
      
      relatedImages.forEach(image => {
        formData.append('related_images', image);
      });
      
      // Append document files directly to FormData
      documentFiles.forEach(doc => {
        formData.append('documents', doc);
      });
      
      // Add form type and specific lending fields if applicable
      formData.append('formType', formType);
      if (formType === 'lending') {
        formData.append('durationPeriod', durationPeriod);
        formData.append('remarks', remarks);
        formData.append('reason', reason);
        formData.append('condition', condition);
      }
  
      // Submit the form
      const response = await axios.post(
        'http://localhost:5000/api/auth/form',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 201) {
        // Reset all form fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setSex('');
        setAge('');
        setPhone('');
        setOrganization('');
        setStreet('');
        setSelectedProvince(null);
        setSelectedCity(null);
        setSelectedBarangay(null);
        setArtifactName('');
        setDescription('');
        setAcquired('');
        setAdditionalInfo('');
        setNarrative('');
        setImages([]);
        setRelatedImages([]);
        setDocumentFiles([]);
        setUploadedDocuments([]);
        setDurationPeriod('');
        setRemarks('');
        setReason('');
        setCondition('');
  
        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Preview images
  const renderImagePreviews = (imagesList) => {
    if (!imagesList || imagesList.length === 0) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {Array.from(imagesList).map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="h-20 w-20 object-cover rounded-md"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                const newImages = Array.from(imagesList);
                newImages.splice(index, 1);
                imagesList === images ? setImages(newImages) : setRelatedImages(newImages);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (images.length > 0) {
        images.forEach(image => {
          if (image.preview) URL.revokeObjectURL(image.preview);
        });
      }
      if (relatedImages.length > 0) {
        relatedImages.forEach(image => {
          if (image.preview) URL.revokeObjectURL(image.preview);
        });
      }
    };
  }, [images, relatedImages]);

  return (
    <>
      <ScrollRestoration />
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white py-3 px-5 rounded-md shadow-lg z-50">
          Form submitted successfully!
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[90%] max-w-md mx-auto p-6 rounded-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-6">
              Are you sure you want to submit this form?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 border-2 border-gray-400 rounded-md hover:bg-gray-100"
                disabled={isSubmitting}
              >
                No, Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-4 min-h-fit h-fit w-screen pt-7">
        <div className="min-h-[10%] w-screen">
          <LandingNav />
        </div>

        <div className="h-auto min-h-[79rem] w-screen">
          {/* Header */}
          <div className="w-full bg-white py-6 font-medium font-[HinaMincho] shadow-lg my-2 px-20">
            <span className="text-5xl">Contribution Form</span>
          </div>

          {/* Intro Info Section */}
          <div className="w-auto h-auto mx-20 py-4 px-12">
            <span className="text-xl font-[HinaMincho]">
              In addition to preserving your historic objects, it is important to remember to preserve 
              the history or story that goes with them. Take the time to write down the story that goes 
              with your objects; include any background details that would help our team understand 
              the significance of the item.
            </span>

            {/* Form Type Selection */}
            <div className="mt-8">
              <span className="text-2xl font-semibold mr-7">What Type of Form?</span>
              <select
                className="ml-3 p-2 border rounded-md cursor-pointer"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="donation">Donation Form</option>
                <option value="lending">Lending Form</option>
              </select>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            {/* The Main Form */}
            <form onSubmit={handleOpenConfirmation} className="mt-6 space-y-6">
              {/* Donator Info */}
              <div className="px-6 p-3 bg-white rounded-md shadow-lg mt-3 mb-5">
                <span className="text-4xl">Tell Us About Yourself</span>
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-4">
                  <label className="md:col-span-3 text-lg md:text-xl font-bold">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={firstName}
                    onChange={handleFirstNameChange}
                    className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={lastName}
                    onChange={handleLastNameChange}
                    className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                </div>

                {/* Age and Sex */}
                <div className="grid grid-cols-12 items-center gap-4 mt-6">
                  <label htmlFor="age" className="col-span-2 md:col-span-3 text-xl font-bold">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Age"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="col-span-3 md:col-span-2 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                  />

                  <label className="col-span-2 text-xl font-bold text-center">Sex</label>
                  <div className="col-span-5 flex gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="sex"
                        id="male"
                        value="male"
                        checked={sex === 'male'}
                        onChange={(e) => setSex(e.target.value)}
                        className="form-radio"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="sex"
                        id="female"
                        value="female"
                        checked={sex === 'female'}
                        onChange={(e) => setSex(e.target.value)}
                        className="form-radio"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                  <label className="md:col-span-3 text-xl font-bold">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />

                  <label className="md:col-span-2 text-xl font-bold">Phone</label>
                  <input
                    type="tel"
                    placeholder="+639*********"
                    pattern="^(09|\+639)\d{9}$"
                    title="Valid PH phone number starts with 09 or +639"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="md:col-span-3 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                </div>

                {/* Organization */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                  <label className="md:col-span-3 text-xl font-bold">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="School/Institution/etc."
                    className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                </div>

                {/* Province and City */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                  <label className="md:col-span-3 text-xl font-bold">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-4">
                    <TypedDropdown
                      placeholder="Type or choose Province"
                      options={provinces}
                      selectedItem={selectedProvince}
                      onChange={setSelectedProvince}
                    />
                  </div>

                  <label className="md:col-span-2 text-xl font-bold">
                    City/Municipality <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3">
                    <TypedDropdown
                      placeholder="Type or choose City"
                      options={cities}
                      selectedItem={selectedCity}
                      onChange={setSelectedCity}
                      disabled={!selectedProvince}
                    />
                  </div>
                </div>

                {/* Barangay and Street */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                  <label className="md:col-span-3 text-xl font-bold">
                    Barangay <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-4">
                    <TypedDropdown
                      placeholder="Type or choose Barangay"
                      options={barangays}
                      selectedItem={selectedBarangay}
                      onChange={setSelectedBarangay}
                      disabled={!selectedCity}
                    />
                  </div>

                  <label className="md:col-span-2 text-xl font-bold">Street</label>
                  <input
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="md:col-span-3 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                </div>
              </div>

              {/* Lending-specific Fields */}
              {formType === 'lending' && (
                <div className="p-3 bg-white rounded-md shadow-lg">
                  <span className="text-3xl font-semibold mb-8">Lending Details</span>
                  <div>
                    <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                      <label htmlFor="loanDuration" className="col-span-3 text-xl font-bold">
                        Proposed duration of the loan? <span className="text-red-500">*</span>
                      </label>
                      <div className="col-span-9">
                        <input
                          type="text"
                          id="loanDuration"
                          name="loanDuration"
                          placeholder="Enter duration"
                          required
                          value={durationPeriod}
                          onChange={(e) => setDurationPeriod(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                        />
                        <p className="text-gray-500 text-sm mt-2">
                          Enter something like: "3 years," or "May 2025 - May 2030"
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                      <label htmlFor="condition" className="col-span-3 text-xl font-bold">
                        Specific conditions or requirements for display or handling? <span className="text-red-500">*</span>
                      </label>
                      <div className="col-span-9">
                        <input
                          type="text"
                          id="condition"
                          name="condition"
                          placeholder="Enter Specific Conditions"
                          required
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                      <label htmlFor="remarks" className="col-span-3 text-xl font-bold">
                        Liability concerns or requirements about the artifact? <span className="text-red-500">*</span>
                      </label>
                      <div className="col-span-9">
                        <input
                          type="text"
                          id="remarks"
                          name="remarks"
                          placeholder="Enter Liability Concerns"
                          required
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                      <label htmlFor="reason" className="col-span-3 text-xl font-bold">
                        Reason for lending <span className="text-red-500">*</span>
                      </label>
                      <div className="col-span-9">
                      <input
                        type="text"
                        id="reason"
                        name="reason"
                        placeholder="Reason"
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                      />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Artifact Details */}
              <div className="p-3 bg-white rounded-md shadow-lg mt-3">
                <h3 className="text-3xl font-semibold mb-8">About the Artifact</h3>

                {/* Artifact Name */}
                <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                  <label className="col-span-3 text-xl font-bold">
                    Title/Name of the Artifact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Title/Name of the Artifact"
                    required
                    value={artifactName}
                    onChange={(e) => setArtifactName(e.target.value)}
                    className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                  />
                </div>

                {/* Artifact Description */}
                <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                  <label className="col-span-3 text-xl font-bold">
                    Artifact Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Artifact Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
                  />
                </div>

                {/* Acquisition Details */}
                <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                  <label className="col-span-3 text-xl font-bold">
                    How and where did you acquire the artifact? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Acquisition Details"
                    required
                    value={acquired}
                    onChange={(e) => setAcquired(e.target.value)}
                    className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
                  />
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                  <label className="col-span-3 text-xl font-bold">
                    Additional Information
                  </label>
                  <textarea
                    placeholder="Any other information the museum should know?"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
                  />
                </div>

                {/* Narrative / Story */}
                <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                  <label className="col-span-3 text-xl font-bold">
                    Brief Narrative or Story
                  </label>
                  <textarea
                    placeholder="Any relevant story behind the artifact?"
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
                  />
                </div>

                {/* Images */}
                <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                  <label className="col-span-5 md:col-span-3 text-xl font-bold">
                    Images of the Artifact <span className="text-red-500">*</span>
                  </label>
                  <div className="col-span-7 md:col-span-9">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="px-4 py-2 border-2 border-black rounded-2xl text-sm"
                    />
                    {renderImagePreviews(images)}
                  </div>
                </div>

{/* Documentation Files */}
<div className="grid md:grid-cols-12 items-center gap-4 mb-6">
  <label className="col-span-5 md:col-span-3 text-xl font-bold">
    Relevant Documentation
  </label>
  <div className="col-span-7 md:col-span-9 flex flex-col gap-2">
    <input
      type="file"
      multiple
      // Remove the accept="image/*" restriction to allow all file types
      onChange={handleDocumentUpload}
      className="px-4 py-2 border-2 border-black rounded-2xl text-sm"
    />
    
    {uploadedDocuments.length > 0 && (
      <div className="mt-2 border p-2 rounded-md">
        <p className="font-semibold mb-1">Uploaded Documents:</p>
        <ul className="space-y-1">
          {uploadedDocuments.map((doc, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{doc.name} ({Math.round(doc.size / 1024)} KB)</span>
              <button 
                onClick={() => removeDocument(index)}
                className="text-red-600 hover:text-red-800"
                type="button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>


                {/* Related Images */}
                          
              <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
                <label className="col-span-5 md:col-span-3 text-xl font-bold">
                  Related Images
                </label>
                <div className="col-span-7 md:col-span-9">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleRelatedImageUpload}
                    className="px-4 py-2 border-2 border-black rounded-2xl text-sm"
                  />
                  {renderImagePreviews(relatedImages)}
                </div>
              </div>


                {/* Submit */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    className="bg-[#E8D2B7] text-white px-10 py-2 rounded-lg hover:bg-[#524433] transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
