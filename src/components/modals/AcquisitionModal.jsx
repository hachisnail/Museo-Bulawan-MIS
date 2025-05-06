// AcquisitionModal.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import DocumentView from './DocumentView';
import ImagePreview from './ImagePreview';

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
  const [previewImage, setPreviewImage] = useState(null);
  
  // Add state for email message and validation
  const [emailMessage, setEmailMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const messageRef = useRef(null);

  // Parsing document keys from the form
  const getDocumentKeys = (form) => {
    if (!form || !form.documents) return [];
    
    try {
      let docs = form.documents;
      
      // Handle string format (from database)
      if (typeof docs === 'string') {
        try {
          docs = JSON.parse(docs);
        } catch (e) {
          // If not valid JSON, it might be a comma-separated string
          return docs.split(',').filter(Boolean);
        }
      }
      
      // Handle array or object format
      if (Array.isArray(docs)) {
        return docs;
      } else if (typeof docs === 'object') {
        return [docs];
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing documents:', error);
      return [];
    }
  };

  // Only render if there's a selected form and the modal is open
  if (!isModalOpen || !selectedForm) return null;

  // Get form type, status, and transfer status for conditional rendering
  const formType = selectedForm.ContributionType?.accession_type || 'N/A';
  const status = selectedForm.ContributionType?.status || 'Pending';
  const transferStatus = selectedForm.ContributionType?.transfer_status || 'N/A';
  const documentKeys = getDocumentKeys(selectedForm);
  
  // Get formatted date
  const formattedDate = selectedForm.donation_date 
    ? new Date(selectedForm.donation_date).toLocaleDateString() 
    : 'N/A';

  // Handle open image preview
  const handleOpenPreview = (imagePath) => {
    setPreviewImage(imagePath);
  };

  // Handle close image preview
  const handleClosePreview = () => {
    setPreviewImage(null);
  };
  
  // Handle sending email and updating status
  const handleSendEmailAndUpdateStatus = async () => {
    // First validate that the message is not empty for pending forms
    if (!emailMessage.trim()) {
      setMessageError('Please enter a message to send with the email');
      messageRef.current?.focus();
      return;
    }

    setSendingEmail(true);
    setMessageError('');
    
    try {
      // Determine the status from the selected response
      const newStatus = selectedResponse === 'yes' ? 'accepted' : 'rejected';
      
      // Send the email and update the status in one API call
      const response = await axios.post(
        `http://localhost:5000/api/auth/form/${selectedForm.id}/send-status-email`,
        {
          status: newStatus,
          message: emailMessage
        }
      );
      
      if (response.data.success) {
        // Show an alert on success
        alert(`Email sent successfully to ${selectedForm.Donator?.email}`);
        // Close the modal only after successful email sending
        handleCloseModal();
      } else {
        setMessageError('Failed to send email: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setMessageError(error.response?.data?.message || 'Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Custom close handler to prevent closing if no message is provided
  const handleCustomCloseModal = () => {
    // If status is pending and a response is selected, check for message
    if (status === 'Pending' && selectedResponse && !emailMessage.trim()) {
      setMessageError('Please enter a message before closing');
      messageRef.current?.focus();
      return;
    }
    
    // Otherwise, allow closing
    handleCloseModal();
  };

  return (
    <>
      {/* Main Form Modal */}
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="fixed bg-white rounded-md px-8 py-1 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[80rem] max-h-[60rem]">
          {/* Modal Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-50 px-8 py-4 shadow-sm shadow-gray-500">
            <div className="grid grid-cols-12 justify-between items-center mb-4">
              <div className="col-span-9 text-3xl font-bold flex items-center gap-4">
                <span>{formType} Form</span>
                
                {/* Status Badge */}
                <span className={`text-sm px-3 py-1 rounded-full ${
                  status === 'Accepted' ? 'bg-green-500 text-white' : 
                  status === 'Rejected' ? 'bg-red-500 text-white' : 
                  'bg-yellow-400 text-black'
                }`}>
                  Status: {status}
                </span>
                
                {/* Transfer Status Badge */}
                {status !== 'Pending' && (
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    transferStatus === 'Acquired' ? 'bg-blue-500 text-white' : 
                    transferStatus === 'Failed' ? 'bg-orange-500 text-white' : 
                    'bg-purple-400 text-white'
                  }`}>
                    Transfer: {transferStatus}
                  </span>
                )}
              </div>
              
              <div className="col-span-2 flex justify-center">
                <span className="text-xl font-semibold">{formattedDate}</span>
              </div>
              
              <div className="col-span-1 flex items-end justify-end">
                <button
                  className="text-xl font-bold p-2 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={handleCustomCloseModal} // Use custom close handler instead
                >
                  X
                </button>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="mt-20 max-h-[50rem] overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {/* Personal Information Section */}
              <div className="w-full h-auto p-5 rounded-lg flex flex-col gap-4">
                <div className="w-full h-auto flex flex-col gap-5 px-12 border-t-2 border-gray-300">
                  <span className="text-3xl font-semibold pt-6">Information</span>
                  <div className="w-full h-auto flex flex-col items-start gap-6 mt-5">
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-5xl font-bold">{selectedForm.Donator?.name}</span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Email</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.Donator?.email || 'N/A'}</span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Phone Number</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.Donator?.phone}</span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Address</span>
                      <span className="text-xl text-[#4E84D4]">
                        {selectedForm.Donator?.province} {selectedForm.Donator?.City}{' '}
                        {selectedForm.Donator?.Barangay} {selectedForm.Donator?.Street || ''}
                      </span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Organization</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.Donator?.organization}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lending Details Section */}
              {formType === 'Lending' && (
                <div className="w-full h-auto flex flex-col gap-5 pt-6 px-12 border-t-2 border-gray-300">
                  <span className="text-3xl font-semibold">Reason For Lending</span>
                  <div className="w-full h-auto flex flex-col items-start gap-6 mt-5">
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Proposed duration of the loan.</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.ContributionType?.duration_period || 'N/A'}</span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Specific conditions or requirements for handling of the artifact.</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.ContributionType?.condition || 'N/A'}</span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Specific liability concerns or requirements regarding the artifact.</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.ContributionType?.remarks || 'N/A'}</span>
                    </div>
                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Reason for lending.</span>
                      <span className="text-xl text-[#4E84D4]">{selectedForm.ContributionType?.reason || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Artifact Information Section */}
              <div className="w-full h-auto flex flex-col gap-5 px-12 border-t-2 border-gray-300">
                <span className="text-3xl font-semibold pt-6">About the Artifact</span>
                <div className="w-full h-auto flex flex-col items-start gap-6 mt-6">
                  <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Title/Name of the Artifact</span>
                    <span className="text-xl text-[#4E84D4]">{selectedForm.artifact_name}</span>
                  </div>
                  <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Artifact Description</span>
                    <span className="text-xl text-[#4E84D4]">{selectedForm.artifact_description}</span>
                  </div>
                  <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">How and where the artifact is acquired</span>
                    <span className="text-xl text-[#4E84D4]">{selectedForm.acquired}</span>
                  </div>
                  <div className="w-full h-auto flex flex-col">
                    <span className="text-2xl">Additional Information</span>
                    <span className="text-xl text-[#4E84D4]">{selectedForm.additional_info}</span>
                  </div>
                  
                  {/* Images with preview and download options */}
                  <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Image/s of the artifact.</span>
                    <div className="w-full min-h-32 px-4 py-2 border-2 border-gray-400">
                      {selectedForm.images && (
                        <div className="flex flex-wrap gap-3 py-3 overflow-x-auto max-h-80 overflow-y-auto">
                          {(() => {
                            try {
                              const imagePaths = JSON.parse(selectedForm.images);
                              return imagePaths.map((imagePath, index) => (
                                <div key={index} className="relative flex-shrink-0 group">
                                  <img
                                    src={`/${imagePath}`}
                                    alt={`Artifact image ${index + 1}`}
                                    className="h-52 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                    onClick={() => handleOpenPreview(`/${imagePath}`)}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-image.png';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                      {/* Preview button */}
                                      <button 
                                        onClick={() => handleOpenPreview(`/${imagePath}`)}
                                        className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                                        title="Preview image"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ));
                            } catch (error) {
                              console.error("Error parsing images:", error);
                              return <p className="text-red-500 py-4 text-center">Error loading images</p>;
                            }
                          })()}
                        </div>
                      )}
                      {(!selectedForm.images || JSON.parse(selectedForm.images).length === 0) && (
                        <p className="text-gray-500 py-4 text-center">No images available</p>
                      )}
                    </div>
                  </div>

                  {/* Documents section */}
                  <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Relevant documentation or research about the artifact.</span>
                    {documentKeys.length > 0 ? (
                      <div className="border rounded-md p-3 bg-gray-50 w-full">
                        <DocumentView documentKeys={documentKeys} />
                      </div>
                    ) : (
                      <span className="text-xl text-[#FF0000]">No documents available</span>
                    )}
                  </div>

                  {/* Related images with preview and download options */}
                  <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Related image/s about the artifact.</span>
                    <div className="w-full min-h-32 px-4 py-2 border-2 border-gray-400">
                      {selectedForm.related_images && (
                        <div className="flex flex-wrap gap-3 py-3 overflow-x-auto max-h-80 overflow-y-auto">
                          {(() => {
                            try {
                              const imagePaths = JSON.parse(selectedForm.related_images);
                              return imagePaths.map((imagePath, index) => (
                                <div key={index} className="relative flex-shrink-0 group">
                                  <img
                                    src={`/${imagePath}`}
                                    alt={`Related image ${index + 1}`}
                                    className="h-52 w-auto object-contain border border-gray-200 rounded shadow-sm cursor-pointer hover:opacity-90"
                                    onClick={() => handleOpenPreview(`/${imagePath}`)}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-image.png';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                      {/* Preview button */}
                                      <button 
                                        onClick={() => handleOpenPreview(`/${imagePath}`)}
                                        className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                                        title="Preview image"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ));
                            } catch (error) {
                              console.error("Error parsing related images:", error);
                              return <p className="text-red-500 py-4 text-center">Error loading related images</p>;
                            }
                          })()}
                        </div>
                      )}
                      {(!selectedForm.related_images || JSON.parse(selectedForm.related_images).length === 0) && (
                        <p className="text-gray-500 py-4 text-center">No related images available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Section - This changes based on status */}
              {status === 'Pending' ? (
                /* Pending Status - Show approval options with updated email functionality */
                <div className="w-full h-auto border-t-2 border-gray-300 mt-6 pt-6">
                  <div className="w-full h-auto p-5 flex flex-col gap-4">
                    <span className="text-4xl font-semibold">Respond</span>
                    <div className="w-full h-auto pt-6">
                      <span className="text-3xl">Approve?</span>
                      <div className="flex justify-start mt-6 gap-x-5 px-12">
                        <button
                          className={`border-1 border-black rounded-lg text-black px-4 py-2 w-[10em] cursor-pointer ${
                            selectedResponse === 'yes' ? 'bg-[#6F3FFF]' : 'bg-[#DFDFDF] hover:bg-[#6F3FFF]'
                          }`}
                          onClick={handleApprove}
                        >
                          <span className="text-xl font-semibold">Yes</span>
                        </button>
                        <button
                          className={`border-1 border-black rounded-lg text-black px-4 py-2 w-[10em] cursor-pointer ${
                            selectedResponse === 'no' ? 'bg-[#6F3FFF]' : 'bg-[#DFDFDF] hover:bg-[#6F3FFF]'
                          }`}
                          onClick={handleDecline}
                        >
                          <span className="text-xl font-semibold">No</span>
                        </button>
                      </div>
                    </div>

                    {/* Updated Message Section with validation */}
                    <div className="w-full h-auto pt-8">
                      <div className="w-full h-auto flex flex-col gap-y-6">
                        <span className="text-3xl">Leave a message <span className="text-red-500">*</span></span>
                        <div className="px-12">
                          <textarea
                            ref={messageRef}
                            className={`w-full h-32 border ${messageError ? 'border-red-500' : 'border-black'} rounded-md p-6`}
                            placeholder="Type your message here..."
                            style={{ fontSize: '1.25rem' }}
                            value={emailMessage}
                            onChange={(e) => {
                              setEmailMessage(e.target.value);
                              if (e.target.value.trim()) {
                                setMessageError('');
                              }
                            }}
                          />
                          {messageError && (
                            <p className="text-red-500 mt-1">{messageError}</p>
                          )}
                        </div>
                      </div>
                      <div className="w-auto h-auto mt-4">
                        <span className="text-2xl font-semibold">This will automatically send to </span>
                        <span className="text-2xl font-semibold text-[#370BFF]">
                          {selectedForm.Donator?.email || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Updated Done button that sends email */}
                    <div className="w-full flex justify-end mt-6">
                      <button
                        onClick={handleSendEmailAndUpdateStatus}
                        disabled={sendingEmail || !selectedResponse}
                        className={`rounded-lg text-white px-4 py-2 w-[10em] ${
                          sendingEmail || !selectedResponse
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#6F3FFF] hover:bg-[#4c3fff] cursor-pointer'
                        }`}
                      >
                        <span className="text-xl font-semibold">
                          {sendingEmail ? 'Sending...' : 'Done'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : status === 'Accepted' && transferStatus === 'On Progress' ? (
                /* Accepted & On Progress - Show delivery options */
                <div className="w-full h-auto border-t-2 border-gray-300 mt-6 pt-6">
                  <div className="w-full h-auto p-5 flex flex-col gap-4">
                    <span className="text-4xl font-semibold">Update Transfer Status</span>
                    <div className="w-full h-auto pt-6">
                      <span className="text-3xl">Was the artifact delivered?</span>
                      <div className="flex justify-start mt-6 gap-x-5 px-12">
                        <button
                          className="bg-green-600 text-white px-4 py-2 w-[12em] rounded-lg cursor-pointer hover:bg-green-700"
                          onClick={() => setConfirmationModal({ action: 'acquired', open: true })}
                        >
                          <span className="text-xl font-semibold">Yes, Delivered</span>
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 w-[12em] rounded-lg cursor-pointer hover:bg-red-700"
                          onClick={() => setConfirmationModal({ action: 'failed', open: true })}
                        >
                          <span className="text-xl font-semibold">No, Failed</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full flex justify-end mt-10">
                      <button
                        onClick={handleCloseModal}
                        className="bg-[#6F3FFF] rounded-lg text-white px-4 py-2 cursor-pointer hover:bg-[#4c3fff] w-[10em]"
                      >
                        <span className="text-xl font-semibold">Close</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Completed or Failed Status - Show final status */
                <div className="w-full h-auto border-t-2 border-gray-300 mt-6 pt-6">
                  <div className="w-full h-auto p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-semibold">Transfer Status</span>
                      <span className={`text-xl font-bold px-4 py-2 rounded-lg ${
                        transferStatus === 'Acquired' ? 'bg-green-100 text-green-700' : 
                        transferStatus === 'Failed' ? 'bg-red-100 text-red-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {transferStatus}
                      </span>
                    </div>
                    
                    <p className="text-xl mt-4 px-4">
                      This form's processing has been completed. No further actions are available.
                    </p>
                    
                    <div className="w-full flex justify-end mt-10">
                      <button
                        onClick={handleCloseModal}
                        className="bg-[#6F3FFF] rounded-lg text-white px-4 py-2 cursor-pointer hover:bg-[#4c3fff] w-[10em]"
                      >
                        <span className="text-xl font-semibold">Close</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
              {confirmationModal.action === 'acquired' ? 'Confirm Delivery' : 'Confirm Failure to Deliver'}
            </h2>
            <p className="text-lg mb-4">
              Are you sure you want to mark this artifact as{' '}
              {confirmationModal.action === 'acquired' ? 'Delivered' : 'Not Delivered'}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setConfirmationModal({ action: '', open: false })}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() =>
                  handleDeliveryAction(
                    confirmationModal.action === 'acquired' ? 'delivered' : 'not_delivered'
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
              {confirmationAction === 'approve' ? 'Do you want to approve this form?' : 'Do you want to decline this form?'}
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
  );
};

export default AcquisitionModal;
