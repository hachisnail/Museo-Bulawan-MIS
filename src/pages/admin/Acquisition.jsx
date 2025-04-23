import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../../components/navbar/AdminNav';
import CustomDatePicker from '../../components/function/CustomDatePicker';
import AcquisitionModal from '../../components/modals/AcquisitionModal'

const Acquisition = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [forms, setForms] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null); // 'approve' or 'decline'

  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
    setSelectedResponse(null); // Reset selected response
};

  const handleApprove = () => {
    setConfirmationAction('approve');
    setSelectedResponse('yes'); // Track the response
    setIsConfirmationOpen(true);
};

const handleDecline = () => {
    setConfirmationAction('decline');
    setSelectedResponse('no'); // Track the response
    setIsConfirmationOpen(true);
};

const handleConfirmAction = async () => {
  if (!selectedForm) return;

  try {

    const status = confirmationAction === 'approve' ? 'accepted' : 'rejected';

    // Update the form status
    await axios.put(`http://localhost:5000/api/auth/form/${selectedForm.id}/status`, {
      status, // Send the determined status
    });

    // Optionally, update the `updated_at` timestamp
    await axios.put(`http://localhost:5000/api/auth/form/${selectedForm.id}/timestamp`);

    alert(`Form ${status === 'accepted' ? 'approved' : 'rejected'} successfully!`);
    fetchForms(); // Refresh forms list to get updated data
  } catch (error) {
    console.error('Error processing action:', error);
    alert('Failed to update form status.');
  }

  setIsConfirmationOpen(false); // Close confirmation modal
};
  
{/*Donators Record Open*/}
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedDonationForm, setSelectedDonationForm] = useState(null);
  

  const handleOpenDonationModal = (form) => {
    setSelectedDonationForm(form);
    setIsDonationModalOpen(true);
  };

  const handleCloseDonationModal = () => {
    setIsDonationModalOpen(false);
    setSelectedDonationForm(null);
    
  };

  

  

  const [selectedResponse, setSelectedResponse] = useState(null);
  const [donationCount, setDonationCount] = useState(0); // State for donation count
  const [lendingCount, setLendingCount] = useState(0); // State for donation count

  const [acceptedCount, setAcceptedCount] = useState(0); // State for donation count
  const [rejectedCount, setRejectedCount] = useState(0); // State for donation count
  const [confirmationModal, setConfirmationModal] = useState({ action: '', open: false });



  const [activeTab, setActiveTab] = useState('form'); // Default active tab
  const [setModalType] = useState(''); // New state for modal type

  const [expandedDonator, setExpandedDonator] = useState(null);
  const [highlightedDonator, setHighlightedDonator] = useState(null);




  

  const token = localStorage.getItem('token');

  const handleToggleDropdown = (donorId) => {
    if (expandedDonator === donorId) {
      setExpandedDonator(null);
      setHighlightedDonator(null);
    } else {
      setExpandedDonator(donorId);
      setHighlightedDonator(donorId); // Highlight the clicked donor
    }
  };



  const donationGroups = forms.reduce((acc, form) => {
    if (form?.ContributionType?.accession_type === 'Donation' || form?.ContributionType?.accession_type === 'Lending') {
      const donorId = form?.Donator?.id;
      if (!acc[donorId]) {
        acc[donorId] = {
          donorId,
          donorName: form.Donator.name,
          date: form.donation_date,   // Or pick any date to display in the row
          forms: [],
        };
      }
      acc[donorId].forms.push(form);
    }
    return acc;
  }, {});

  const donationGroupsArray = Object.values(donationGroups);


  
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const currentDate = formatDate(new Date());
  
  // Fetch forms from backend
  const fetchForms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/form', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Log the response data
  
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setForms(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        setForms([]); // Set to empty array if not an array
      }
  
      // Count the number of forms with accession_type equal to "donation"
      const donationCount = response.data.filter(form => form.ContributionType.accession_type === 'Donation').length;
      setDonationCount(donationCount); // Set the donation count
  
      // Count the number of forms with accession_type equal to "lending"
      const lendingCount = response.data.filter(form => form.ContributionType.accession_type === 'Lending').length;
      setLendingCount(lendingCount); // Set the lending count
  
      const acceptedCount = response.data.filter(form => form.ContributionType.status === 'Accepted').length;
      setAcceptedCount(acceptedCount); // Set the accepted count
  
      // Count the number of forms with accession_type equal to "rejected"
      const rejectedCount = response.data.filter(form => form.ContributionType.status === 'Rejected').length;
      setRejectedCount(rejectedCount); // Set the rejected count
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };
  

  useEffect(() => {
    fetchForms();
  }, []);

