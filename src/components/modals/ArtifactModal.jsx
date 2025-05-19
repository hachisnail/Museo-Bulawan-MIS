import React, { useState } from 'react'
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL

export const ArtifactView = ({ onClose }) => {

  return (
    <>
      <div className=" gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">Artifact Title</span>
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

      <div className="w-full h-full justify-center flex flex-col xl:flex-row gap-x-10  overflow-auto border-t-1 pt-5">
        <div className='mx-auto w-full h-full flex justify-center'>
          <div className='w-[46rem] h-full flex  flex-col items-center gap-y-5'>

            <div className='h-fit w-full flex items-center'>
              {/* picture container */}
              <div className='w-fit px-4 h-fit flex justify-center flex-col items-center gap-y-5'>
                {/* preview container */}
                <div className="w-[10rem] h-[10rem] bg-gray-900 rounded-md">

                </div>
                <div className="w-[10rem] h-[10rem] bg-gray-900 rounded-md">

                </div>
                <div className="w-[10rem] h-[10rem] bg-gray-900 rounded-md">

                </div>

              </div>

              <div className='min-w-[33rem] h-[33rem] bg-gray-900 rounded-md'>
                {/* current picture */}

              </div>
            </div>

            <div className=' w-[44rem] h-full flex flex-col items-center justify-center p-5 rounded-sm border-gray-400 border-1 gap-y-2'>
              <div className='w-full text-2xl font-semibold'>
                <span>Artifact Description</span>
              </div>
              <div className='w-full h-[18rem] overflow-scroll px-5 text-justify  py-2'>
                <span className='text-xl '>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


                </span>
              </div>
            </div>

          </div>



          <div className='w-[31rem] h-full rounded-md flex flex-col gap-y-5'>

            <div className='w-full h-fit flex flex-col gap-y-2 border-1 rounded-sm p-5 border-gray-400'>
              <span className='text-2xl font-semibold'>Display Information</span>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Display Status:</span>
                <span className='font-semibold'>Stored</span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Last Maintenance:</span>
                <span className='font-semibold'>asdasd</span>
              </div>


            </div>
            <div className='w-full h-fit flex flex-col gap-y-2 border-1 rounded-sm p-5 border-gray-400'>
              {/* metadata */}

              <span className='text-2xl font-semibold'>Artifact Information</span>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Date of Creation:</span>
                <span className='font-semibold'>asdasd</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Origin/Provenance:</span>
                <span className='font-semibold'>asdasd</span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Current Location:</span>
                <span className='font-semibold'>asdasd</span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Culture or Civilization:</span>
                <span className='font-semibold'>asdasd</span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Period/Era:</span>
                <span className='font-semibold'>asdasd</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Discovery Details:</span>
                <span className='font-semibold'>asdasd</span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Excavation Site:</span>
                <span className='font-semibold'>asdasd</span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Collection/<br />Accession Number:</span>
                <span className='font-semibold'><br />asdasd</span>
              </div>

              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Acquisition History:</span>
                <span className='font-semibold'>asdasd</span>
              </div>
            </div>

            <div className='w-full h-fit rounded-sm border-1 border-gray-400 p-5 gap-y-2 flex flex-col'>
              {/* donators Information */}
              <span className='text-2xl font-semibold'>Donators Information</span>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>From:</span>
                <span className='font-semibold'>asdasd  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; asdasd </span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Email:</span>
                <span className='font-semibold'>asdasd@email.com </span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Phone Number:</span>
                <span className='font-semibold'>asdasd </span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Address:</span>
                <span className='font-semibold'>asdasd </span>
              </div>
              <div className='ml-5 flex gap-x-2 text-lg'>
                <span className='w-[10rem]  '>Organization:</span>
                <span className='font-semibold h-auto truncate w-[16.5rem]'>asdasdasdasdasdasdasdasdasdasdadasdasdasdadadasd </span>
              </div>
            </div>

          </div>
          <div className='w-[42rem] h-full flex justify-center'>
            <div className='w-[40rem] h-full flex flex-col gap-y-5'>
              {/* other info */}
              <div className='w-full h-fit border-1 border-gray-400 rounded-sm p-5 flex flex-col gap-y-2'>
                <span className='text-2xl font-semibold'>Maintenance</span>
                <div className='w-full h-[16rem] px-5 text-justify overflow-auto'>
                  <span className='text-lg'>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                  </span>
                </div>

              </div>
              <div className='w-full h-fit border-1 border-gray-400 rounded-sm p-5 flex flex-col gap-y-2'>
                <span className='text-2xl font-semibold'>Related Files</span>
                <div className='w-full flex flex-col h-[5rem] pl-5 gap-y-2'>
                  {/* span table to display related files */}
                  <span className='text-lg text-red-600'>asds.pdf</span>
                </div>
              </div>

              <div className='w-full h-full border-1 border-gray-400 rounded-sm p-5 flex flex-col gap-y-2'>
                <span className='text-2xl font-semibold'>Hyperlinks</span>
                <div className='w-full h-full'>
                  {/* cards table to display related files or 'hyperlinks' */}
                </div>

                <div className='w-full h-fit flex justify-end'>
                  <button className='w-20 h-10 border-1 rounded-sm border-gray-400 cursor-pointer hover:bg-gray-300'>View All</button>
                </div>


              </div>


            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export const ArtifactAdd = ({ onClose }) => {
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
    },
  })

  // State for document files
  const [documentFiles, setDocumentFiles] = useState([])

  // State for picture files
  const [pictureFiles, setPictureFiles] = useState([])

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Add flat fields
      const flatFields = [
        'artifact_creator',
        'artifact_type',
        'creation_date',
        'upload_date',
        'accession_type',
        'artifact_condition',
        'modified_date',
        'donation_date',
        'display_status',
        'description'
      ];

      flatFields.forEach(field => {
        if (formData[field]) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Add complex objects as JSON
      formDataToSend.append('lending_duration', JSON.stringify(formData.lending_duration));
      formDataToSend.append('description_data', JSON.stringify(formData.description_data));
      formDataToSend.append('donation_info', JSON.stringify(formData.donation_info));

      // Append picture files
      pictureFiles.forEach((file) => {
        formDataToSend.append('pictures', file);
      });

      // Append document files
      documentFiles.forEach((file) => {
        formDataToSend.append('documents', file);
      });

      console.log('Form data prepared:', formData);
      console.log('Files prepared:', { documentFiles, pictureFiles });

      // Note: Not implementing database submission as requested
      alert('Artifact data prepared successfully!');

    } catch (error) {
      console.error('Error with artifact data:', error);
      alert(`Error preparing artifact data: ${error.message}`);
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
              <input
                id="creation_date"
                name="creation_date"
                type="date"
                value={formData.creation_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
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
              <input
                id="donation_date"
                name="donation_date"
                type="date"
                value={formData.donation_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
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

          {/* Donor Information - Show only when not lend */}
          {formData.accession_type !== 'lend' && (
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
                  placeholder="John Smith"
                  value={formData.donation_info.donor_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

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
                  placeholder="john@example.com"
                  value={formData.donation_info.donor_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

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
                  placeholder="+1 (555) 123-4567"
                  value={formData.donation_info.donor_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              <div className="flex mt-5">
                <label
                  htmlFor="donation_info.donor_address"
                  className="min-w-[15rem] text-lg md:text-2xl font-semibold"
                >
                  Address
                </label>
                <input
                  id="donation_info.donor_address"
                  name="donation_info.donor_address"
                  type="text"
                  placeholder="123 Main St, City, Country"
                  value={formData.donation_info.donor_address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

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
                  placeholder="Art Foundation Inc."
                  value={formData.donation_info.donor_organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>
            </div>
          )}

          {/* Lending Information - Show only when type is lend */}
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
                <input
                  id="lending_duration.start_date"
                  name="lending_duration.start_date"
                  type="date"
                  value={formData.lending_duration.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              <div className="flex mt-5">
                <label
                  htmlFor="lending_duration.end_date"
                  className="min-w-[15rem] text-lg md:text-2xl font-semibold"
                >
                  Lending End
                </label>
                <input
                  id="lending_duration.end_date"
                  name="lending_duration.end_date"
                  type="date"
                  value={formData.lending_duration.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
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
              <input
                id="description_data.discovery_details.discovery_date"
                name="description_data.discovery_details.discovery_date"
                type="date"
                value={formData.description_data.discovery_details.discovery_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
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
              className="cursor-pointer px-8 py-4 bg-blue-600 text-white rounded-xl text-xl font-semibold hover:bg-blue-700 transition"
            >
              Register Artifact
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