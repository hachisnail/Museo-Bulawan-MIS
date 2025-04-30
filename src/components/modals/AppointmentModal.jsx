import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import for axios
export const AppointmentModal = ({
  showModal,
  modalData,
  onClose,
  onSend,
  updateAppointmentStatus,
  showRespondSection = true // New prop with default true for backward compatibility
}) => {
  // Local state to track user's selection
  const [approveVisit, setApproveVisit] = useState('');
  // Track the message content
  const [message, setMessage] = useState("");
  // Track if message is empty
  const [messageError, setMessageError] = useState(false);
  // Track if approval selection is made
  const [approvalError, setApprovalError] = useState(false);
  // Attendance present count
  const [presentCount, setPresentCount] = useState('');
  // Track if present count needs validation
  const [presentCountError, setPresentCountError] = useState(false);

  // Loading indicator while sending email / updating status
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token')
  const API_URL = import.meta.env.VITE_API_URL;

  // Reset approval state and error state when modal data changes
  useEffect(() => {
    if (modalData && modalData.status) {
      if (modalData.status === 'CONFIRMED' || modalData.status === 'Confirmed') {
        setApproveVisit('yes');
      } else if (modalData.status === 'REJECTED' || modalData.status === 'Rejected') {
        setApproveVisit('no');
      } else if (modalData.status === 'COMPLETED' || modalData.status === 'Completed') {
        setApproveVisit('arrive');
      } else if (modalData.status === 'FAILED' || modalData.status === 'Failed') {
        setApproveVisit('cancel');
      } else {
        setApproveVisit('');
      }
    } else {
      setApproveVisit('');
    }
    setMessageError(false);
    setApprovalError(false);
    setPresentCountError(false);
    setMessage("");
    setPresentCount('');
    setIsLoading(false);
  }, [modalData]);

  if (!showModal || !modalData) return null;

  // Determine the current phase of the appointment process
  const isToReview = modalData.status === 'TO_REVIEW' || modalData.status === 'To Review';
  const isConfirmed = modalData.status === 'CONFIRMED' || modalData.status === 'Confirmed';
  const isRejected = modalData.status === 'REJECTED' || modalData.status === 'Rejected';
  const isFailed = modalData.status === 'FAILED' || modalData.status === 'Failed';
  const isCompleted = modalData.status === 'COMPLETED' || modalData.status === 'Completed';

  const isCompletedOrFailed = isCompleted || isFailed;

  const handleSend = async () => {
    // Start loading
    setIsLoading(true);

    try {
      // Phase 1 (TO_REVIEW): Make sure user has approved or rejected, and left a non-empty message
      if (isToReview) {
        if (!approveVisit) {
          setApprovalError(true);
          setIsLoading(false);
          return;
        }
        if (!message.trim()) {
          setMessageError(true);
          setIsLoading(false);
          return;
        }
      }

      // Validate present count only if "arrive" is chosen in second phase
      if (isConfirmed && approveVisit === 'arrive') {
        if (!presentCount) {
          setPresentCountError(true);
          setIsLoading(false);
          return;
        }
      }

      // Determine the new status based on action
      let newStatus = modalData.status;
      if (approveVisit === 'yes') {
        newStatus = 'CONFIRMED';
      } else if (approveVisit === 'no') {
        newStatus = 'REJECTED';
      } else if (approveVisit === 'cancel') {
        newStatus = 'FAILED';
      } else if (approveVisit === 'arrive') {
        newStatus = 'COMPLETED';
      }

      // Prepare email data
      const emailData = {
        recipientEmail: modalData.email
          ? `${modalData.email},michael18ricafrente@gmail.com`
          : 'michael18ricafrente@gmail.com',
        subject: `Appointment ${newStatus.toLowerCase()} - Museo Bulawan`,
        message: message,
        status: newStatus,
        appointmentDetails: {
          visitorName: `${modalData.fromFirstName} ${modalData.fromLastName}`,
          preferredDate: modalData.preferredDate,
          preferredTime: modalData.preferredTime,
          purpose: modalData.purpose
        }
      };

      // Attempt to send the email notification
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/send-email-notification`,
          emailData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Email notification sent:', response.data);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Even if email fails, proceed with status update
      }

      // If user arrived, update with presentCount
      if (approveVisit === 'arrive') {
        const presentValue = parseInt(presentCount, 10) || 0;
        await updateAppointmentStatus(modalData.appointmentId, newStatus, presentValue);
      } else {
        // Otherwise, only update status
        await updateAppointmentStatus(modalData.appointmentId, newStatus);
      }

      // Trigger parent component's success callback, close modal
      onSend && onSend();
    } catch (err) {
      console.error('Error while updating status or sending email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllPresent = () => {
    setPresentCount(modalData.populationCount || '0');
    setPresentCountError(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-md shadow-lg p-8 w-[700px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with visitor name and date */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {modalData.fromFirstName} {modalData.fromLastName}
          </h2>
          <div className="text-right">
            {modalData.dateSent || "02-19-2024"}
          </div>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Two column layout for details */}
        <div className="grid grid-cols-2 gap-10">
          {/* Left column */}
          <div>
            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Email</div>
              <div className="text-blue-500 text-lg">{modalData.email}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Phone Number</div>
              <div className="text-blue-500 text-lg">{modalData.phone}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Address</div>
              <div className="text-blue-500 text-lg">
                {modalData.street}, {modalData.barangay}, {modalData.city_municipality},{' '}
                {modalData.province}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Organization</div>
              <div className="text-blue-500 text-lg">{modalData.organization}</div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Purpose of Visit</div>
              <div className="text-blue-500 text-lg">{modalData.purpose}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Population Count</div>
              <div className="text-blue-500 text-lg">{modalData.populationCount}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Preferred Date</div>
              <div className="text-blue-500 text-lg">{modalData.preferredDate}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Preferred Time</div>
              <div className="text-blue-500 text-lg">{modalData.preferredTime}</div>
            </div>
          </div>
        </div>

        {/* Notes section */}
        <div className="mb-6">
          <div className="text-gray-600 text-sm mb-1">Notes</div>
          <div className="text-blue-500 text-lg">{modalData.notes}</div>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Response section - conditionally rendered based on appointment phase AND showRespondSection */}
        {showRespondSection && (
          <div>
            <h3 className="text-xl font-bold mb-6">Respond</h3>

            {/* FIRST PHASE: TO_REVIEW - Show Yes/No approval options */}
            {isToReview && (
              <>
                <div className="mb-6">
                  <div className="text-base mb-3">Approve Visit?</div>
                  <div className="flex gap-4">
                    <button
                      className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'yes'
                          ? 'bg-[#6F3FFF] text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                      onClick={() => {
                        setApproveVisit('yes');
                        setApprovalError(false);
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'no'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                      onClick={() => {
                        setApproveVisit('no');
                        setApprovalError(false);
                      }}
                    >
                      No
                    </button>
                  </div>
                  {approvalError && (
                    <p className="text-sm text-red-500 mt-2">
                      Please select Yes or No before continuing.
                    </p>
                  )}
                </div>

                {/* Message area - mandatory for first phase */}
                <div className="mb-6">
                  <div className="text-base mb-3">Leave a message</div>
                  <textarea
                    className={`w-full p-4 border ${messageError ? 'border-red-500' : 'border-gray-300'
                      } rounded-md h-[120px] overflow-y-auto resize-none text-base`}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (e.target.value.trim()) {
                        setMessageError(false);
                      }
                    }}
                    placeholder="Enter message here (required)"
                  />
                  {messageError && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a message for the visitor.
                    </p>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    This will automatically send to{' '}
                    {modalData.email || 'michael18ricafrente@gmail.com'}
                  </div>
                </div>
              </>
            )}

            {/* SECOND PHASE: CONFIRMED - Show Cancel/Arrive options */}
            {isConfirmed && (
              <>
                <div className="mb-6">
                  <div className="text-base mb-3">Appointment Action</div>
                  <div className="flex gap-4">
                    <button
                      className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'cancel'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                      onClick={() => setApproveVisit('cancel')}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'arrive'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                      onClick={() => setApproveVisit('arrive')}
                    >
                      Arrive
                    </button>
                  </div>
                </div>

                {/* Add message field when canceling */}
                {approveVisit === 'cancel' && (
                  <div className="mb-6">
                    <div className="text-base mb-3">Cancellation Message</div>
                    <textarea
                      className={`w-full p-4 border ${messageError ? 'border-red-500' : 'border-gray-300'
                        } rounded-md h-[120px] overflow-y-auto resize-none text-base`}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (e.target.value.trim()) {
                          setMessageError(false);
                        }
                      }}
                      placeholder="Enter cancellation reason (optional)"
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      This will automatically send to{' '}
                      {modalData.email || 'michael18ricafrente@gmail.com'}
                    </div>
                  </div>
                )}

                {/* Attendance Section - Only shown when status is confirmed and arrive is selected */}
                {approveVisit === 'arrive' && (
                  <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-xl font-bold mb-4">Attendance Details</h4>

                    <div className="grid grid-cols-2 gap-x-6 mb-4">
                      <div>
                        <div className="text-gray-600 mb-2">Expected Visitors:</div>
                        <div className="text-2xl font-semibold">
                          {modalData.populationCount || '0'}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-600 mb-2">Present:</div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            className={`border ${presentCountError ? 'border-red-500' : 'border-gray-300'
                              } rounded-md p-3 w-full text-lg`}
                            value={presentCount}
                            onChange={(e) => {
                              setPresentCount(e.target.value);
                              setPresentCountError(false);
                            }}
                            placeholder="Enter present count"
                            min="0"
                            max={modalData.populationCount}
                          />
                          <button
                            onClick={handleAllPresent}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-3 whitespace-nowrap"
                          >
                            All Present
                          </button>
                        </div>
                        {presentCountError && (
                          <p className="text-sm text-red-500 mt-1">
                            Please enter how many visitors attended
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Add completion message field (optional) */}
                    <div className="mt-4">
                      <div className="text-base mb-2">Completion Message</div>
                      <textarea
                        className="w-full p-4 border border-gray-300 rounded-md h-[120px] overflow-y-auto resize-none text-base"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter completion message (optional)"
                      />
                      <div className="text-sm text-gray-500 mt-2">
                        This will automatically send to{' '}
                        {modalData.email || 'michael18ricafrente@gmail.com'}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mt-4">
                      Enter the number of visitors who actually attended. Click "All Present" if
                      everyone arrived.
                    </div>
                  </div>
                )}
              </>
            )}

            {/* For REJECTED status - No actions needed */}
            {isRejected && (
              <div className="mb-6 text-center text-xl">
                <div className="px-6 py-3 bg-gray-100 rounded-lg text-gray-700">
                  This appointment has been rejected. No further actions are available.
                </div>
              </div>
            )}

            {/* THIRD PHASE: COMPLETED or FAILED - Just show view-only mode */}
            {isCompletedOrFailed && (
              <div className="mb-6 text-center text-xl">
                <div className="px-6 py-3 bg-gray-100 rounded-lg text-gray-700">
                  This appointment is {modalData.status.toLowerCase()}. No further actions are
                  available.
                </div>
              </div>
            )}

            {/** Action buttons based on state */}
            <div className="flex justify-end mt-6">
              {/** While loading, disable the button and show a loading message */}
              {(isToReview || isConfirmed) && (
                <button
                  className={`${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6F3FFF] hover:opacity-90'
                    } text-white px-10 py-3 rounded-md text-lg font-medium transition-colors`}
                  onClick={handleSend}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Done'}
                </button>
              )}

              {/* Close button - shown for view-only states */}
              {(isCompletedOrFailed || isRejected) && (
                <button
                  className="bg-gray-500 text-white px-10 py-3 rounded-md hover:opacity-90 text-lg font-medium"
                  onClick={onClose}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}

        {/* If showRespondSection is false, just show a Close button */}
        {!showRespondSection && (
          <div className="flex justify-end mt-6">
            <button
              className="bg-gray-500 text-white px-10 py-3 rounded-md hover:opacity-90 text-lg font-medium"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Default export for backward compatibility
export default {
  AppointmentModal
};
