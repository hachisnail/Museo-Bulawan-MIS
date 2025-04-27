// AcquisitionModal.jsx
import React from 'react';
import SelectedDonatorModal from '../../components/modals/SelectedDonatorModal';

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
  // Helper function to render status badge with consistent styling
  const renderStatusBadge = (status) => {
    if (!status) return null;
    return (
      <span className="font-semibold text-[#4E84D4]">{status}</span>
    );
  };

  return (
    <>
      {/* Pending Form Modal */}
      {isModalOpen && selectedForm && selectedForm.ContributionType.status === 'Pending' && (
        <>
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" onClick={handleCloseModal} />
          <div
            className="fixed bg-white rounded-md px-8 py-1 z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[80rem] max-h-[60rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="fixed top-0 left-0 right-0 bg-white z-50 px-8 py-4 shadow-sm shadow-gray-500">
              <div className="grid grid-cols-12 justify-between items-center mb-4">
                <div className="col-span-10 text-3xl font-bold">
                  <span>{selectedForm.ContributionType?.accession_type || 'N/A'} Form</span>
                </div>
                <div className="col-span-1 flex justify-center">
                  <span className="text-xl font-semibold">
                    {selectedForm.donation_date
                      ? new Date(selectedForm.donation_date).toLocaleDateString()
                      : 'N/A'}
                  </span>
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
                {selectedForm.ContributionType?.accession_type === 'Lending' && (
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

                    <div className="w-full h-auto flex flex-col">
                      <span className="text-2xl">Relevant documentation or research about the artifact.</span>
                      <span className="text-xl text-[#FF0000]">{selectedForm.documents || 'N/A'}</span>
                    </div>

                    {/* Related images placeholder */}
                    <div className="w-full h-auto flex flex-col gap-2">
                      <span className="text-2xl">Related image/s about the artifact.</span>
                      <div className="w-full h-100 px-4 border-2 border-gray-400"></div>
                    </div>
                  </div>
                </div>

                {/* Respond Section */}
                <div className="w-full h-auto p-5 flex flex-col gap-4 mt-8">
                  <span className="text-4xl font-semibold">Respond</span>
                  <div className="w-full h-auto pt-8">
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
                </div>

                {/* Message Section */}
                <div className="w-full h-auto">
                  <div className="w-full h-auto pt-6 flex flex-col gap-y-6">
                    <span className="text-3xl">Leave a message</span>
                    <div className="px-12">
                      <textarea
                        className="w-full h-32 border border-black rounded-md p-6 text-2xl"
                        placeholder="Type your message here..."
                        style={{ fontSize: '1.25rem' }}
                      />
                    </div>
                  </div>
                  <div className="w-auto h-auto mt-2">
                    <span className="text-2xl font-semibold">This will automatically send to </span>
                    <span className="text-2xl font-semibold text-[#370BFF]">
                      {selectedForm.Donator?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="w-full flex justify-end">
                    <button
                      onClick={handleCloseModal}
                      className="bg-[#6F3FFF] rounded-lg text-white px-4 py-2 cursor-pointer hover:bg-[#4c3fff] w-[10em] mt-2"
                    >
                      <span className="text-xl font-semibold">Done</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* On Progress Status Modal */}
      {isModalOpen && selectedForm && selectedForm.ContributionType.status !== 'Pending' && selectedForm.ContributionType.transfer_status === 'On Progress' && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[40em] h-auto max-h-[30em] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#6F3FFF]">Transfer Status</h2>
            <p className="text-lg mb-4">
              The current transfer status of this form is: 
              <span className="font-semibold text-[#4E84D4]">
                {selectedForm.ContributionType.transfer_status || 'N/A'}
              </span>
            </p>
            <h3 className="text-xl font-semibold mb-2">Was the artifact delivered?</h3>
            <div className="flex gap-4 mb-4">
              <button
                className="bg-[#6F3FFF] text-white px-4 py-2 rounded-md hover:bg-[#4c3fff] transition-colors"
                onClick={() => setConfirmationModal({ action: 'acquired', open: true })}
              >
                Delivered
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setConfirmationModal({ action: 'failed', open: true })}
              >
                Not Delivered
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#6F3FFF] text-white px-4 py-2 rounded-md hover:bg-[#4c3fff] transition-colors"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed or Failed Status Modal */}
      {isModalOpen && selectedForm && selectedForm.ContributionType.status !== 'Pending' && selectedForm.ContributionType.transfer_status !== 'On Progress' && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[40em] h-auto max-h-[30em] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#6F3FFF]">Transfer Status</h2>
            <p className="text-lg mb-4">
              This form's Transfer Status is {selectedForm.ContributionType.transfer_status || 'N/A'}. No further actions are available.
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#6F3FFF] text-white px-4 py-2 rounded-md hover:bg-[#4c3fff] transition-colors"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Confirmation Modal */}
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
      <SelectedDonatorModal
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
        selectedDonationForm={selectedDonationForm}
      />
    </>
  );
};

export default AcquisitionModal;
