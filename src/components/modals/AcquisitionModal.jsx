// AcquisitionModal.jsx
import React from 'react';
import DocumentView from './DocumentView'; // Import from the same directory

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
                  onClick={handleCloseModal}
                >
                  X
                </button>
              </div>
            </div>
          </div>

          {/* Modal Content - Always the same regardless of status */}
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
                  
                  {/* Image placeholder */}
                  <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Image/s of the artifact.</span>
                    <div className="w-full h-100 px-4 border-2 border-gray-400"></div>
                  </div>

                  {/* Documents section with DocumentView component */}
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

                  {/* Related images placeholder */}
                  <div className="w-full h-auto flex flex-col gap-2">
                    <span className="text-2xl">Related image/s about the artifact.</span>
                    <div className="w-full h-100 px-4 border-2 border-gray-400"></div>
                  </div>
                </div>
              </div>

              {/* Response Section - This changes based on status */}
              {status === 'Pending' ? (
                /* Pending Status - Show approval options */
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

                    {/* Message Section */}
                    <div className="w-full h-auto pt-8">
                      <div className="w-full h-auto flex flex-col gap-y-6">
                        <span className="text-3xl">Leave a message</span>
                        <div className="px-12">
                          <textarea
                            className="w-full h-32 border border-black rounded-md p-6 text-2xl"
                            placeholder="Type your message here..."
                            style={{ fontSize: '1.25rem' }}
                          />
                        </div>
                      </div>
                      <div className="w-auto h-auto mt-4">
                        <span className="text-2xl font-semibold">This will automatically send to </span>
                        <span className="text-2xl font-semibold text-[#370BFF]">
                          {selectedForm.Donator?.email || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full flex justify-end mt-6">
                      <button
                        onClick={handleCloseModal}
                        className="bg-[#6F3FFF] rounded-lg text-white px-4 py-2 cursor-pointer hover:bg-[#4c3fff] w-[10em]"
                      >
                        <span className="text-xl font-semibold">Done</span>
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

      {/* Confirmation Modals - Keep these as they are */}
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

      {/* Approval/Rejection Confirmation Modal */}
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

      {/* Donation Modal */}
      
    </>
  );
};

export default AcquisitionModal;
