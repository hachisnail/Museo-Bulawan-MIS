import React, { useState } from 'react'

export const ArtifactView = () => {
  return (
    <>
      <div className="w-screen h-screen fixed  backdrop-blur-xs  z-50 flex flex-col gap-y-4 items-center justify-center select-none">
        <div className="w-[60rem] xl:w-[120rem] min-h-15 bg-white shadow-2xl rounded-xl flex justify-end items-center px-5">
          <i class="fa-solid fa-xmark text-3xl cursor-pointer"></i>
        </div>
        <div className="w-[60rem] xl:w-[120rem] h-[60rem] min-h-[60rem] flex flex-col gap-y-4 overflow-y-scroll">
          <div className="w-full h-fit flex flex-col bg-white shadow-2xl rounded-xl">
            <div className="w-full min-h-15 flex justify-end items-center px-4">
              <i class="fas fa-edit text-black text-3xl cursor-pointer"></i>
            </div>
            <div className="w-[50rem] xl:w-[110rem] flex flex-col gap-y-10 min-h-[52rem] mx-auto pt-10">
              <span className="text-5xl font-semibold">
                Perlas ng Silanganan
              </span>{' '}
              {/* title of the artifact*/}
              <div className="w-full h-fit flex xl:flex-row flex-col xl:justify-between  gap-y-10">
                <div className="w-[50rem] h-[40rem] flex justify-between">
                  {/* picture container */}
                  <div className="flex flex-col justify-between">
                    <div className="w-[9rem] h-[9rem] border-1"></div>
                    <div className="w-[9rem] h-[9rem] border-1"></div>
                    <div className="w-[9rem] h-[9rem] border-1"></div>
                    <div className="w-[9rem] h-[9rem] border-1"></div>
                  </div>
                  <div className="w-[40rem] h-[40rem] border-1"></div>
                </div>

                <div className="w-[57rem] h-[40rem] flex flex-col gap-y-5">
                  {/* artifact metadata */}
                  <span className="text-3xl font-semibold w-fit">
                    Date of Creation:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Origin/Provenance:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Current Location:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Culture or Civilization:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Period/Era:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Discovery Details:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Excavation Site:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Collection/Accession Number:
                  </span>
                  <span className="text-3xl font-semibold w-fit">
                    Acquisition History:
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-auto flex xl:flex-row flex-col gap-x-4 gap-y-4 pb-20">
            <div className="min-w-[40rem] min-h-[90rem] flex flex-col gap-y-4">
              <div className="w-full min-h-[30rem] bg-white rounded-xl shadow-2xl"></div>
              <div className="w-full h-full bg-white rounded-xl shadow-2xl"></div>
            </div>

            <div className="w-full h-[90rem] bg-white rounded-xl shadow-2xl"></div>
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
    lending_duration: {
      start_date: '',
      end_date: '',
      lender: '',
    },
    description: {
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
  })

  // State for document files
  const [documentFiles, setDocumentFiles] = useState([])

  // State for picture files
  const [pictureFiles, setPictureFiles] = useState([])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Handle nested properties using dot notation (e.g., "description.origin.country")
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ ...formData, related_files: files })
    // Add your submission logic here
  }

  return (
    <>
      <div className=" gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">Artifact Information</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={onClose}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Artifact{' '}
          </span>
          <span className='text-2xl font-extrabold text-amber-900'>&nbsp; &gt; &nbsp;</span>
          <span> Add New Artifact</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-full justify-center flex flex-col xl:flex-row gap-x-10 px-10 overflow-auto"
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

            <div className="flex  mt-5">
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

            <div className="flex  mt-5">
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

            <div className="flex ">
              <label
                htmlFor="description.origin.country"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Country
              </label>
              <input
                id="description.origin.country"
                name="description.origin.country"
                type="text"
                placeholder="Egypt"
                value={formData.description.origin.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex  mt-5">
              <label
                htmlFor="description.origin.region"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Region
              </label>
              <input
                id="description.origin.region"
                name="description.origin.region"
                type="text"
                placeholder="Nile Valley"
                value={formData.description.origin.region}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex  mt-5">
              <label
                htmlFor="description.culture.name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Culture
              </label>
              <input
                id="description.culture.name"
                name="description.culture.name"
                type="text"
                placeholder="Ancient Egyptian"
                value={formData.description.culture.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex  mt-5">
              <label
                htmlFor="description.period.name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Period
              </label>
              <input
                id="description.period.name"
                name="description.period.name"
                type="text"
                placeholder="New Kingdom"
                value={formData.description.period.name}
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

            <div className="flex ">
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

            <div className="flex  mt-5">
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

            <div className="flex  mt-5">
              <label
                htmlFor="description.accession_no.number"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Accession Number
              </label>
              <input
                id="description.accession_no.number"
                name="description.accession_no.number"
                type="text"
                placeholder="AC-2025-0001"
                value={formData.description.accession_no.number}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>

          {/* Discovery Section */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Discovery Information</h3>

            <div className="flex ">
              <label
                htmlFor="description.discovery_details.discoverer"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Discoverer
              </label>
              <input
                id="description.discovery_details.discoverer"
                name="description.discovery_details.discoverer"
                type="text"
                placeholder="Dr. Howard Carter"
                value={formData.description.discovery_details.discoverer}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex  mt-5">
              <label
                htmlFor="description.discovery_details.discovery_date"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Discovery Date
              </label>
              <input
                id="description.discovery_details.discovery_date"
                name="description.discovery_details.discovery_date"
                type="date"
                value={formData.description.discovery_details.discovery_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex  mt-5">
              <label
                htmlFor="description.excavation_site.site_name"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Excavation Site
              </label>
              <input
                id="description.excavation_site.site_name"
                name="description.excavation_site.site_name"
                type="text"
                placeholder="Valley of the Kings"
                value={formData.description.excavation_site.site_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>

            <div className="flex  mt-5">
              <label
                htmlFor="description.excavation_site.location"
                className="min-w-[15rem] text-lg md:text-2xl font-semibold"
              >
                Site Location
              </label>
              <input
                id="description.excavation_site.location"
                name="description.excavation_site.location"
                type="text"
                placeholder="Luxor, Egypt"
                value={formData.description.excavation_site.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>

          {/* Lending Information */}
          <div className="border-2 border-gray-300 p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Lending Information</h3>

            <div className="flex ">
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

            <div className="flex  mt-5">
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

            <div className="flex  mt-5">
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
          <div className="flex justify-end mt-4 gap-x-5 px-5">
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