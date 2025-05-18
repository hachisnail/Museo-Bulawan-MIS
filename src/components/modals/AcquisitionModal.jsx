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
      const newStatus = selectedResponse === 'yes' ? 'Accepted' : 'Rejected';
      
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
      <div className="  font-semibold flex flex-col overflow-y-hidden">
        <span className="text-5xl">Donation and Lending Management</span>
        <div className="text-2xl flex items-center text-center">
          <span
            onClick={handleCloseModal}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            Acquisition{' '}
          </span>
          <span className='text-2xl font-extrabold text-amber-900'>&nbsp; &gt; &nbsp;</span>
          <span> View </span>
        </div>


      </div>
      
      <div className='w-full h-full flex flex-col '>
      
        <div className="w-full text-4xl font-bold flex items-center justify-between  h-auto py-3">
          <div className='w-auto flex items-center gap-6'>
              <div>
                 <span>{formType} Form</span>
                 
                 </div>
                
                {/* Status Badge */}
                <span className={`text-lg px-4 py-2 rounded-full ${
                  status === 'Accepted' ? 'bg-green-500 text-white' : 
                  status === 'Rejected' ? 'bg-red-500 text-white' : 
                  'bg-yellow-400 text-black'
                }`}>
                  Status: {status}
                </span> 
                
                {/* Transfer Status Badge */}
                {status !== 'Pending' && (
                  <span className={`text-lg px-4 py-2 rounded-full ${
                    transferStatus === 'Acquired' ? 'bg-blue-500 text-white' : 
                    transferStatus === 'Failed' ? 'bg-orange-500 text-white' : 
                    'bg-purple-400 text-white'
                  }`}>
                    Transfer: {transferStatus}
                  </span>
                )} 
          </div>
          <div className='w-auto flex items-center gap-6'>

                <div className="flex justify-center h-full items-center">
                  <span className="text-xl font-semibold">{formattedDate}</span>
                </div>
                  <button
                  className="text-xl font-bold p-2 rounded-full hover:bg-gray-300 transition-colors place-self-end"
                  onClick={handleCustomCloseModal} // Use custom close handler instead
                >
                  X
                </button>
          </div>
              
              </div>
              
              <div className=' w-full h-full  px-5 bg-white flex '>
                  <div className='w-3/5 h-full flex flex-col'>
                    <div className='w-full h-1/2 flex'>
                         {formType === 'Lending' ? (
                      <>
                        <div className='w-1/3 h-full border-r border-black '>
                          <div className='w-full h-full flex flex-col gap-3 p-2'>

                            <span className='text-3xl font-semibold'>Information:</span>
                            <span className="text-5xl font-bold px-2"> {selectedForm.Donator?.name}</span>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl ">Email:</span>
                                  <span className="text-xl text-[#4E84D4] ">{selectedForm.Donator?.email || 'N/A'}</span>
                            </div>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl ">Phone Number:</span>
                                  <span className="text-xl text-[#4E84D4] ">{selectedForm.Donator?.phone}</span>
                            </div>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl ">Address:</span>
                                  <span className="text-xl text-[#4E84D4]">
                                    {selectedForm.Donator?.province} {selectedForm.Donator?.City}{' '}
                                    {selectedForm.Donator?.Barangay} {selectedForm.Donator?.Street || ''}
                                  </span>
                            </div>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl">Organization</span>
                                  <span className="text-xl text-[#4E84D4]">{selectedForm.Donator?.organization}</span>
                            </div>
                          </div>
                          
                        
                        </div>
                        <div className='w-1/3 h-full border-r border-black '>
                          {/* About content here */}
                          <div className='w-full h-full flex flex-col gap-3 p-2'>
                            <span className='text-3xl font-semibold'>About the artifact:</span>
                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Title/Name of the Artifact:</span>
                              <span className="text-xl text-[#4E84D4] px-2">{selectedForm.artifact_name}</span>
                            </div>

                             <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Artifact Description:</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.description}</span>
                            </div>

                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">How and where the artifact is acquired:</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.acquired}</span>
                            </div>

                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Additional Information:</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.additional_info}</span>
                            </div>
                          </div>
                        </div>


                        <div className='w-1/3 h-full border-r border-black '>
                          {/* Lending content here */}
                           <div className='w-full h-full flex flex-col gap-3 p-2'>
                            <span className='text-3xl font-semibold'>Reason for lending:</span>
                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Proposed duration of the loan.</span>
                              <span className="text-xl text-[#4E84D4] px-2">{selectedForm.ContributionType?.duration_period || 'N/A'}</span>
                            </div>

                             <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Specific conditions or requirements for handling of the artifact.</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.ContributionType?.condition || 'N/A'}</span>
                            </div>

                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Specific liability concerns or requirements regarding the artifact.</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.ContributionType?.remarks || 'N/A'}</span>
                            </div>

                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Reason for lending.</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.ContributionType?.reason || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='w-1/2 h-full border-r border-black'>
                          <div className='w-full h-full flex flex-col gap-3 p-2'>

                            <span className='text-3xl font-semibold'>Information:</span>
                            <span className="text-5xl font-bold px-2"> {selectedForm.Donator?.name}</span>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl ">Email:</span>
                                  <span className="text-xl text-[#4E84D4] ">{selectedForm.Donator?.email || 'N/A'}</span>
                            </div>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl ">Phone Number:</span>
                                  <span className="text-xl text-[#4E84D4] ">{selectedForm.Donator?.phone}</span>
                            </div>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl ">Address:</span>
                                  <span className="text-xl text-[#4E84D4]">
                                    {selectedForm.Donator?.province} {selectedForm.Donator?.City}{' '}
                                    {selectedForm.Donator?.Barangay} {selectedForm.Donator?.Street || ''}
                                  </span>
                            </div>
                            <div className="w-full h-auto flex justify-between px-12">
                                  <span className="text-2xl">Organization</span>
                                  <span className="text-xl text-[#4E84D4]">{selectedForm.Donator?.organization}</span>
                            </div>
                          </div>
                        </div>
                         <div className='w-1/2 h-full border-r border-black '>
                          {/* About content here */}
                          <div className='w-full h-full flex flex-col gap-3 p-2'>
                            <span className='text-3xl font-semibold'>About the artifact:</span>
                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Title/Name of the Artifact:</span>
                              <span className="text-xl text-[#4E84D4] px-2">{selectedForm.artifact_name}</span>
                            </div>

                             <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Artifact Description:</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.description}</span>
                            </div>

                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">How and where the artifact is acquired:</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.acquired}</span>
                            </div>

                            <div className="w-full h-auto flex flex-col px-6">
                              <span className="text-2xl">Additional Information:</span>
                              <span className="text-xl text-[#4E84D4] px-2 break-words">{selectedForm.additional_info}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    </div>

                   <div className='w-full h-1/2'>
                        <div className='w-full h-full flex gap-4'>
                            <div className='w-1/3 h-full py-2'>
                              <div className='w-full h-full gap-2  pb-12'>
                                  <span className='text-3xl font-bold'>Images of the Artifact</span>
                                  <div className='w-full h-full border border-amber-300'>
                                      <div className="w-full h-full px-4 py-2 border-2 border-gray-400">
                      {selectedForm.images && (
                        <div className="flex flex-wrap gap-3 py-3 overflow-x-auto h-full overflow-y-auto">
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
                              </div>
                            </div>
                            <div className='w-1/3 h-full py-2'>
                              <div className='w-full h-full gap-2 pb-12'>
                                  <span className='text-3xl font-bold'>Related Images of the Artifact</span>
                                  <div className='w-full h-full border border-amber-300'>

                                  </div>
                              </div>
                            </div>
                            <div className='w-1/3 h-full py-2'>
                              <div className='w-full h-full gap-2 pb-12'>
                                <span className='text-3xl font-bold'>Documents about the artifact</span>
                              </div>
                            </div>
                        </div>
                    </div>
                  </div>
                   <div className='w-2/5'>
                      Respond
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
