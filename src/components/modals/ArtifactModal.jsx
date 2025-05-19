import React, { useState } from 'react'
import axios from 'axios';
import ResponsiveDatePicker from '../function/CustomDatePicker';
import useAddressLogic from '../function/AddressHook';


const API_URL = import.meta.env.VITE_API_URL

export const ArtifactView = ({ artifact, onClose }) => {
  // If no artifact was provided, show placeholder
  if (!artifact) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="text-2xl text-gray-500">No artifact data available</span>
      </div>
    );
  }

  // Helper function to safely access nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((o, key) =>
      (o && o[key] !== undefined && o[key] !== null ? o[key] : null), obj) || defaultValue;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Get the main thumbnail image or a placeholder
  const mainImage = artifact.ArtifactFiles?.find(file => file.file_type === 'picture')?.file_path || null;
  const thumbnails = artifact.ArtifactFiles?.filter(file => file.file_type === 'picture') || [];
  const documents = artifact.ArtifactFiles?.filter(file => file.file_type === 'document') || [];

  // Get donor information
  const donor = artifact.Donator || {};

  return (
    <>
      <div className="gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">{artifact.name || 'Artifact'}</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={onClose}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Artifact{' '}
          </span>
          <span className='text-2xl font-extrabold text-amber-900'>&nbsp; &gt; &nbsp;</span>
          <span> View </span>
        </div>
      </div>

      <div className="w-full h-full justify-center flex flex-col xl:flex-row gap-x-10 overflow-auto border-t-1 pt-5">
        <div className='mx-auto w-full h-full flex justify-center'>
          <div className='w-[46rem] h-full flex flex-col items-center gap-y-5'>
            <div className='h-fit w-full flex items-center'>
              {/* Thumbnails container */}
              <div className='w-fit px-4 h-fit flex justify-center flex-col items-center gap-y-5'>
                {thumbnails.length > 0 ? (
                  thumbnails.slice(0, 3).map((file, index) => (
                    <div key={index} className="w-[10rem] h-[10rem] bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={file.file_path}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-[10rem] h-[10rem] bg-gray-300 rounded-md flex items-center justify-center">
                    <i className="fas fa-image text-gray-500 text-4xl"></i>
                  </div>
                )}
              </div>

              {/* Main image display */}
              <div className='min-w-[33rem] h-[33rem] bg-gray-200 rounded-md flex items-center justify-center overflow-hidden'>
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={artifact.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <i className="fas fa-image text-6xl mb-4"></i>
                    <p className="text-xl">No image available</p>
                  </div>
                )}
              </div>
            </div>

            <div className='w-[44rem] h-full flex flex-col items-center justify-center p-5 rounded-sm border-gray-400 border-1 gap-y-2'>
              <div className='w-full text-2xl font-semibold'>
                <span>Artifact Description</span>
              </div>
              <div className='w-full h-[18rem] overflow-scroll px-5 text-justify py-2'>
                <span className='text-xl'>
                  {artifact.description || 'No description available for this artifact.'}
                </span>
              </div>
            </div>
          </div>

          <div className='w-[31rem] h-full rounded-md flex flex-col gap-y-5'>
            <div className='w-full h-fit flex flex-col gap-y-2 border-1 rounded-sm p-5 border-gray-400'>
              <span className='text-2xl font-semibold'>Display Information</span>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Display Status:</span>
                <span className='font-semibold'>
                  {artifact.display_status ? artifact.display_status.charAt(0).toUpperCase() + artifact.display_status.slice(1) : 'N/A'}
                </span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Last Maintenance:</span>
                <span className='font-semibold'>{formatDate(artifact.modified_date)}</span>
              </div>
            </div>

            <div className='w-full h-fit flex flex-col gap-y-2 border-1 rounded-sm p-5 border-gray-400'>
              <span className='text-2xl font-semibold'>Artifact Information</span>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Date of Creation:</span>
                <span className='font-semibold'>{formatDate(artifact.creation_date)}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Origin/Provenance:</span>
                <span className='font-semibold'>
                  {safeGet(artifact, 'ArtifactDetail.country')} {safeGet(artifact, 'ArtifactDetail.region') ? `- ${artifact.ArtifactDetail.region}` : ''}
                </span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Current Location:</span>
                <span className='font-semibold'>{artifact.display_status === 'displayed' ? 'Museum Display' : 'Storage'}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Culture or Civilization:</span>
                <span className='font-semibold'>{safeGet(artifact, 'ArtifactDetail.culture')}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Period/Era:</span>
                <span className='font-semibold'>{safeGet(artifact, 'ArtifactDetail.period')}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Discovery Details:</span>
                <span className='font-semibold'>{safeGet(artifact, 'ArtifactDetail.discoverer')}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Excavation Site:</span>
                <span className='font-semibold'>{safeGet(artifact, 'ArtifactDetail.excavation_site')}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Collection/<br />Accession Number:</span>
                <span className='font-semibold'><br />{artifact.id}</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]'>Acquisition History:</span>
                <span className='font-semibold'>{artifact.accession_type} - {formatDate(artifact.upload_date)}</span>
              </div>
            </div>

            {artifact.donator_id && (
              <div className='w-full h-fit rounded-sm border-1 border-gray-400 p-5 gap-y-2 flex flex-col'>
                <span className='text-2xl font-semibold'>Donator Information</span>
                <div className='ml-5 flex gap-x-2 text-lg'>
                  <span className='w-[10rem]'>From:</span>
                  <span className='font-semibold'>{safeGet(donor, 'name')} {donor.sex ? `(${donor.sex})` : ''}</span>
                </div>
                <div className='ml-5 flex gap-x-2 text-lg'>
                  <span className='w-[10rem]'>Email:</span>
                  <span className='font-semibold'>{safeGet(donor, 'email')}</span>
                </div>
                <div className='ml-5 flex gap-x-2 text-lg'>
                  <span className='w-[10rem]'>Phone Number:</span>
                  <span className='font-semibold'>{safeGet(donor, 'phone')}</span>
                </div>
                <div className='ml-5 flex gap-x-2 text-lg'>
                  <span className='w-[10rem]'>Address:</span>
                  <span className='font-semibold'>
                    {[
                      donor.street,
                      donor.barangay,
                      donor.city,
                      donor.province
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
                <div className='ml-5 flex gap-x-2 text-lg'>
                  <span className='w-[10rem]'>Organization:</span>
                  <span className='font-semibold h-auto truncate w-[16.5rem]'>{safeGet(donor, 'organization')}</span>
                </div>
              </div>
            )}
          </div>

          <div className='w-[42rem] h-full flex justify-center'>
            <div className='w-[40rem] h-full flex flex-col gap-y-5'>
              {artifact.ArtifactLendings && artifact.ArtifactLendings.length > 0 && (
                <div className='w-full h-fit border-1 border-gray-400 rounded-sm p-5 flex flex-col gap-y-2'>
                  <span className='text-2xl font-semibold'>Lending Information</span>
                  <div className='ml-5 flex gap-x-2 text-lg'>
                    <span className='w-[10rem]'>Lender:</span>
                    <span className='font-semibold'>{artifact.ArtifactLendings[0].lender_name}</span>
                  </div>
                  <div className='ml-5 flex gap-x-2 text-lg'>
                    <span className='w-[10rem]'>Period:</span>
                    <span className='font-semibold'>
                      {formatDate(artifact.ArtifactLendings[0].start_date)} to {formatDate(artifact.ArtifactLendings[0].end_date)}
                    </span>
                  </div>
                </div>
              )}

              {/* Related files/documents section */}
              {documents.length > 0 && (
                <div className='w-full h-fit border-1 border-gray-400 rounded-sm p-5 flex flex-col gap-y-2'>
                  <span className='text-2xl font-semibold'>Related Files</span>
                  <div className='w-full flex flex-col h-auto pl-5 gap-y-2'>
                    {documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className='text-lg text-blue-600 hover:underline flex items-center gap-x-2'
                      >
                        <i className="far fa-file-pdf"></i>
                        {doc.original_name || doc.filename}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className='w-full h-fit border-1 border-gray-400 rounded-sm p-5 flex flex-col gap-y-2'>
                <span className='text-2xl font-semibold'>Additional Information</span>
                <div className='w-full h-[16rem] px-5 text-justify overflow-auto'>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-semibold">Type:</td>
                        <td>{artifact.artifact_type}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-semibold">Condition:</td>
                        <td>{artifact.condition}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-semibold">Added to collection:</td>
                        <td>{formatDate(artifact.upload_date)}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-semibold">Last modified:</td>
                        <td>{formatDate(artifact.modified_date)}</td>
                      </tr>
                      {artifact.ArtifactDetail?.site_location && (
                        <tr className="border-b border-gray-200">
                          <td className="py-2 font-semibold">Site location:</td>
                          <td>{artifact.ArtifactDetail.site_location}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ArtifactAdd = ({ onClose }) => {
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    artifact_creator: '',
    artifact_type: '',
    creation_date: '',
    upload_date: new Date().toISOString().split('T')[0],
    accession_type: '',
    artifact_condition: '',
    modified_date: '',
    donation_date: '',
    display_status: 'stored',
    description: '', // Text description
    lending_duration: {
      start_date: '',
      end_date: '',
      lender: '',
    },
    description_data: {
      origin: {
        country: '',
        region: '',
      },
      culture: {
        name: '',
      },
      period: {
        name: '',
      },
      discovery_details: {
        discoverer: '',
        discovery_date: '',
      },
      excavation_site: {
        site_name: '',
        location: '',
      },
      accession_no: {
        number: '',
      },
      aquisition_history: {
        provenance: '',
      },
    },
    // Add donation information
    donation_info: {
      donor_name: '',
      donor_email: '',
      donor_phone: '',
      donor_address: '',
      donor_organization: '',
      // Add new fields
      sex: '',
      age: '',
      province: '',
      city: '',
      barangay: '',
      street: '',
    },
  })

  // State for document files
  const [documentFiles, setDocumentFiles] = useState([])

  // State for picture files
  const [pictureFiles, setPictureFiles] = useState([])

  // Add address hook
  const {
    provinces,
    cities,
    barangays,
    selectedProvince,
    setSelectedProvince,
    selectedCity,
    setSelectedCity,
    selectedBarangay,
    setSelectedBarangay,
  } = useAddressLogic();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Handle nested properties using dot notation (e.g., "description_data.origin.country")
    if (name.includes('.')) {
      const parts = name.split('.')
      setFormData((prevData) => {
        const newData = { ...prevData }
        let current = newData

        // Navigate to the correct nested object
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]]
        }

        // Set the value
        current[parts[parts.length - 1]] = value
        return newData
      })
    } else {
      // Handle top-level properties
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  // Handle document file selection
  const handleDocumentFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setDocumentFiles(selectedFiles)
  }

  // Handle picture file selection
  const handlePictureFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setPictureFiles(selectedFiles)
  }

  // Clear document files
  const clearDocumentFiles = () => {
    setDocumentFiles([])
    // Reset the file input value
    const fileInput = document.getElementById('documentUpload')
    if (fileInput) fileInput.value = ''
  }

  // Clear picture files
  const clearPictureFiles = () => {
    setPictureFiles([])
    // Reset the file input value
    const fileInput = document.getElementById('pictureUpload')
    if (fileInput) fileInput.value = ''
  }

  // In ArtifactAdd.jsx
  // In ArtifactAdd.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Validate required fields
      const requiredFields = [
        'artifact_creator',     // Artifact name
        'artifact_type',        // Type of artifact
        'artifact_condition',   // Physical condition
        'accession_type',       // How it was acquired
      ];

      const errors = [];
      requiredFields.forEach(field => {
        if (!formData[field]) {
          errors.push(`${field.replace('_', ' ')} is required`);
        }
      });

      // Type-specific validation
      if (formData.accession_type === 'donated' && !formData.donation_info?.donor_name) {
        errors.push("Donor name is required for donations");
      }

      if (formData.accession_type === 'lend' && (
        !formData.lending_duration?.lender ||
        !formData.lending_duration?.start_date ||
        !formData.lending_duration?.end_date
      )) {
        errors.push("All lending information is required");
      }

      if (errors.length > 0) {
        alert(errors.join('\n'));
        setIsLoading(false);
        return;
      }

      // Step 2: Prepare FormData for submission
      const formDataToSend = new FormData();

      // Basic artifact data
      formDataToSend.append('name', formData.artifact_creator);
      formDataToSend.append('artifact_type', formData.artifact_type);
      formDataToSend.append('creation_date', formData.creation_date || '');
      formDataToSend.append('accession_type', formData.accession_type);
      formDataToSend.append('condition', formData.artifact_condition);
      formDataToSend.append('display_status', formData.display_status || 'stored');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('accession_number', formData.description_data?.accession_no?.number || '');
      formDataToSend.append('acquisition_date', formData.donation_date || '');

      // Artifact details - structured fields from description_data
      const detailsData = {
        country: formData.description_data?.origin?.country || '',
        region: formData.description_data?.origin?.region || '',
        culture: formData.description_data?.culture?.name || '',
        period: formData.description_data?.period?.name || '',
        discoverer: formData.description_data?.discovery_details?.discoverer || '',
        discovery_date: formData.description_data?.discovery_details?.discovery_date || '',
        excavation_site: formData.description_data?.excavation_site?.site_name || '',
        site_location: formData.description_data?.excavation_site?.location || ''
      };
      formDataToSend.append('artifact_details', JSON.stringify(detailsData));

      // Extract full donor information including new fields
      const donorData = {
        donor_name: formData.donation_info?.donor_name || '',
        donor_email: formData.donation_info?.donor_email || '',
        donor_phone: formData.donation_info?.donor_phone || '',
        donor_organization: formData.donation_info?.donor_organization || '',

        // Make sure these fields are properly included
        sex: formData.donation_info?.sex || '',
        age: formData.donation_info?.age || '',
        province: selectedProvince?.name || formData.donation_info?.province || '',
        city: selectedCity?.name || formData.donation_info?.city || '',
        barangay: selectedBarangay?.name || formData.donation_info?.barangay || '',
        street: formData.donation_info?.street || ''
      };

      console.log("Donor data being sent:", donorData); // Debug line
      formDataToSend.append('donor_information', JSON.stringify(donorData));

      // Handle lending information if acquisition type is 'lend'
      if (formData.accession_type === 'lend' && formData.lending_duration) {
        const lendingData = {
          lender_name: formData.lending_duration.lender || '',
          start_date: formData.lending_duration.start_date || '',
          end_date: formData.lending_duration.end_date || ''
        };
        formDataToSend.append('lending_information', JSON.stringify(lendingData));
      }

      // Add files (pictures and documents)
      if (pictureFiles.length > 0) {
        pictureFiles.forEach(file => {
          formDataToSend.append('pictures', file);
        });
      }

      if (documentFiles.length > 0) {
        documentFiles.forEach(file => {
          formDataToSend.append('documents', file);
        });
      }

      // Step 3: Submit the form
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/artifact`,
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        );

        if (response.status === 201) {
          alert('Artifact added successfully!');
          onClose(); // Close the modal
        } else {
          throw new Error('Error adding artifact');
        }
      } catch (error) {
        console.error('Error adding artifact:', error);

        // Show more detailed error information from the server
        if (error.response?.data?.error) {
          alert(`Server error: ${error.response.data.error}`);
        } else {
          alert(`Error adding artifact: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };






  return (
    <>
      <div className="gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">Add New Artifact</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={onClose}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Artifact{' '}
          </span>
          <span className='text-2xl font-extrabold text-amber-900'>&nbsp; &gt; &nbsp;</span>
          <span> Insert </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-full justify-center flex flex-col xl:flex-row gap-x-10 px-10 overflow-auto border-y-1 pt-5"
      >
        {/* Left Column */}
        <div className="h-auto w-full xl:w-[65rem] flex flex-col gap-y-6">
          {/* Basic Information Section */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Basic Information</h3>

            <div className="flex">
              <label
                htmlFor="artifact_creator"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Artifact Name
              </label>
              <input
                id="artifact_creator"
                name="artifact_creator"
                type="text"
                placeholder="The Golden Sword"
                required
                value={formData.artifact_creator}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="artifact_type"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Artifact Type
              </label>
              <select
                id="artifact_type"
                name="artifact_type"
                required
                value={formData.artifact_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              >
                <option value="">Select a type</option>
                <option value="tools">Tools</option>
                <option value="weapons">Weapons</option>
                <option value="personal adornment">Personal Adornment</option>
                <option value="ceremonial objects">Ceremonial Objects</option>
                <option value="art">Art</option>
                <option value="historic document">Historic Document</option>
                <option value="military artifacts">Military Artifacts</option>
                <option value="scientific specimens">
                  Scientific Specimens
                </option>
                <option value="everyday objects">Everyday Objects</option>
              </select>
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="creation_date"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Creation Date
              </label>
              <div className="w-full">
                <ResponsiveDatePicker
                  selected={formData.creation_date ? new Date(formData.creation_date) : null}
                  onChange={(date) => handleChange({
                    target: {
                      name: 'creation_date',
                      value: date ? date.toISOString().split('T')[0] : ''
                    }
                  })}
                  isClearable
                  placeholderText="Select creation date"
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter a detailed description of the artifact..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg min-h-[120px] resize-vertical"
              />
            </div>
          </div>

          {/* Condition Section */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Condition & Status</h3>

            <div className="flex ">
              <label
                htmlFor="artifact_condition"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Condition
              </label>
              <select
                id="artifact_condition"
                name="artifact_condition"
                required
                value={formData.artifact_condition}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="fragmentary">Fragmentary</option>
                <option value="unstable">Unstable</option>
                <option value="deteriorated">Deteriorated</option>
              </select>
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="display_status"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Display Status
              </label>
              <select
                id="display_status"
                name="display_status"
                required
                value={formData.display_status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              >
                <option value="stored">Stored</option>
                <option value="displayed">Displayed</option>
              </select>
            </div>
          </div>

          {/* Origin & Culture Section */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Origin & Culture</h3>

            <div className="flex">
              <label
                htmlFor="description_data.origin.country"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Country
              </label>
              <input
                id="description_data.origin.country"
                name="description_data.origin.country"
                type="text"
                placeholder="Egypt"
                value={formData.description_data.origin.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.origin.region"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Region
              </label>
              <input
                id="description_data.origin.region"
                name="description_data.origin.region"
                type="text"
                placeholder="Nile Valley"
                value={formData.description_data.origin.region}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.culture.name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Culture
              </label>
              <input
                id="description_data.culture.name"
                name="description_data.culture.name"
                type="text"
                placeholder="Ancient Egyptian"
                value={formData.description_data.culture.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.period.name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Period
              </label>
              <input
                id="description_data.period.name"
                name="description_data.period.name"
                type="text"
                placeholder="New Kingdom"
                value={formData.description_data.period.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="h-auto w-full xl:w-[65rem] flex flex-col gap-y-6">
          {/* Acquisition Section */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Acquisition Details</h3>

            <div className="flex">
              <label
                htmlFor="accession_type"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Acquisition Type
              </label>
              <select
                id="accession_type"
                name="accession_type"
                required
                value={formData.accession_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              >
                <option value="">Select type</option>
                <option value="lend">Lend</option>
                <option value="donated">Donated</option>
                <option value="purchased">Purchased</option>
              </select>
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="donation_date"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Acquisition Date
              </label>
              <div className="w-full">
                <ResponsiveDatePicker
                  selected={formData.donation_date ? new Date(formData.donation_date) : null}
                  onChange={(date) => handleChange({
                    target: {
                      name: 'donation_date',
                      value: date ? date.toISOString().split('T')[0] : ''
                    }
                  })}
                  isClearable
                  placeholderText="Select acquisition date"
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.accession_no.number"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Accession Number
              </label>
              <input
                id="description_data.accession_no.number"
                name="description_data.accession_no.number"
                type="text"
                placeholder="AC-2025-0001"
                value={formData.description_data.accession_no.number}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>

          {/* Donor Information - Always show */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Donor Information</h3>

            <div className="flex">
              <label
                htmlFor="donation_info.donor_name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Donor Name
              </label>
              <input
                id="donation_info.donor_name"
                name="donation_info.donor_name"
                type="text"
                placeholder="Enter donor name"
                value={formData.donation_info.donor_name}
                onChange={handleChange}
                required={formData.accession_type === 'donated'}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            {/* Sex Selection */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.sex"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Sex
              </label>
              <select
                id="donation_info.sex"
                name="donation_info.sex"
                value={formData.donation_info.sex}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age Input */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.age"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Age
              </label>
              <input
                id="donation_info.age"
                name="donation_info.age"
                type="number"
                min="0"
                max="150"
                placeholder="Enter age"
                value={formData.donation_info.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            {/* Province Selection */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.province"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Province
              </label>
              <input
                list="provinceList"
                id="donation_info.province"
                name="donation_info.province"
                value={formData.donation_info.province}
                onChange={(e) => {
                  const value = e.target.value;
                  const province = provinces.find(p => p.name === value);

                  setSelectedProvince(province || null);
                  handleChange({
                    target: {
                      name: 'donation_info.province',
                      value: value
                    }
                  });

                  // Clear city and barangay if province changes
                  if (selectedProvince?.name !== value) {
                    setSelectedCity(null);
                    setSelectedBarangay(null);
                    handleChange({
                      target: {
                        name: 'donation_info.city',
                        value: ''
                      }
                    });
                    handleChange({
                      target: {
                        name: 'donation_info.barangay',
                        value: ''
                      }
                    });
                  }
                }}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                placeholder="Enter or select province"
              />
              <datalist id="provinceList">
                {provinces.map(province => (
                  <option key={province.code} value={province.name} />
                ))}
              </datalist>
            </div>

            {/* City Selection */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.city"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                City/Municipality
              </label>
              <input
                list="cityList"
                id="donation_info.city"
                name="donation_info.city"
                value={formData.donation_info.city}
                onChange={(e) => {
                  const value = e.target.value;
                  const city = cities.find(c => c.name === value);

                  setSelectedCity(city || null);
                  handleChange({
                    target: {
                      name: 'donation_info.city',
                      value: value
                    }
                  });

                  // Clear barangay if city changes
                  if (selectedCity?.name !== value) {
                    setSelectedBarangay(null);
                    handleChange({
                      target: {
                        name: 'donation_info.barangay',
                        value: ''
                      }
                    });
                  }
                }}
                disabled={!formData.donation_info.province}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                placeholder="Enter or select city/municipality"
              />
              <datalist id="cityList">
                {cities.map(city => (
                  <option key={city.code} value={city.name} />
                ))}
              </datalist>
            </div>

            {/* Barangay Selection */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.barangay"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Barangay
              </label>
              <input
                list="barangayList"
                id="donation_info.barangay"
                name="donation_info.barangay"
                value={formData.donation_info.barangay}
                onChange={(e) => {
                  const value = e.target.value;
                  const barangay = barangays.find(b => b.name === value);

                  setSelectedBarangay(barangay || null);
                  handleChange({
                    target: {
                      name: 'donation_info.barangay',
                      value: value
                    }
                  });
                }}
                disabled={!formData.donation_info.city}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                placeholder="Enter or select barangay"
              />
              <datalist id="barangayList">
                {barangays.map(barangay => (
                  <option key={barangay.code} value={barangay.name} />
                ))}
              </datalist>
            </div>

            {/* Street Address */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.street"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Street
              </label>
              <input
                id="donation_info.street"
                name="donation_info.street"
                type="text"
                placeholder="House number, street name"
                value={formData.donation_info.street}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            {/* Existing email field */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.donor_email"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Email
              </label>
              <input
                id="donation_info.donor_email"
                name="donation_info.donor_email"
                type="email"
                placeholder="contact@example.com"
                value={formData.donation_info.donor_email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            {/* Phone Number */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.donor_phone"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Phone Number
              </label>
              <input
                id="donation_info.donor_phone"
                name="donation_info.donor_phone"
                type="tel"
                placeholder="+63 XXX XXX XXXX"
                value={formData.donation_info.donor_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            {/* Organization */}
            <div className="flex mt-5">
              <label
                htmlFor="donation_info.donor_organization"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Organization
              </label>
              <input
                id="donation_info.donor_organization"
                name="donation_info.donor_organization"
                type="text"
                placeholder="Organization name (optional)"
                value={formData.donation_info.donor_organization}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>

          {/* Lending Information - ONLY show when type is 'lend' */}
          {formData.accession_type === 'lend' && (
            <div className="border-2 border-gray-300 p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Lending Information</h3>

              <div className="flex">
                <label
                  htmlFor="lending_duration.lender"
                  className="min-w-[15rem] text-lg md:text-2xl font-semibold"
                >
                  Lender Name
                </label>
                <input
                  id="lending_duration.lender"
                  name="lending_duration.lender"
                  type="text"
                  placeholder="British Museum"
                  value={formData.lending_duration.lender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              <div className="flex mt-5">
                <label
                  htmlFor="lending_duration.start_date"
                  className="min-w-[15rem] text-lg md:text-2xl font-semibold"
                >
                  Lending Start
                </label>
                <div className="w-full">
                  <ResponsiveDatePicker
                    selected={formData.lending_duration.start_date ? new Date(formData.lending_duration.start_date) : null}
                    onChange={(date) => handleChange({
                      target: {
                        name: 'lending_duration.start_date',
                        value: date ? date.toISOString().split('T')[0] : ''
                      }
                    })}
                    isClearable
                    placeholderText="Select lending start date"
                    className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              <div className="flex mt-5">
                <label
                  htmlFor="lending_duration.end_date"
                  className="min-w-[15rem] text-lg md:text-2xl font-semibold"
                >
                  Lending End
                </label>
                <div className="w-full">
                  <ResponsiveDatePicker
                    selected={formData.lending_duration.end_date ? new Date(formData.lending_duration.end_date) : null}
                    onChange={(date) => handleChange({
                      target: {
                        name: 'lending_duration.end_date',
                        value: date ? date.toISOString().split('T')[0] : ''
                      }
                    })}
                    isClearable
                    placeholderText="Select lending end date"
                    className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Discovery Section */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Discovery Information</h3>

            <div className="flex">
              <label
                htmlFor="description_data.discovery_details.discoverer"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Discoverer
              </label>
              <input
                id="description_data.discovery_details.discoverer"
                name="description_data.discovery_details.discoverer"
                type="text"
                placeholder="Dr. Howard Carter"
                value={formData.description_data.discovery_details.discoverer}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.discovery_details.discovery_date"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Discovery Date
              </label>
              <div className="w-full">
                <ResponsiveDatePicker
                  selected={formData.description_data.discovery_details.discovery_date ?
                    new Date(formData.description_data.discovery_details.discovery_date) : null}
                  onChange={(date) => handleChange({
                    target: {
                      name: 'description_data.discovery_details.discovery_date',
                      value: date ? date.toISOString().split('T')[0] : ''
                    }
                  })}
                  isClearable
                  placeholderText="Select discovery date"
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.excavation_site.site_name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Excavation Site
              </label>
              <input
                id="description_data.excavation_site.site_name"
                name="description_data.excavation_site.site_name"
                type="text"
                placeholder="Valley of the Kings"
                value={formData.description_data.excavation_site.site_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex mt-5">
              <label
                htmlFor="description_data.excavation_site.location"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Site Location
              </label>
              <input
                id="description_data.excavation_site.location"
                name="description_data.excavation_site.location"
                type="text"
                placeholder="Luxor, Egypt"
                value={formData.description_data.excavation_site.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>

          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">
              Related Documents & Pictures
            </h3>

            {/* Document Files Section */}
            <div className="flex">
              <label
                htmlFor="documentUpload"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Upload Documents
              </label>
              <div className="w-full">
                <div className="flex gap-x-4">
                  <input
                    id="documentUpload"
                    type="file"
                    multiple
                    onChange={handleDocumentFileChange}
                    className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                  {documentFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={clearDocumentFiles}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {documentFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">
                      {documentFiles.length} document(s) selected
                    </p>
                    <ul className="text-sm text-gray-600 mt-1 max-h-24 overflow-y-auto">
                      {documentFiles.map((file, index) => (
                        <li key={index} className="flex items-center gap-x-2">
                          <i className="far fa-file text-blue-500"></i>
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Picture Files Section */}
            <div className="flex mt-5">
              <label
                htmlFor="pictureUpload"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Upload Pictures
              </label>
              <div className="w-full">
                <div className="flex gap-x-4">
                  <input
                    id="pictureUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePictureFileChange}
                    className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                  {pictureFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={clearPictureFiles}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {pictureFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">
                      {pictureFiles.length} image(s) selected
                    </p>

                    {/* Preview thumbnails grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                      {pictureFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4 gap-x-5 px-5 pb-5">
            <button
              onClick={onClose}
              className="cursor-pointer px-8 py-4 bg-red-600 text-white rounded-xl text-xl font-semibold hover:bg-red-700 transition"
            >
              Go back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer px-8 py-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-xl text-xl font-semibold transition`}
            >
              {isLoading ? 'Registering...' : 'Register Artifact'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}



export const ArtifactHyperlink = ({ onClose }) => {


  return (
    <>
      <div className=" gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">More Information</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={onClose}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Artifact{' '}
          </span>
          <span className='text-2xl font-extrabold text-amber-900'>&nbsp; &gt; &nbsp;</span>
          <span> Hyperlinks </span>
        </div>
      </div>
      <div className='w-full h-full flex flex-col xl:flex-row gap-x-10 px-10 overflow-auto'>

      </div>
    </>
  )
}