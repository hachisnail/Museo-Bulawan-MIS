// AcquisitionModal.jsx
import React, { useState, useRef } from 'react'
import axios from 'axios'
import DocumentView from './DocumentView'
import ImagePreview from './ImagePreview'

const AcquisitionModal = ({
  isModalOpen,
  selectedForm,
  handleCloseModal,
  isDonationModalOpen,
  selectedDonationForm,
  handleCloseDonationModal,
  confirmationModal,
  setConfirmationModal,
  isConfirmationOpen,
  confirmationAction,
  handleConfirmAction,
  setIsConfirmationOpen,
  selectedResponse,
  handleApprove,
  handleDecline,
  handleDeliveryAction,
}) => {
  // Add state for image preview
  const [previewImage, setPreviewImage] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Add state for email message and validation
  const [emailMessage, setEmailMessage] = useState('')
  const [messageError, setMessageError] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [viewDetailsMode, setViewDetailsMode] = useState(false);

  const messageRef = useRef(null)

  // Parsing document keys from the form
  const getDocumentKeys = (form) => {
    if (!form || !form.documents) return []

    try {
      let docs = form.documents

      // Handle string format (from database)
      if (typeof docs === 'string') {
        try {
          docs = JSON.parse(docs)
        } catch (e) {
          // If not valid JSON, it might be a comma-separated string
          return docs.split(',').filter(Boolean)
        }
      }

      // Handle array or object format
      if (Array.isArray(docs)) {
        return docs
      } else if (typeof docs === 'object') {
        return [docs]
      }

      return []
    } catch (error) {
      console.error('Error parsing documents:', error)
      return []
    }
  }

  // Only render if there's a selected form and the modal is open
  if (!isModalOpen || !selectedForm) return null

  // Get form type, status, and transfer status for conditional rendering
  const formType = selectedForm.ContributionType?.accession_type || 'N/A'
  const status = selectedForm.ContributionType?.status || 'Pending'
  const transferStatus = selectedForm.ContributionType?.transfer_status || 'N/A'
  const documentKeys = getDocumentKeys(selectedForm)

  // Get formatted date
  const formattedDate = selectedForm.donation_date
    ? new Date(selectedForm.donation_date).toLocaleDateString()
    : 'N/A'

  // Handle open image preview
  const handleOpenPreview = (imagePath) => {
    setPreviewImage(imagePath)
  }

  // Handle close image preview
  const handleClosePreview = () => {
    setPreviewImage(null)
  }

  // Handle sending email and updating status
  const handleSendEmailAndUpdateStatus = async () => {
    // First validate that the message is not empty for pending forms
    if (!emailMessage.trim()) {
      setMessageError('Please enter a message to send with the email')
      messageRef.current?.focus()
      return
    }

    setSendingEmail(true)
    setMessageError('')

    try {
      // Determine the status from the selected response
      const newStatus = selectedResponse === 'yes' ? 'Accepted' : 'Rejected'

      // Send the email and update the status in one API call
      const response = await axios.post(
        `${API_URL}/api/auth/form/${selectedForm.id}/send-status-email`,
        {
          status: newStatus,
          message: emailMessage,
        }
      )

      if (response.data.success) {
        // Show an alert on success
        alert(`Email sent successfully to ${selectedForm.Donator?.email}`)
        // Close the modal only after successful email sending
        handleCloseModal()
      } else {
        setMessageError('Failed to send email: ' + response.data.message)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setMessageError(
        error.response?.data?.message ||
          'Failed to send email. Please try again.'
      )
    } finally {
      setSendingEmail(false)
    }
  }

  // Custom close handler to prevent closing if no message is provided
  const handleCustomCloseModal = () => {
    // If status is pending and a response is selected, check for message
    if (status === 'Pending' && selectedResponse && !emailMessage.trim()) {
      setMessageError('Please enter a message before closing')
      messageRef.current?.focus()
      return
    }

    // Otherwise, allow closing
    handleCloseModal()
  }

  //left side imports from artifact modal
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
      {/* Main Form Modal */}
      <div className="gap-y-2 font-semibold flex flex-col">
        <span className="text-5xl">{formType} Form</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={handleCloseModal}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Acquisiton{' '}
          </span>
          <span className="text-2xl font-extrabold text-amber-900">
            &nbsp; &gt; &nbsp;
          </span>
          <span> View </span>
        </div>
      </div>

      <div className="w-full h-full flex flex-col border-t-1 pt-5 gap-y-5">
        <div className="w-full h-fit flex justify-between">
          {/* Status Badge */}
          <div className="w-fit h-fit flex gap-x-5">
            <span
              className={`text-lg px-4 py-2 rounded-md ${
                status === 'Accepted'
                  ? 'bg-green-500 text-white'
                  : status === 'Rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-yellow-400 text-black'
              }`}
            >
              Status: {status}
            </span>

            {/* Transfer Status Badge */}
            {status !== 'Pending' && (
              <span
                className={`text-lg px-4 py-2 rounded-md ${
                  transferStatus === 'Acquired'
                    ? 'bg-blue-500 text-white'
                    : transferStatus === 'Failed'
                    ? 'bg-orange-500 text-white'
                    : 'bg-purple-400 text-white'
                }`}
              >
                Transfer: {transferStatus}
              </span>
            )}
          </div>
          <div className="w-fit h-full flex gap-x-5 items-center">
            <span className="text-xl font-semibold">{formattedDate}</span>

            <div
              onClick={handleCloseModal}
              className="w-fit h-full items-center flex cursor-pointer "
            >
              <i class=" hover:text-gray-500 fa-solid fa-arrow-left text-4xl mx-5"></i>
            </div>
          </div>
        </div>
        {!viewDetailsMode ? (
          <div className="w-full h-full flex gap-x-4 ">
            <div className="w-fit h-full flex flex-col gap-y-2">
              {/* left block */}
              <div className="w-[30rem] h-fit flex flex-col gap-y-2 border-1 border-gray-400 rounded-md p-5">
                {/* information block */}
                {formType == 'Donation' ? (
                  <>
                    <span className="text-2xl font-semibold">
                      Donator Information
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-semibold">
                      Lender Information
                    </span>
                  </>
                )}
                <span className="text-3xl font-bold px-2 truncate h-15">
                  {' '}
                  {selectedForm.Donator?.name}
                </span>
                <div className="w-full h-full gap-y-2 flex flex-col pl-5">
                  <div className="w-full h-auto flex gap-x-2">
                    <span className="text-lg w-35">Email:</span>
                    <span className="select-text text-lg font-semibold">
                      {selectedForm.Donator?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="w-full h-auto flex gap-x-2 ">
                    <span className="text-lg w-35">Phone Number:</span>
                    <span className="select-text text-lg font-semibold ">
                      {selectedForm.Donator?.phone}
                    </span>
                  </div>
                  <div className="w-full h-auto flex gap-x-2">
                    <span className="text-lg w-35">Address:</span>
                    <span className="select-text text-lg font-semibold">
                      {selectedForm.Donator?.province}{' '}
                      {selectedForm.Donator?.City}{' '}
                      {selectedForm.Donator?.Barangay}{' '}
                      {selectedForm.Donator?.Street || ''}
                    </span>
                  </div>
                  <div className="w-full h-auto flex gap-x-2">
                    <span className="text-lg w-35">Organization</span>
                    <span className="select-text text-lg font-semibold">
                      {selectedForm.Donator?.organization}
                    </span>
                  </div>
                </div>
              </div>
              {formType == 'Lending' ? (
                <>
                  <div className="w-[30rem] h-full border-1 border-gray-400 rounded-md p-5 ">
                    {/* Lending content here */}
                    <div className="w-full h-full flex flex-col gap-y-2">
                      <span className="text-2xl font-semibold">
                        Reason for lending
                      </span>
                      <div className="w-full h-auto flex flex-col">
                        <span className="text-xl">
                          Proposed duration of the loan.
                        </span>
                        <span className="text-lg pl-6">
                          {selectedForm.ContributionType?.duration_period ||
                            'N/A'}
                        </span>
                      </div>

                      <div className="w-full h-auto flex flex-col gap-y-2">
                        <span className="text-xl">
                          Specific conditions or requirements for handling of the
                          artifact.
                        </span>
                        <span className="text-lg pl-6 h-18 border-t-1 border-gray-300 pt-2 break-words overflow-scroll">
                          {selectedForm.ContributionType?.condition || 'N/A'}
                        </span>
                      </div>

                      <div className="w-full h-auto flex flex-col gap-y-2">
                        <span className="text-xl">
                          Specific liability concerns or requirements regarding
                          the artifact.
                        </span>
                        <span className="text-lg pl-6 h-18 border-t-1 border-gray-300 pt-2 break-words overflow-scroll">
                          {selectedForm.ContributionType?.remarks || 'N/A'}
                        </span>
                      </div>
                      <div className="w-full h-auto flex flex-col gap-y-2">
                        <span className="text-xl">Reason for lending.</span>
                        <span className="text-lg pl-6 h-18 border-t-1 border-gray-300 pt-2 break-words overflow-scroll">
                          {selectedForm.ContributionType?.reason || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* empty space */}
                  <div className="w-[30rem] h-full border-1 border-gray-400 rounded-md p-5 "></div>
                </>
              )}
              <div></div>
            </div>
            <div className="w-fit h-full flex flex-col gap-y-2">
              {/* middle block */}
              <div className="w-[34rem] h-fit p-5 rounded-md border-1 border-gray-400">
                <span className="text-2xl font-semibold">
                  Artifact Information{' '}
                </span>
                <div className="w-full">
                  <div className="w-full h-auto flex flex-col ">
                    <span className="text-xl">Title/Name of the Artifact:</span>
                    <span className="text-lg pl-2">
                      {selectedForm.artifact_name}
                    </span>
                  </div>

                  <div className="w-full h-auto flex flex-col gap-y-2">
                    <span className="text-xl">Artifact Description:</span>
                    <span className="select-text text-lg text-gray-600 pl-2 h-50 overflow-scroll border-t-1 border-gray-300 break-words">
                      {selectedForm.description}
                    </span>
                  </div>

                  <div className="w-full h-auto flex flex-col gap-y-2">
                    <span className="text-xl">
                      How and where the artifact is acquired:
                    </span>
                    <span className="select-text text-lg text-gray-600 pl-2 h-50 overflow-scroll border-t-1 border-gray-300 break-words">
                      {selectedForm.acquired}
                    </span>
                  </div>

                  <div className="w-full h-auto flex flex-col gap-y-2">
                    <span className="text-xl">Additional Information:</span>
                    <span className="select-text text-lg text-gray-600 pl-2 h-50 overflow-scroll border-t-1 border-gray-300 break-words">
                      {selectedForm.additional_info}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex flex-col  gap-y-2">
              {/* right block */}
              <div className="w-full h-full flex gap-x-2">
                <div className="w-1/2 h-full flex flex-col  gap-y-2 ">


                  <div className="h-1/2 w-full">
                    <div className="w-full h-full gap-2  rounded-md border-1 border-gray-400 p-3  ">
                      <span className="text-xl font-bold">
                        Images of the Artifact
                      </span>
                      <div className="w-full h-[10rem] border-t-1 bg-gray-100 border-gray-400">
                        <div className="w-full h-full px-2">
                          {selectedForm.images && (
                            <div className="flex flex-wrap gap-3 py-3 overflow-x-auto h-full overflow-y-auto">
                              {(() => {
                                try {
                                  const imagePaths = JSON.parse(
                                    selectedForm.images
                                  )
                                  return imagePaths.map((imagePath, index) => (
                                    <div
                                      key={index}
                                      className="relative flex-shrink-0 group"
                                    >
                                      <img
                                        src={`/${imagePath}`}
                                        alt={`Artifact image ${index + 1}`}
                                        className="h-30 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                        onClick={() =>
                                          handleOpenPreview(`/${imagePath}`)
                                        }
                                        onError={(e) => {
                                          e.target.onerror = null
                                          e.target.src = '/placeholder-image.png'
                                        }}
                                      />
                                    
                                    </div>
                                  ))
                                } catch (error) {
                                  console.error('Error parsing images:', error)
                                  return (
                                    <p className="text-red-500 py-4 text-center">
                                      Error loading images
                                    </p>
                                  )
                                }
                              })()}
                            </div>
                          )}
                          {(!selectedForm.images ||
                            JSON.parse(selectedForm.images).length === 0) && (
                              <div className='w-full h-full flex items-center justify-center'>
                            <p className="text-gray-500 py-4 text-center">
                              No images available
                            </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-1/2 w-full">
                    <div className="w-full h-full  rounded-md border-1 border-gray-400 p-3  ">
                      <span className="text-xl min-h-fit font-bold">
                        Related Images of the Artifact
                      </span>
                      <div className="w-full h-[10rem] border-t-1 bg-gray-100 border-gray-400">

                        <div className="w-full h-full px-4 py-2">
                          {selectedForm.related_images && (
                            <div className="flex flex-wrap gap-3 overflow-x-auto h-full overflow-y-auto">
                              {(() => {
                                try {
                                  const imagePaths = JSON.parse(
                                    selectedForm.related_images
                                  )
                                  return imagePaths.map((imagePath, index) => (
                                    <div
                                      key={index}
                                      className="relative flex-shrink-0 group"
                                    >
                                      <img
                                        src={`/${imagePath}`}
                                        alt={`Artifact image ${index + 1}`}
                                        className="h-30 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                        onClick={() =>
                                          handleOpenPreview(`/${imagePath}`)
                                        }
                                        onError={(e) => {
                                          e.target.onerror = null
                                          e.target.src = '/placeholder-image.png'
                                        }}
                                      />
                                    
                                    </div>
                                  ))
                                } catch (error) {
                                  console.error('Error parsing images:', error)
                                  return (
                                    <p className="text-red-500 py-4 text-center">
                                      Error loading images
                                    </p>
                                  )
                                }
                              })()}
                            </div>
                          )}
                          {(!selectedForm.images ||
                            JSON.parse(selectedForm.images).length === 0) && (
                              <div className='w-full h-full flex items-center justify-center'>
                            <p className="text-gray-500 py-4 text-center">
                              No images available
                            </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full p-5 rounded-md border-1 border-gray-400">
                  {/* <div className="w-full h-full gap-2 "> */}
                    <span className="text-2xl min-h-fit font-bold">
                      Documents about the artifact
                    </span>
                    
                    {/* Documents section */}
                    <div className="w-full h-[22rem] flex flex-col gap-2 ">
                      <span className="text-xl">
                        Relevant documentation or research about the artifact.
                      </span>
                      {documentKeys.length > 0 ? (
                        <div className="border-t-1 p-3 border-gray-400 bg-gray-50 w-full h-full">
                          <DocumentView documentKeys={documentKeys} />
                        </div>
                      ) : (
                        <span className="text-xl text-[#FF0000]">
                          No documents available
                        </span>
                      )}
                    </div>
                  </div>
                </div>


              <div className="w-full h-[25rem] rounded-md border-1 border-gray-400">
                {/* Response Section - Changes Based on Status */}
                {status === 'Pending' ? (
                  <div className="h-full shadow-md rounded-md p-8 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Respond</h2>

                    {/* Approval Buttons */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        Approve?
                      </h3>
                      <div className="flex gap-6 mt-4 px-2">
                        <button
                          className={`transition rounded-lg px-3 py-1 font-semibold text-sm w-40 border 
                          ${
                            selectedResponse === 'yes'
                              ? 'bg-[#6F3FFF] text-white border-[#6F3FFF]'
                              : 'bg-gray-200 text-gray-800 hover:bg-indigo-100 border-gray-300'
                          }`}
                          onClick={handleApprove}
                        >
                          Yes
                        </button>
                        <button
                          className={`transition rounded-lg px-6 py-3 font-semibold text-lg w-40 border 
                          ${
                            selectedResponse === 'no'
                              ? 'bg-[#6F3FFF] text-white border-[#6F3FFF]'
                              : 'bg-gray-200 text-gray-800 hover:bg-indigo-100 border-gray-300'
                          }`}
                          onClick={handleDecline}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="space-y-2">
                      <label className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        Leave a message
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        ref={messageRef}
                        className={`w-full h-20 rounded-md p-4 text-lg resize-none transition border 
                          ${messageError ? 'border-red-500' : 'border-gray-400'}`}
                        placeholder="Type your message here..."
                        value={emailMessage}
                        onChange={(e) => {
                          setEmailMessage(e.target.value)
                          if (e.target.value.trim()) setMessageError('')
                        }}
                      />
                      {messageError && (
                        <p className="text-red-500 text-sm">{messageError}</p>
                      )}
                      <p className="text-gray-600 text-lg">
                        This message will be sent to{' '}
                        <span className="text-[#6F3FFF] font-semibold">
                          {selectedForm.Donator?.email || 'N/A'}
                        </span>
                      </p>
                    </div>

                    {/* Send Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendEmailAndUpdateStatus}
                        disabled={sendingEmail || !selectedResponse}
                        className={`w-40 py-2 rounded-lg text-sm font-semibold transition 
                        ${
                          sendingEmail || !selectedResponse
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-[#6F3FFF] hover:bg-[#4c3fff] text-white cursor-pointer'
                        }`}
                      >
                        {sendingEmail ? 'Sending...' : 'Done'}
                      </button>
                    </div>
                  </div>
                ) : status === 'Accepted' && transferStatus === 'On Progress' ? (
                  <div className="h-full shadow-md rounded-xl p-8 space-y-8">
                    <h2 className="text-4xl font-bold text-gray-800">
                      Update Transfer Status
                    </h2>
                    <h3 className="text-2xl font-semibold text-gray-700">
                      Was the artifact delivered?
                    </h3>
                    <div className="flex gap-6 mt-4 px-2">
                      <button
                        className="bg-[#6F3FFF] hover:bg-[#4c3fff] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
                        onClick={() =>
                          setConfirmationModal({
                            action: 'acquired',
                            open: true,
                          })
                        }
                      >
                        Yes, Delivered
                      </button>
                      <button
                        className="bg-[#6F3FFF] text-white border-[#6F3FFF] px-6 py-3 rounded-lg font-semibold text-lg transition"
                        onClick={() =>
                          setConfirmationModal({ action: 'failed', open: true })
                        }
                      >
                        No, Failed
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleCloseModal}
                        className="bg-[#6F3FFF] hover:bg-[#4c3fff] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full shadow-md flex flex-col justify-center rounded-xl p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-bold text-gray-800">
                        Transfer Status
                      </h2>
                      <span
                        className={`px-4 py-2 rounded-lg text-lg font-semibold
                          ${
                            transferStatus === 'Acquired'
                              ? 'bg-green-100 text-green-700'
                              : transferStatus === 'Failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {transferStatus}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 px-1">
                      This form's processing has been completed. No further
                      actions are available.
                    </p>
                    <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setViewDetailsMode(true)}
                      className="bg-[#4c3fff] hover:bg-[#3D2DCC] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
                    >
                      Register Artifact
                    </button>

                    <button
                      onClick={handleCloseModal}
                      className="bg-[#6F3FFF] hover:bg-[#4c3fff] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
                    >
                      Close
                    </button>
                  </div>
                  </div>
                )}
              </div>
              
              </div>
            </div>
            ) : (
            <div className="w-full h-full flex flex-col overflow-hidden px-42">
                {/* Scrollable Columns Area */}
                <div className="flex flex-1 max-h-[60vh] border-t gap-6 ">
                  {/* Left Column: Artifact Info */}
                  <div className="w-1/2 h-full overflow-y-auto p-6 ">
                    <div className="h-auto w-full xl:w-full flex flex-col gap-y-6">
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
                        <div className="h-auto w-full xl:w-full flex flex-col gap-y-6">
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
                            type="submit"
                            className="cursor-pointer px-8 py-4 bg-blue-600 text-white rounded-xl text-xl font-semibold hover:bg-blue-700 transition"
                          >
                            Register Artifact
                          </button>
                        </div>
                      </div>
                    </div>
               
                  </div>

                  {/* Right Column: Donator/Lender Info */}
                  <div className="w-1/2 h-full overflow-y-auto p-6 ">
                    <h2 className="text-2xl font-bold mb-4">
                      {formType === 'Donation' ? 'Donator' : 'Lender'} Information
                    </h2>
                    <div className='w-full h-auto border-2 border-gray-300 rounded-lg px-12 py-6'>
                      <span className="text-3xl font-bold px-2 truncate h-15">
                        {selectedForm.Donator?.name}
                      </span>
                      <div className="w-full h-auto flex gap-x-2 justify-between">
                        <span className="text-2xl ">Email:</span>
                        <span className="select-text text-2xl font-semibold">
                          {selectedForm.Donator?.email || 'N/A'}
                        </span>
                      </div>
                      <div className="w-full h-auto flex gap-x-2 justify-between ">
                        <span className="text-2xl ">Phone Number:</span>
                        <span className="select-text text-2xl font-semibold ">
                          {selectedForm.Donator?.phone}
                        </span>
                      </div>
                      <div className="w-full h-auto flex gap-x-2 justify-between">
                        <span className="text-2xl">Address:</span>
                        <span className="select-text text-2xl font-semibold">
                          {selectedForm.Donator?.province}{' '}
                          {selectedForm.Donator?.City}{' '}
                          {selectedForm.Donator?.Barangay}{' '}
                          {selectedForm.Donator?.Street || ''}
                        </span>
                      </div>
                      <div className="w-full h-auto flex gap-x-2 justify-between">
                        <span className="text-2xl ">Organization</span>
                        <span className="select-text text-2xl font-semibold">
                          {selectedForm.Donator?.organization}
                        </span>
                      </div>
                    </div>
                    {formType === 'Lending' && (
                      <>
                        <div className="w-full h-auto border-2 border-gray-300 rounded-md py-6 mt-5 px-12">
                          {/* Lending content here */}
                          <div className="w-full h-full flex flex-col gap-y-2">
                            <span className="text-2xl font-semibold">
                              Reason for lending
                            </span>
                            <div className="w-full h-auto flex flex-col">
                              <span className="text-xl">
                                Proposed duration of the loan.
                              </span>
                              <span className="text-lg pl-6">
                                {selectedForm.ContributionType?.duration_period ||
                                  'N/A'}
                              </span>
                            </div>

                            <div className="w-full h-auto flex flex-col gap-y-2">
                              <span className="text-xl">
                                Specific conditions or requirements for handling of the
                                artifact.
                              </span>
                              <span className="text-lg pl-6 h-18 border-t-1 border-gray-300 pt-2 break-words overflow-scroll">
                                {selectedForm.ContributionType?.condition || 'N/A'}
                              </span>
                            </div>

                            <div className="w-full h-auto flex flex-col gap-y-2">
                              <span className="text-xl">
                                Specific liability concerns or requirements regarding
                                the artifact.
                              </span>
                              <span className="text-lg pl-6 h-18 border-t-1 border-gray-300 pt-2 break-words overflow-scroll">
                                {selectedForm.ContributionType?.remarks || 'N/A'}
                              </span>
                            </div>
                            <div className="w-full h-auto flex flex-col gap-y-2">
                              <span className="text-xl">Reason for lending.</span>
                              <span className="text-lg pl-6 h-18 border-t-1 border-gray-300 pt-2 break-words overflow-scroll">
                                {selectedForm.ContributionType?.reason || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* abt the artifact */}
                    <div className="w-full h-full py-6 px-12 rounded-md border-2 border-gray-300 mt-5">
                      <span className="text-2xl font-semibold">
                        Artifact Information{' '}
                      </span>
                      <div className="w-full">
                        <div className="w-full h-auto flex flex-col ">
                          <span className="text-xl">Title/Name of the Artifact:</span>
                          <span className="text-lg pl-2">
                            {selectedForm.artifact_name}
                          </span>
                        </div>

                        <div className="w-full h-auto flex flex-col gap-y-2">
                          <span className="text-xl">Artifact Description:</span>
                          <span className="select-text text-lg text-gray-600 pl-2 h-50 overflow-scroll border-t-1 border-gray-300 break-words">
                            {selectedForm.description}
                          </span>
                        </div>

                        <div className="w-full h-auto flex flex-col gap-y-2">
                          <span className="text-xl">
                            How and where the artifact is acquired:
                          </span>
                          <span className="select-text text-lg text-gray-600 pl-2 h-50 overflow-scroll border-t-1 border-gray-300 break-words">
                            {selectedForm.acquired}
                          </span>
                        </div>

                        <div className="w-full h-auto flex flex-col gap-y-2">
                          <span className="text-xl">Additional Information:</span>
                          <span className="select-text text-lg text-gray-600 pl-2 h-50 overflow-scroll border-t-1 border-gray-300 break-words">
                            {selectedForm.additional_info}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* docs and imgs */}
                    <div className="w-full h-full flex flex-col  gap-y-5 mt-5 ">
                      <div className="h-[15rem] w-full">
                        <div className="w-full h-full gap-2  rounded-md border-1 border-gray-400 p-3  ">
                          <span className="text-xl font-bold">
                            Images of the Artifact
                          </span>
                          <div className="w-full h-[13em] ">
                            <div className="w-full h-full px-2">
                              {selectedForm.images && (
                                <div className="flex flex-wrap gap-3 py-3 overflow-x-auto h-full overflow-y-auto">
                                  {(() => {
                                    try {
                                      const imagePaths = JSON.parse(
                                        selectedForm.images
                                      )
                                      return imagePaths.map((imagePath, index) => (
                                        <div
                                          key={index}
                                          className="relative flex-shrink-0 group"
                                        >
                                          <img
                                            src={`/${imagePath}`}
                                            alt={`Artifact image ${index + 1}`}
                                            className="h-40 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                            onClick={() =>
                                              handleOpenPreview(`/${imagePath}`)
                                            }
                                            onError={(e) => {
                                              e.target.onerror = null
                                              e.target.src = '/placeholder-image.png'
                                            }}
                                          />
                                        
                                        </div>
                                      ))
                                    } catch (error) {
                                      console.error('Error parsing images:', error)
                                      return (
                                        <p className="text-red-500 py-4 text-center">
                                          Error loading images
                                        </p>
                                      )
                                    }
                                  })()}
                                </div>
                              )}
                              {(!selectedForm.images ||
                                JSON.parse(selectedForm.images).length === 0) && (
                                  <div className='w-full h-full flex items-center justify-center'>
                                <p className="text-gray-500 py-4 text-center">
                                  No images available
                                </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-auto p-5 rounded-md border-1 border-gray-400">
                      {/* <div className="w-full h-full gap-2 "> */}
                        <span className="text-2xl min-h-fit font-bold">
                          Documents about the artifact
                        </span>
                        
                        {/* Documents section */}
                        <div className="w-full h-[15em] flex flex-col gap-2 ">
                          <span className="text-xl">
                            Relevant documentation or research about the artifact.
                          </span>
                          {documentKeys.length > 0 ? (
                            <div className="border-t-1 p-3 border-gray-400 bg-gray-50 w-full h-full">
                              <DocumentView documentKeys={documentKeys} />
                            </div>
                          ) : (
                            <span className="text-xl text-[#FF0000]">
                              No documents available
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="h-[15rem] w-full">
                        <div className="w-full h-full   rounded-md border-1 border-gray-400 p-3  ">
                          <span className="text-xl min-h-fit font-bold">
                            Related Images of the Artifact
                          </span>
                          <div className="w-full  h-[13em] ">

                            <div className="w-full h-full px-4 py-2">
                              {selectedForm.related_images && (
                                <div className="flex flex-wrap gap-3 overflow-x-auto h-full overflow-y-auto">
                                  {(() => {
                                    try {
                                      const imagePaths = JSON.parse(
                                        selectedForm.related_images
                                      )
                                      return imagePaths.map((imagePath, index) => (
                                        <div
                                          key={index}
                                          className="relative flex-shrink-0 group"
                                        >
                                          <img
                                            src={`/${imagePath}`}
                                            alt={`Artifact image ${index + 1}`}
                                            className="h-40 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                            onClick={() =>
                                              handleOpenPreview(`/${imagePath}`)
                                            }
                                            onError={(e) => {
                                              e.target.onerror = null
                                              e.target.src = '/placeholder-image.png'
                                            }}
                                          />
                                        
                                        </div>
                                      ))
                                    } catch (error) {
                                      console.error('Error parsing images:', error)
                                      return (
                                        <p className="text-red-500 py-4 text-center">
                                          Error loading images
                                        </p>
                                      )
                                    }
                                  })()}
                                </div>
                              )}
                              {(!selectedForm.images ||
                                JSON.parse(selectedForm.images).length === 0) && (
                                  <div className='w-full h-full flex items-center justify-center'>
                                <p className="text-gray-500 py-4 text-center">
                                  No images available
                                </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Button (non-scrollable) */}
                <div className="flex justify-end px-6 py-4 ">
                  <button
                    onClick={() => setViewDetailsMode(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Back
                  </button>
                </div>
              </div>


          )}
        {/* </div> */}
      </div>

      {/* Confirmation Modals */}
      {confirmationModal.open && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setConfirmationModal({ action: '', open: false })}
        >
          <div
            className="bg-white rounded-md p-8 z-50 w-[40rem]   max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {confirmationModal.action === 'acquired'
                ? 'Confirm Delivery'
                : 'Confirm Failure to Deliver'}
            </h2>
           <p className="text-lg mb-4">
                  Are you sure you want to mark this artifact as{' '}
                  {confirmationModal.action === 'acquired' ? (
                    <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Delivered</span>
                  ) : (
                    <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Not Delivered</span>
                  )}
                  ?
                </p>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() =>
                  setConfirmationModal({ action: '', open: false })
                }
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() =>
                  handleDeliveryAction(
                    confirmationModal.action === 'acquired'
                      ? 'delivered'
                      : 'not_delivered'
                  )
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval/Rejection Confirmation Modal - kept for legacy purposes */}
      {isConfirmationOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setIsConfirmationOpen(false)}
        >
          <div
            className="bg-white rounded-md p-8 z-50 w-[30rem] max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {confirmationAction === 'approve'
                ? 'Do you want to approve this form?'
                : 'Do you want to decline this form?'}
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setIsConfirmationOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <ImagePreview
        isOpen={!!previewImage}
        onClose={handleClosePreview}
        imageSrc={previewImage}
      />
    </>
  )
}

export default AcquisitionModal