const handleTabChange = (tab) => {
  setActiveTab(tab);
};
const handleOpenModal = (form) => {
  setSelectedForm(form); // Set the selected form

  // Check if the form's status is 'Pending'
  if (form.ContributionType.status === 'Pending') {
      setIsModalOpen(true); // Open the main modal
      setModalType('formDetails'); // Set modal type to form details
  } else {
      // Open the TransferStatusModal if the form is not pending
      setIsModalOpen(true); // Open the modal
      setModalType('transferStatusModal'); // Set modal type to transfer status
  }
};







  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        {/* Left Nav */}
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className='w-full min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-scroll'>
          <span className='text-5xl font-semibold'>Donation and Lending Management</span>

          <div className='w-full h-full flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5 '>
            <div className='min-w-[34rem] h-full flex flex-col gap-y-7'>
              {/* Info Bar */}
              <div className='w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex justify-start py-2 gap-x-2 '>
                <button
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${activeTab === 'form' ? 'bg-black text-white' : 'border-gray-500'}`}
                  onClick={() => handleTabChange('form')}
                >
                  <span className='text-2xl font-semibold'>Form</span>
                </button>
                <button
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${activeTab === 'donationRecords' ? 'bg-black text-white' : 'border-gray-500'}`}
                  onClick={() => handleTabChange('donationRecords')}
                >
                  <span className='text-2xl font-semibold'>Donation Records</span>
                </button>
                
              </div>

              <div className='w-full h-full flex flex-col gap-y-[5rem]'>
                <div className='bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm'>
                  <span className='text-2xl text-white font-semibold'>Total Forms</span>
                  <div className='w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md'>
                    <span className='text-2xl text-black font-semibold'>
                      {forms.length}
                    </span>
                  </div>
                </div>

                {/* Example placeholders for summary counts */}
                <div className='w-full h-fit flex flex-col gap-y-7'>
                  <span className='text-2xl font-semibold text-[#727272]'>{currentDate}</span>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold'>Donation Forms</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>{donationCount}</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold'>Lending Forms</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>{lendingCount}</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold'>Accepted Forms</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>{acceptedCount}</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold'>Rejected Forms</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>{rejectedCount}</span>
                    </div>
                  </div>

                
                </div>
              </div>
            </div>

            {/* Right Section with Table */}
            <div className='w-full h-full flex flex-col gap-y-7 overflow-x-scroll overflow-y-scroll'>
              {/* Filtering and Searching */}
              <div className='min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2'>
                <div className='flex-shrink-0'>
                  <CustomDatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    popperPlacement='bottom-start'
                    popperClassName='z-50'
                    customInput={
                      <button className='px-3 h-16 rounded-lg border-1 border-gray-500 cursor-pointer'>
                        <i className='text-gray-500 fa-regular fa-calendar text-4xl'></i>
                      </button>
                    }
                  />
                </div>

                <div className='relative h-full min-w-[20rem]'>
                  <i className='text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'></i>
                  <input
                    type='text'
                    placeholder='Search History'
                    className='h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='relative h-full min-w-48'>
                  <input
                    type='text'
                    placeholder='Filter...'
                    className='pl-4 h-full text-2xl pr-8 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <i className='cursor-pointer text-2xl fas fa-plus absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'></i>
                </div>

                <div className='relative h-full min-w-48'>
                  <select className='appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option>All Actions</option>
                    <option>Action 1</option>
                    <option>Action 2</option>
                  </select>
                  <i className='text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600'></i>
                </div>
              </div>

              <div className='w-full h-full flex flex-col gap-y-7'>
                {activeTab === 'form' && (
                  <div>
                    {/* Render Form Table */}
              
                    {/* Table Headers */}
                    <div className='min-w-[94rem] w-full font-semibold h-fit grid grid-cols-6 justify-between '>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Date</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Donator</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Artifact Name</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Status</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Transfer Status</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Last Updated</div>
                    </div>

                    {/* Table Data */}
                    <div className='w-full min-w-[94rem] h-auto flex flex-col mt-2'>
                      {forms.map((form) => (
                        <div
                          key={form.id}
                          className='min-w-[94rem] text-xl h-[4rem] font-semibold grid grid-cols-6 cursor-pointer hover:bg-gray-300'
                          onClick={() => handleOpenModal(form)}
                        >
                          <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                            {form.donation_date ? new Date(form.donation_date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                            {form.Donator?.name || 'N/A'}
                          </div>
                          <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                            {form.artifact_name}
                          </div>
                          <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                            <div className={`w-[6em] h-auto p-1 px-4 rounded-lg flex items-center justify-center text-white ${form.ContributionType.status === 'Accepted' ? 'bg-[#2ED748]' : form.ContributionType.status === 'Rejected' ? 'bg-[#AE2A2A]' : 'bg-[#AEAAD4]'}`}>
                              {form.ContributionType.status || 'To Review'}
                            </div>
                          </div>
                          <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                            {form.ContributionType.transfer_status || 'N/A'}
                          </div>
                          <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                            {form.updated_at ? new Date(form.updated_at).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
                {activeTab === 'donationRecords' && (
                    <div>
                      {/* Table header for top-level rows */}
                      <div className='min-w-[94rem] w-full font-semibold h-fit grid grid-cols-3 justify-between '>
                        <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Date</div>
                        <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Donator</div>
                        <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Donations</div>
                      </div>
                    
                      <div className='w-full min-w-[94rem] h-auto flex flex-col mt-2'>
                      {donationGroupsArray.map((group) => {
                      const { donorId, donorName, date, forms } = group;

                      return (
                        <div key={donorId}>
                          {/* Top-level row */}
                          <div
                            className={`min-w-[94rem] text-xl h-[4rem] font-semibold grid grid-cols-3 cursor-pointer hover:bg-gray-300 ${
                              highlightedDonator === donorId ? 'bg-gray-300' : ''
                            }`}
                            onClick={() => handleToggleDropdown(donorId)}
                          >
                            <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                              {date ? new Date(date).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                              {donorName || 'N/A'}
                            </div>
                            <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center justify-between'>
                              {forms.length}
                              <i
                                className={`fa-solid fa-caret-down transition-transform duration-300 ${
                                  expandedDonator === donorId ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </div>

                                {/* Expanded section */}
                                {expandedDonator === donorId && (
  <div className="bg-white p-4 border-1 border-gray-300 w-2/3 ml-auto h-auto ">
    <div className="grid grid-cols-5 text-left font-semibold mb-3 text-xl">
      <div>Title</div>
      <div>Contribution Type</div>
      <div>Status</div>
      <div>Transfer Status</div>
      <div>Date</div>
    </div>
    <div className="w-full max-h-42 overflow-auto">
      {forms.map((f) => (
        <div
          key={f.id}
          className="grid grid-cols-5 text-xl hover:bg-gray-300 cursor-pointer"
          onClick={() => handleOpenDonationModal(f)} // Open modal on click
        >
          <div className="py-3 border-b-1 border-gray-400">{f.artifact_name}</div>
          <div className="py-3 border-b-1 border-gray-400">{f.ContributionType.accession_type}</div>
          <div className="py-3 border-b-1 border-gray-400">
            <span
              className={`p-1 px-3 rounded-lg text-white ${
                f.ContributionType.status === 'Accepted'
                  ? 'bg-green-600'
                  : f.ContributionType.status === 'Rejected'
                  ? 'bg-red-600'
                  : 'bg-gray-400'
              }`}
            >
              {f.ContributionType.status || 'To Review'}
            </span>
          </div>
          <div className="py-3 border-b-1 border-gray-400">{f.ContributionType.transfer_status || 'N/A'}</div>
          <div className="py-3 border-b-1 border-gray-400">
            {f.donation_date ? new Date(f.donation_date).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      ))}
    </div>

    {/* Render the modal outside the loop */}
    <AcquisitionModal
      isOpen={isDonationModalOpen}
      onClose={handleCloseDonationModal}
      selectedDonationForm={selectedDonationForm}
    />
  </div>
)}


                              </div>
                            );
                          })}
                        </div>

                    </div>
                  )}
                
              </div>
            </div>
          </div>
        </div>
      </div>


               {/* MODALS */}
                {isModalOpen && selectedForm && selectedForm.ContributionType.status === 'Pending' && (
                  <>
                    {/* Overlay / Backdrop */}
                    <div
                      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
                      onClick={handleCloseModal} // Close modal on overlay click
                    />
                    <div
                      className="fixed bg-white rounded-md px-8 py-1 z-50
                                  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                  min-w-[80rem] max-h-[60rem]"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                      {/* Modal Header */}
                      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-8 py-4 shadow-sm shadow-gray-500">
                        <div className="grid grid-cols-12 justify-between items-center mb-4">
                          <div className="col-span-10 text-3xl font-bold">
                            <span>
                              {selectedForm.ContributionType?.accession_type || 'N/A'}
                            </span>
                            <span> Form</span>
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
                              onClick={handleCloseModal} // Close modal on "X" button click
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
                              <div className='w-full h-auto flex flex-col gap-2'>
                                            <span className='text-2xl'>Image/s of the artifact.</span>
                                            <div className='w-full h-100 px-4 border-2 border-gray-400'>
                                            {/* images scroll or changeable left to right or right to left*/}
                                            </div>
                                          </div>

                                          <div className='w-full h-auto flex flex-col '>
                                            <span className='text-2xl'>Relevant documentation or research about the artifact.</span>
                                            <span className='text-xl text-[#FF0000]'> {selectedForm.documents || 'N/A'} </span>
                                          </div>

                                          <div className='w-full h-auto flex flex-col gap-2'>
                                            <span className='text-2xl'>Related image/s about the artifact.</span>
                                            <div className='w-full h-100 px-4 border-2 border-gray-400'>
                                            {/* images scroll or changeable left to right or right to left*/}
                                            </div>
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
                                  onClick={() => {
                                    handleApprove();
                                    setSelectedResponse('yes');
                                  }}
                                >
                                  <span className="text-xl font-semibold">Yes</span>
                                </button>
                                <button
                                  className={`border-1 border-black rounded-lg text-black px-4 py-2 w-[10em] cursor-pointer ${
                                    selectedResponse === 'no' ? 'bg-[#6F3FFF]' : 'bg-[#DFDFDF] hover:bg-[#6F3FFF]'
                                  }`}
                                  onClick={() => {
                                    handleDecline();
                                    setSelectedResponse('no');
                                  }}
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
                                className="bg-[#6F3FFF] rounded-lg text-white px-4 py-2 cursor-pointer hover:bg-[#4c3fff] w-[10em] mt-2"
                                onClick={async () => {
                                  try {
                                    await axios.put(
                                      `http://localhost:5000/api/auth/form/${selectedForm.id}/timestamp`
                                    );
                                    fetchForms();
                                    alert('Form updated successfully!');
                                    handleCloseModal();
                                  } catch (error) {
                                    console.error('Error updating form timestamp:', error);
                                    alert('Failed to update form.');
                                  }
                                }}
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
                {isModalOpen && selectedForm && selectedForm.ContributionType.status !== 'Pending' && (
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
                          onClick={handleCloseModal} // Close the modal
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {confirmationModal.open && (
                  <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/4">
                      <h2 className="text-xl font-bold">Confirm Action</h2>
                      <p className="mt-4">
                        Are you sure you want to mark this artifact as{' '}
                        <span className="font-semibold">
                          {confirmationModal.action === 'acquired' ? 'Delivered' : 'Not Delivered'}
                        </span>?
                      </p>
                      <div className="flex justify-end gap-4 mt-6">
                        <button
                          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                          onClick={() => setConfirmationModal({ action: '', open: false })} // Close confirmation modal
                        >
                          Cancel
                        </button>
                        <button
                          className={`${
                            confirmationModal.action === 'acquired' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                          } text-white px-4 py-2 rounded-md`}
                          onClick={async () => {
                            try {
                              // Update transfer_status based on the action
                              await axios.put(`http://localhost:5000/api/auth/form/${selectedForm.id}/transfer_status`, {
                                transfer_status: confirmationModal.action,
                              });
                              alert(`Transfer status updated to "${confirmationModal.action}".`);
                              fetchForms(); // Refresh the forms list
                              setConfirmationModal({ action: '', open: false }); // Close confirmation modal
                              handleCloseModal(); // Close the main modal
                            } catch (error) {
                              console.error('Error updating transfer status:', error);
                              alert('Failed to update transfer status.');
                            }
                          }}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isConfirmationOpen && (
                        <div
                          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
                          onClick={() => setIsConfirmationOpen(false)} // Close confirmation modal on overlay click
                        >
                          <div
                            className="bg-white rounded-md p-8 z-50 w-[30rem] max-w-full"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                          >
                            <h2 className="text-2xl font-bold mb-4">
                              {confirmationAction === 'approve'
                                ? 'Do you want to approve this form?'
                                : 'Do you want to decline this form?'}
                            </h2>
                            <div className="flex justify-end gap-4">
                              <button
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => {
                                  setIsConfirmationOpen(false); // Close confirmation modal
                                  setSelectedResponse(null); // Reset selected response
                                }} // Cancel confirmation
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleConfirmAction} // Confirm action
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                  )}
              
             

    </>
  )
}

export default Acquisition
