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
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="flex gap-2">
                                        {/* Preview button */}
                                        <button
                                          onClick={() =>
                                            handleOpenPreview(`/${imagePath}`)
                                          }
                                          className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                                          title="Preview image"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path
                                              fillRule="evenodd"
                                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </button>

                                        {/* Download button */}
                                        <a
                                          href={`/${imagePath}`}
                                          download
                                          className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700"
                                          title="Download image"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
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
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="flex gap-2">
                                        {/* Preview button */}
                                        <button
                                          onClick={() =>
                                            handleOpenPreview(`/${imagePath}`)
                                          }
                                          className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                                          title="Preview image"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path
                                              fillRule="evenodd"
                                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </button>

                                        {/* Download button */}
                                        <a
                                          href={`/${imagePath}`}
                                          download
                                          className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700"
                                          title="Download image"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
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
                      className="bg-[#6F3FFF] hover:bg-[#4c3fff] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
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
                  <div className="flex justify-end">
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
        {/* </div> */}
      </div>

      {/* Confirmation Modals */}
      {confirmationModal.open && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setConfirmationModal({ action: '', open: false })}
        >
          <div
            className="bg-white rounded-md p-8 z-50 w-[30rem] max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {confirmationModal.action === 'acquired'
                ? 'Confirm Delivery'
                : 'Confirm Failure to Deliver'}
            </h2>
            <p className="text-lg mb-4">
              Are you sure you want to mark this artifact as{' '}
              {confirmationModal.action === 'acquired'
                ? 'Delivered'
                : 'Not Delivered'}
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
