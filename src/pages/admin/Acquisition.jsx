import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../../components/navbar/AdminNav';
import CustomDatePicker from '../../components/function/CustomDatePicker';
import AcquisitionModal from '../../components/modals/AcquisitionModal';
import SelectedDonatorModal from '../../components/modals/SelectedDonatorModal';

import Toast from '../../components/function/Toast';

const Acquisition = () => {
  // Existing state variables remain...
  const [selectedDate, setSelectedDate] = useState(null);
  const [forms, setForms] = useState([]);
  const [acquisitions, setAcquisitions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
    const [isAcquisitionModalOpen, setIsAcquisitionModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedDonationForm, setSelectedDonationForm] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ action: '', open: false });
  const [activeTab, setActiveTab] = useState('form');
  const [expandedDonator, setExpandedDonator] = useState(null);
  const [highlightedDonator, setHighlightedDonator] = useState(null);
  const [donationCount, setDonationCount] = useState(0);
  const [lendingCount, setLendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Actions');
  const [columnFilter, setColumnFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filteredData, setFilteredData] = useState({ acquisitions: [] });
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Add state for document management
  const [documentView, setDocumentView] = useState(false);


  

  // Function to fetch documents from localStorage
  const fetchDocuments = () => {
    const docs = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('document_')) {
        try {
          const docData = JSON.parse(localStorage.getItem(key));
          docs.push({ 
            key: key, 
            ...docData
          });
        } catch (error) {
          console.error('Error parsing document from localStorage:', error);
        }
      }
    }
    setStoredDocuments(docs);
    setIsAcquisitionModalOpen(true);
  };


  // Toast functions
  const showToast = (message, type = 'success') => {
    setToastConfig({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false
    });
  };

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Format date functions
  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  const currentDate = formatDate(new Date());

  // Standardize status naming
  const standardizeStatus = (status) => {
    if (!status) return "Default Status";
    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get styled status label
  const getStatusLabel = (status) => {
    const standardStatus = standardizeStatus(status);
    let bgColor;
    let textColor = 'text-white';

    switch (standardStatus.toLowerCase()) {
      case 'accepted':
        bgColor = 'bg-green-500';
        break;
      case 'rejected':
        bgColor = 'bg-red-600';
        break;
      case 'pending':
        bgColor = 'bg-[#AEAAD4]';
        break;
      case 'acquired':
        bgColor = 'bg-blue-600';
        break;
      case 'failed':
        bgColor = 'bg-orange-600';
        break;
      default:
        bgColor = 'bg-gray-500';
    }

    return (
      <span className={`${bgColor} ${textColor} px-3 py-1 rounded-lg inline-flex items-center justify-center`}>
        {standardStatus}
      </span>
    );
  };

  // Fetch forms from backend
  const fetchForms = async () => {
    try {
      let url = `${API_URL}/api/auth/form`;

      // Add date filtering if selected
      if (selectedDate) {
        const dateParam = formatDateForAPI(selectedDate);
        if (dateParam) {
          url += `?date=${dateParam}`;
        }
      }

      const response = await axios.get(url, 
        { withCredentials: true });
      
      // Ensure response data is an array
      if (Array.isArray(response.data)) {
        setForms(response.data);
        setAcquisitions(response.data);
        
        // Update count statistics
        setDonationCount(response.data.filter(form => form.ContributionType?.accession_type === 'Donation').length);
        setLendingCount(response.data.filter(form => form.ContributionType?.accession_type === 'Lending').length);
        setAcceptedCount(response.data.filter(form => form.ContributionType?.status === 'Accepted').length);
        setRejectedCount(response.data.filter(form => form.ContributionType?.status === 'Rejected').length);
      } else {
        console.error('Expected an array but got:', response.data);
        setForms([]);
        setAcquisitions([]);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      showToast('Failed to load acquisition data', 'error');
    }
  };

  // Filter forms based on search and status
  const filterForms = (forms) => {
    return forms.filter(form => {
      // Search matching
      const matchesSearch = !searchQuery || 
                          (form.artifact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          form.Donator?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status filtering
      const formStatus = form.ContributionType?.status;
      const transferStatus = form.ContributionType?.transfer_status;
      
      // Match forms based on either normal status or transfer status
      const matchesStatus = 
        statusFilter === 'All Actions' || 
        standardizeStatus(formStatus) === statusFilter ||
        (statusFilter === 'Acquired' && standardizeStatus(transferStatus) === 'Acquired') ||
        (statusFilter === 'Failed' && standardizeStatus(transferStatus) === 'Failed');
      
      // Date filtering based on selectedDate
      let matchesDate = true;
      if (selectedDate) {
        const formDate = new Date(form.donation_date || form.createdAt);
        const selectedDateTime = new Date(selectedDate);
        
        // Compare only the date part (year, month, day)
        matchesDate = 
          formDate.getFullYear() === selectedDateTime.getFullYear() && 
          formDate.getMonth() === selectedDateTime.getMonth() && 
          formDate.getDate() === selectedDateTime.getDate();
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      showToast(`Filtering data for ${formatDate(date)}`, 'info');
    } else {
      showToast('Showing all dates', 'info');
    }
  };

  // Handle confirmation action
  const handleConfirmAction = async () => {
    if (!selectedForm) return;

    try {
      const status = confirmationAction === 'approve' ? 'Accepted' : 'Rejected';

      // Update the form status
      await axios.put(`${API_URL}/api/auth/form/${selectedForm.id}/status`, { status });

      // If the form is rejected, automatically set transfer status to Failed
      if (status === 'Rejected') {
        await axios.put(`${API_URL}/api/auth/form/${selectedForm.id}/transfer_status`, {
          transfer_status: 'Failed'
        });
      } else if (status === 'Accepted') {
        // If the form is accepted, set transfer status to On Progress
        await axios.put(`${API_URL}/api/auth/form/${selectedForm.id}/transfer_status`, {
          transfer_status: 'On Progress'
        });
      }

      // Optionally, update the `updated_at` timestamp
      await axios.put(`${API_URL}/api/auth/form/${selectedForm.id}/timestamp`);

      showToast(`Form ${status === 'accepted' ? 'approved' : 'rejected'} successfully!`, 'success');
      fetchForms(); // Refresh forms list
    } catch (error) {
      console.error('Error processing action:', error);
      showToast('Failed to update form status', 'error');
    }

    setIsConfirmationOpen(false);
  };

  // Handle delivery action
  const handleDeliveryAction = async (action) => {
    if (!selectedForm) return;
  
    try {
      const transferStatus = action === 'delivered' ? 'Acquired' : 'Failed';
  
      await axios.put(`${API_URL}/api/auth/form/${selectedForm.id}/transfer_status`, {
        transfer_status: transferStatus,
      });
  
      showToast(`Transfer status updated to: ${transferStatus}`, 'success');
      fetchForms(); // Refresh forms list
    } catch (error) {
      console.error('Error updating transfer status:', error);
      showToast('Failed to update transfer status', 'error');
    }
  
    setConfirmationModal({ action: '', open: false });
  };

  // Handle modal actions
  const handleCloseModal = () => {
    setIsAcquisitionModalOpen(false); // 👈 hides the modal
    setSelectedForm(null);  
    setSelectedResponse(null);
  };

  const handleApprove = () => {
    setConfirmationAction('approve');
    setSelectedResponse('yes');
    setIsConfirmationOpen(true);
  };

  const handleDecline = () => {
    setConfirmationAction('decline');
    setSelectedResponse('no');
    setIsConfirmationOpen(true);
  };

  const handleOpenModal = (form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleOpenDonationModal = (form) => {
    setSelectedDonationForm(form);
    setIsDonationModalOpen(true);
  };

  const handleCloseDonationModal = () => {
    setIsDonationModalOpen(false);
    setSelectedDonationForm(null);
  };

  const handleToggleDropdown = (donorId) => {
    if (expandedDonator === donorId) {
      setExpandedDonator(null);
      setHighlightedDonator(null);
    } else {
      setExpandedDonator(donorId);
      setHighlightedDonator(donorId);
    }
  };
  useEffect(() => {
    // Only run this if we have forms data
    if (forms.length > 0) {
      // Filter forms based on selected date
      let filteredForms = [...forms];
      
      if (selectedDate) {
        const selectedDateTime = new Date(selectedDate);
        filteredForms = forms.filter(form => {
          const formDate = new Date(form.donation_date || form.createdAt);
          return (
            formDate.getFullYear() === selectedDateTime.getFullYear() && 
            formDate.getMonth() === selectedDateTime.getMonth() && 
            formDate.getDate() === selectedDateTime.getDate()
          );
        });
      }    // Update counts based on filtered forms
      setDonationCount(filteredForms.filter(form => form.ContributionType?.accession_type === 'Donation').length);
      setLendingCount(filteredForms.filter(form => form.ContributionType?.accession_type === 'Lending').length);
      setAcceptedCount(filteredForms.filter(form => form.ContributionType?.status === 'Accepted').length);
      setRejectedCount(filteredForms.filter(form => form.ContributionType?.status === 'Rejected').length);
    }
  }, [forms, selectedDate]);
  // Fetch documents when tab changes or component loads
  useEffect(() => {
    if (documentView) {
      fetchDocuments();
    }
  }, [documentView]);

  // Initial data load
  useEffect(() => {
    fetchForms();
  }, []);

  // Effect to refresh data when date changes
  useEffect(() => {
    fetchForms();
  }, [selectedDate]);

  // Group donations by donor for the donator records view
  const donationGroups = forms.reduce((acc, form) => {
    if (form?.ContributionType?.accession_type === 'Donation' || form?.ContributionType?.accession_type === 'Lending') {
      const donorId = form?.Donator?.id;
      if (!acc[donorId]) {
        acc[donorId] = {
          donorId,
          donorName: form.Donator.name,
          date: form.donation_date,
          forms: [],
        };
      }
      acc[donorId].forms.push(form);
    }
    return acc;
  }, {});

  const donationGroupsArray = Object.values(donationGroups);

  // Update filtered data when source data or filters change
  useEffect(() => {
    // Apply filtering
    let filtered = filterForms(acquisitions);
    
    // Apply sorting
    if (columnFilter) {
      filtered = [...filtered].sort((a, b) => {
        let valueA, valueB;
        
        switch (columnFilter) {
          case 'date':
            valueA = new Date(a.donation_date || a.createdAt);
            valueB = new Date(b.donation_date || b.createdAt);
            break;
          case 'donator':
            valueA = a.Donator?.name || '';
            valueB = b.Donator?.name || '';
            break;
          case 'artifact':
            valueA = a.artifact_name || '';
            valueB = b.artifact_name || '';
            break;
          case 'status':
            valueA = a.ContributionType?.status || '';
            valueB = b.ContributionType?.status || '';
            break;
          case 'transfer':
            valueA = a.ContributionType?.transfer_status || '';
            valueB = b.ContributionType?.transfer_status || '';
            break;
          case 'updated':
            valueA = new Date(a.updated_at || 0);
            valueB = new Date(b.updated_at || 0);
            break;
          default:
            valueA = 0;
            valueB = 0;
        }
        
        const result = typeof valueA === 'string'
          ? valueA.localeCompare(valueB)
          : (valueA - valueB);
        
        return sortDirection === 'asc' ? result : -result;
      });
    }
    
    setFilteredData({ acquisitions: filtered });
  }, [acquisitions, searchQuery, statusFilter, columnFilter, sortDirection, selectedDate]);

  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        {/* Left Nav */}
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className='w-full min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-auto'>
        {isAcquisitionModalOpen ? (<AcquisitionModal
     
          isModalOpen={isAcquisitionModalOpen} // ✅ use the correct state
        
          selectedForm={selectedForm}
          handleCloseModal={handleCloseModal}
          isDonationModalOpen={isDonationModalOpen}
          selectedDonationForm={selectedDonationForm}
          handleCloseDonationModal={handleCloseDonationModal}
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          isConfirmationOpen={isConfirmationOpen}
          confirmationAction={confirmationAction}
          handleConfirmAction={handleConfirmAction}
          setIsConfirmationOpen={setIsConfirmationOpen}
          selectedResponse={selectedResponse}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
          handleDeliveryAction={handleDeliveryAction}
        />) : (<>
         <div className='flex flex-col '>
                <span className=' text-5xl font-semibold'>Donation and Lending Management</span>
                <span className='text-2xl font-semibold'>Acquisition</span>
              </div>
          <div className='w-full h-[calc(100%-9rem)] flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5'>
            {/* Left Panel: Stats + Tabs */}
            <div className='min-w-[34rem] h-full flex flex-col gap-y-7'>
              {/* Tab Selector - add Documents tab */}
              <div className='w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex justify-start py-2 gap-x-2 flex-wrap'>
                <button
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${activeTab === 'form' && !documentView ? 'bg-black text-white' : 'border-gray-500'}`}
                  onClick={() => { setActiveTab('form'); setDocumentView(false); }}
                >
                  <span className='text-2xl font-semibold'>Form</span>
                </button>
                <button
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${activeTab === 'donationRecords' && !documentView ? 'bg-black text-white' : 'border-gray-500'}`}
                  onClick={() => { setActiveTab('donationRecords'); setDocumentView(false); }}
                >
                  <span className='text-2xl font-semibold'>Donation Records</span>
                </button>
              
              </div>

              {/* Stats Section */}
              <div className='w-full h-full flex flex-col gap-y-[5rem]'>
              <div className='bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm'>
              <span className='text-2xl text-white font-semibold'>Total Forms</span>
              <div className='w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md'>
                <span className='text-2xl text-black font-semibold'>
                  {filteredData.acquisitions.length}
                </span>
              </div>
            </div>


                {/* Statistics */}
                <div className='w-full h-fit flex flex-col gap-y-7'>
                <span className='text-2xl font-semibold text-[#727272]'>
                    {selectedDate ? formatDate(selectedDate) : currentDate}
                  </span>

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

            {/* Right Section: Search Controls and Table */}
            <div className='w-full h-full flex flex-col gap-y-7 overflow-x-auto overflow-y-auto'>
              {/* Search and Filter Controls */}
              <div className='min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2'>
                {/* Date picker */}
                <div className='flex-shrink-0'>
                  <CustomDatePicker
                    selected={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                    isClearable={true}
                    placeholderText="Filter by Date"
                    popperPlacement='bottom-start'
                    popperClassName='z-50'
                    customInput={
                      <button className={`px-3 h-16 rounded-lg border-1 ${selectedDate ? 'border-gray-700' : 'border-gray-500'} cursor-pointer`}>
                        <i className={`${selectedDate ? 'text-gray-700 fa-solid' : 'text-gray-500 fa-regular'} fa-calendar text-4xl`}></i>
                      </button>
                    }
                  />
                </div>

                {/* Search input */}
                <div className='relative h-full min-w-[20rem]'>
                  <i className='text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'></i>
                  <input
                    type='text'
                    placeholder='Search by name or donator'
                    className='h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Sort dropdown */}
                <div className='relative h-full min-w-48'>
                  <select
                    className='appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onChange={(e) => {
                      const [column, direction] = e.target.value.split('|');
                      setColumnFilter(column);
                      setSortDirection(direction || 'asc');
                    }}
                    value={`${columnFilter}|${sortDirection}`}
                  >
                    <option value="">Sort By...</option>
                    <option value="date|asc">Date (Oldest First)</option>
                    <option value="date|desc">Date (Newest First)</option>
                    <option value="donator|asc">Donator Name (A-Z)</option>
                    <option value="donator|desc">Donator Name (Z-A)</option>
                    <option value="artifact|asc">Artifact Name (A-Z)</option>
                    <option value="artifact|desc">Artifact Name (Z-A)</option>
                    <option value="status|asc">Status (A-Z)</option>
                    <option value="status|desc">Status (Z-A)</option>
                    <option value="transfer|asc">Transfer Status (A-Z)</option>
                    <option value="transfer|desc">Transfer Status (Z-A)</option>
                    <option value="updated|asc">Last Updated (Oldest First)</option>
                    <option value="updated|desc">Last Updated (Newest First)</option>
                  </select>
                  <i className='text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600'></i>
                </div>

                {/* Status filter */}
                <div className='relative h-full min-w-48'>
                  <select
                    className='appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All Actions">All Actions</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Acquired">Acquired</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <i className='text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600'></i>
                </div>
              </div>

              {/* Table Content */}
              <div className='w-full h-full flex flex-col gap-y-7'>
                {/* Form Table */}
                {activeTab === 'form' && (
                  <>
                                {/* Table Headers */}
                    <div className='min-w-[94rem] w-full font-semibold min-h-fit grid grid-cols-6 justify-between '>
                      <div className='text-[#727272] text-2xl border-l-1  px-3 py-2'>Date</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Donator</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Artifact Name</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Status</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Transfer Status</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Last Updated</div>
                    </div>  

                    {/* Table Data */}
                    <div className='w-full min-w-[94rem] h-full  flex flex-col border-gray-400 border-y'>
                      {filteredData.acquisitions.length > 0 ? (
                        filteredData.acquisitions.map((form) => (
                          <div
                            key={form.id}
                            className='min-w-[94rem] text-xl h-[4rem] font-semibold grid grid-cols-6 cursor-pointer hover:bg-gray-300'
                            onClick={() => {
                              setSelectedForm(form);
                              setIsAcquisitionModalOpen(true);
                            }}                          >
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
                              {getStatusLabel(form.ContributionType.status || 'Pending')}
                            </div>
                            <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                              {getStatusLabel(form.ContributionType.transfer_status || 'N/A')}
                            </div>
                            <div className='px-4 py-2 border-b-1 border-gray-400 flex items-center'>
                              {form.updated_at ? new Date(form.updated_at).toLocaleString() : 'N/A'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="min-w-[94rem] h-full py-16 flex justify-center items-center border-b-1 border-gray-400">
                          <div className="text-2xl h-fit text-gray-500 flex flex-col items-center">
                            <i className="fas fa-inbox text-5xl mb-4"></i>
                            <p>No acquisition data available</p>
                            <p className="text-lg mt-2">Try adjusting your filters or search criteria</p>
                          </div>
                        </div>
                      )}
                  </div>
                  </>

                )}

                {/* Donation Records Tab */}
                {activeTab === 'donationRecords' && (
                  <>
                    {/* Table header for top-level rows */}
                    <div className='min-w-[94rem] w-full font-semibold h-fit grid grid-cols-3 justify-between '>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Date</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Donator</div>
                      <div className='text-[#727272] text-2xl border-l-1 px-3 py-2'>Donations</div>
                    </div>
                  
                    <div className='w-full min-w-[94rem] h-full flex flex-col border-y-1 border-gray-400'>
                      {donationGroupsArray.length > 0 ? (
                        donationGroupsArray.map((group) => {
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
                                          {getStatusLabel(f.ContributionType.status || 'Pending')}
                                        </div>
                                        <div className="py-3 border-b-1 border-gray-400">
                                          {getStatusLabel(f.ContributionType.transfer_status || 'N/A')}
                                        </div>
                                        <div className="py-3 border-b-1 border-gray-400">
                                          {f.donation_date ? new Date(f.donation_date).toLocaleDateString() : 'N/A'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="min-w-[94rem] h-full py-16 flex justify-center items-center border-b-1 border-gray-400">
                          <div className="text-2xl h-fit text-gray-500 flex flex-col items-center">
                            <i className="fas fa-inbox text-5xl mb-4"></i>
                            <p>No donation records available</p>
                            <p className="text-lg mt-2">Try adjusting your filters or search criteria</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          </>) }
        </div>
        <SelectedDonatorModal
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
        selectedDonationForm={selectedDonationForm}
      />
      </div>


      {/* Modals */}
      {/* <AcquisitionModal
        isModalOpen={isModalOpen}
        selectedForm={selectedForm}
        handleCloseModal={handleCloseModal}
        isDonationModalOpen={isDonationModalOpen}
        selectedDonationForm={selectedDonationForm}
        handleCloseDonationModal={handleCloseDonationModal}
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        isConfirmationOpen={isConfirmationOpen}
        confirmationAction={confirmationAction}
        handleConfirmAction={handleConfirmAction}
        setIsConfirmationOpen={setIsConfirmationOpen}
        selectedResponse={selectedResponse}
        handleApprove={handleApprove}
        handleDecline={handleDecline}
        handleDeliveryAction={handleDeliveryAction}
      /> */}

      {/* Toast Message Component */}
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default Acquisition;
