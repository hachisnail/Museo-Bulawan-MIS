import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNav from '../../components/navbar/AdminNav'
import { ArtifactView, ArtifactAdd, ArtifactHyperlink } from '../../components/modals/ArtifactModal'
import CustomDatePicker from '../../components/function/CustomDatePicker'
import Toast from '../../components/function/Toast'

const API_URL = import.meta.env.VITE_API_URL

// Helper functions for filtering
const getDateMatch = (artifact, selectedDate) => {
  if (!selectedDate) return true;
  
  const artifactDate = new Date(artifact.creation_date || artifact.upload_date);
  const selected = new Date(selectedDate);
  
  // Set both dates to midnight for proper comparison
  artifactDate.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  
  return artifactDate.getTime() === selected.getTime();
};

const getSearchMatch = (artifact, searchQuery) => {
  if (!searchQuery) return true;
  
  const query = searchQuery.toLowerCase();
  return (
    (artifact.artifact_creator || '').toLowerCase().includes(query) ||
    (artifact.artifact_type || '').toLowerCase().includes(query) ||
    (artifact.display_status || '').toLowerCase().includes(query)
  );
};

const getStatusMatch = (artifact, filterStatus) => {
  return filterStatus === 'all' || artifact.display_status === filterStatus;
};

const getAccessionTypeMatch = (artifact, activeTab) => {
  if (activeTab === 'artifact') return true;
  if (activeTab === 'acquired') {
    return artifact.accession_type === 'donated' || artifact.accession_type === 'purchased';
  }
  if (activeTab === 'borrowing') {
    return artifact.accession_type === 'lend';
  }
  return false;
};

const Artifact = () => {
  // State variables
  const [selectedDate, setSelectedDate] = useState(null)
  const [isAddArtifactOpen, setIsAddArtifactOpen] = useState(false)
  const [isHyperlinkOpen, setIsHyperlinkOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('artifact')
  const [artifacts, setArtifacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewingArtifact, setViewingArtifact] = useState(null)
  const [isViewArtifactOpen, setIsViewArtifactOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })

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

  // Fetch artifacts based on active tab
  useEffect(() => {
    const fetchArtifacts = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/api/auth/artifact`, 
          { withCredentials: true })
        
        setArtifacts(response.data)
        setError(null)
        showToast(`${response.data.length} artifacts loaded`, 'info')
      } catch (err) {
        console.error('Error fetching artifacts:', err)
        setError('Failed to load artifacts. Please try again.')
        setArtifacts([])
        showToast('Failed to load artifacts', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchArtifacts()
  }, [activeTab])
  
  // Effect to refresh artifacts after adding a new one
  useEffect(() => {
    if (!isAddArtifactOpen && artifacts.length > 0) {
      // Refresh artifacts when modal is closed (to show newly added one)
      const fetchLatestArtifacts = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get(`${API_URL}/api/auth/artifact`, 
            { withCredentials: true })
          
          setArtifacts(response.data)
          showToast('Artifacts refreshed', 'info')
        } catch (err) {
          console.error('Error refreshing artifacts:', err)
          showToast('Failed to refresh artifacts', 'error')
        }
      }
      
      fetchLatestArtifacts()
    }
  }, [isAddArtifactOpen, activeTab])

  const toggleArtifactModal = () => {
    setIsAddArtifactOpen(prev => !prev)
  }
  
  const closeArtifactModal = () => {
    setIsAddArtifactOpen(false)
  }

  const toggleHyperlinkModal = () => {
    setIsHyperlinkOpen(prev => !prev)
  }
  
  const closeHyperlinkModal = () => {
    setIsHyperlinkOpen(false)
  }

  const openArtifactView = (artifact) => {
    setViewingArtifact(artifact)
    setIsViewArtifactOpen(true)
  }
  
  const closeArtifactView = () => {
    setIsViewArtifactOpen(false)
    setViewingArtifact(null)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value)
  }

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value)
  }

  const handleDateChange = (date) => {
    if (date === null || (selectedDate && date.getTime() === selectedDate.getTime())) {
      setSelectedDate(null);
      showToast('Showing all dates', 'info');
    } else {
      setSelectedDate(date);
      showToast(`Filtering for ${date.toLocaleDateString()}`, 'info');
    }
  };

  // Calculate filtered artifacts
  const filteredArtifacts = artifacts.filter(artifact => 
    getSearchMatch(artifact, searchQuery) && 
    getStatusMatch(artifact, filterStatus) &&
    getDateMatch(artifact, selectedDate) &&
    getAccessionTypeMatch(artifact, activeTab) &&
    (filterType === 'all' || artifact.artifact_type === filterType)
  );

  // Get unique artifact types for the filter dropdown
  const artifactTypes = ['all', ...new Set(artifacts.map(a => a.artifact_type).filter(Boolean))];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'stored':
        return 'bg-blue-500'
      case 'displayed':
        return 'bg-green-500'
      case 'lend':
        return 'bg-[#9C7744]'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const tabButtonStyle = (tabName) => {
    return tabName === activeTab
      ? 'bg-black text-white border-black'
      : 'border-gray-500 text-black'
  }

  // Safe data access function
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined && o[key] !== null ? o[key] : null), obj) || defaultValue;
  };

  console.log(artifacts);

  return (
    <>
      {/* {isViewArtifactOpen && viewingArtifact && (
        <ArtifactView artifact={viewingArtifact} onClose={closeArtifactView} />
      )} */}
      
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        <div className='w-full min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-scroll '>
        
          {isViewArtifactOpen && viewingArtifact ? (<ArtifactView artifact={viewingArtifact} onClose={closeArtifactView} />) : (<>

            {isHyperlinkOpen ? (<ArtifactHyperlink onClose={closeHyperlinkModal}/>) : (
            <>

              {isAddArtifactOpen ? (<ArtifactAdd onClose={closeArtifactModal} />) : (
              <>
              <div className='flex flex-col gap-y-2 '>
                <span className=' text-5xl font-semibold'>Inventory</span>
                <span className='text-2xl font-semibold'>Artifact</span>
              </div>
              <div className='w-full h-full flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5 border-t-1 pt-5'>
                <div className='min-w-[34rem] h-full flex flex-col gap-y-7'>
                  {/* info bar */}
                  <div className='w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex  py-2 gap-x-2'>
                    <button onClick={() => setActiveTab('artifact')} className={`px-4 h-full border-1 border-gray-500 rounded-lg cursor-pointer ${tabButtonStyle('artifact')}`}>
                      <span className='text-2xl font-semibold'>Artifact</span>
                    </button>
                    <button onClick={() => setActiveTab('acquired')} className={`px-4 h-full border-1 border-gray-500  rounded-lg cursor-pointer ${tabButtonStyle('acquired')}`}>
                      <span className='text-2xl font-semibold'>Acquired</span>
                    </button>
                    <button onClick={() => setActiveTab('borrowing')} className={`px-4 h-full border-1 border-gray-500  rounded-lg cursor-pointer ${tabButtonStyle('borrowing')}`}>
                      <span className='text-2xl font-semibold'>Borrowing</span>
                    </button>
                  </div>

                  <div className='w-full h-full flex flex-col gap-y-[5rem]'>
                    <div className='bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm'>
                      <span className='text-2xl text-white font-semibold'>Total Artifacts</span>
                      <div className='w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md'>
                        <span className='text-2xl text-black font-semibold'>{
                          activeTab === 'artifact' 
                            ? artifacts.length 
                            : activeTab === 'acquired'
                              ? artifacts.filter(a => a.accession_type === 'donated' || a.accession_type === 'purchased').length
                              : artifacts.filter(a => a.accession_type === 'lend').length
                        }</span>
                      </div>
                    </div>

                    <div className='w-full h-auto flex flex-col gap-y-7'>
                      {/* Date */}
                      <span className='text-2xl font-semibold text-[#727272]'>
                        {selectedDate 
                          ? selectedDate.toLocaleDateString('en-US', {
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'All Dates'
                        }
                      </span>
                      <div className='w-full h-fit flex justify-between items-center'>
                        <span className='text-2xl font-semibold '>Acquired</span>
                        <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                          <span className='text-2xl font-semibold'>
                            {artifacts.filter(a => a.accession_type === 'donated' || a.accession_type === 'purchased').length}
                          </span>
                        </div>
                      </div>

                      <div className='w-full h-fit flex justify-between items-center'>
                        <span className='text-2xl font-semibold '>Borrowing</span>
                        <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                          <span className='text-2xl font-semibold'>
                            {artifacts.filter(a => a.accession_type === 'lend').length}
                          </span>
                        </div>
                      </div>

                      <div className='w-full h-fit flex justify-between items-center'>
                        <span className='text-2xl font-semibold '>Unfinished Edit</span>
                        <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                          <span className='text-2xl font-semibold'>0</span>
                        </div>
                      </div>

                      <div className='w-full h-fit flex justify-between items-center'>
                        <span className='text-2xl font-semibold '>On Display</span>
                        <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                          <span className='text-2xl font-semibold'>
                            {artifacts.filter(a => a.display_status === 'displayed').length}
                          </span>
                        </div>
                      </div>

                      <button onClick={toggleArtifactModal} className='cursor-pointer w-full h-[5rem] flex justify-between items-center bg-[#6BFFD5]'>
                        <span className='text-2xl font-semibold ml-[1rem]'>Add New Artifacts</span>
                        <div className='w-[3rem] h-[3rem] flex items-center bg-[#D4DBFF] rounded-full border-2 border-[#000000] justify-center mr-[1rem]'>
                          <i className="fas fa-plus text-3xl"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className=' w-full h-full flex flex-col gap-y-7 overflow-x-scroll overflow-y-scroll'>
                  {/* table */}
                  <div className='min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2'>
                    {/* Date picker with click to clear functionality */}
                    <div className='flex-shrink-0'>
                      <CustomDatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        popperPlacement="bottom-start"
                        popperClassName="z-50"
                        isClearable={true}
                        placeholderText="Filter by Date"
                        customInput={
                          <button className={`px-3 h-16 rounded-lg border-1 ${selectedDate ? 'border-gray-700' : 'border-gray-500'} cursor-pointer`}>
                            <i className={`${selectedDate ? 'text-gray-700 fa-solid' : 'text-gray-500 fa-regular'} fa-calendar text-4xl`}></i>
                          </button>
                        }
                      />
                    </div>

                    <div className="relative h-full min-w-[20rem]">
                      <i className="text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"></i>
                      <input
                        type="text"
                        placeholder="Search Artifacts"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="relative h-full min-w-48">
                      <select
                        value={filterStatus}
                        onChange={handleFilterStatusChange}
                        className="appearance-none pl-4 h-full text-2xl pr-8 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="stored">Stored</option>
                        <option value="displayed">Displayed</option>
                      </select>
                      <i className="cursor-pointer text-2xl fas fa-filter absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                    </div>

                    <div className="relative h-full min-w-48">
                      <select
                        value={filterType}
                        onChange={handleFilterTypeChange}
                        className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Types</option>
                        {artifactTypes.filter(t => t !== 'all').map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                    </div>
                  </div>

                  <div className="min-w-[94rem] w-full font-semibold h-fit grid grid-cols-6 justify-between">
                    {/* table headers */}
                    <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                      <span>Date</span>
                    </div>
                    <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-2">
                      <span>Title</span>
                    </div>
                    <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                      <span>Type</span>
                    </div>
                    <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                      <span>Display Status</span>
                    </div>
                    <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                      <span>Updated</span>
                    </div>
                  </div>

                  <div className="w-full min-w-[94rem] h-full flex flex-col border-t border-t-gray-400">
                    {/* Loading state */}
                    {loading && (
                      <div className="w-full py-8 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
                        <span className="ml-4 text-xl text-gray-700">Loading artifacts...</span>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {error && (
                      <div className="w-full py-8 flex justify-center items-center text-red-500 text-xl">
                        {error}
                      </div>
                    )}
                    
                    {/* No artifacts found - Using appointment style */}
                    {!loading && !error && filteredArtifacts.length === 0 && (
                      <div className="min-w-[94rem] h-full py-16 flex justify-center items-center border-b-1 border-gray-400">
                        <div className="text-2xl  text-gray-500 flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl mb-4"></i>
                          <p>No artifact data available</p>
                          <p className="text-lg mt-2">Try adjusting your filters or search criteria</p>
                          
                        </div>
                      </div>
                    )}
                    
                    {/* Artifact rows */}
                    {!loading && !error && filteredArtifacts.length > 0 && filteredArtifacts.map((artifact) => (
                      <div  
                        key={artifact.id}
                        onClick={() => openArtifactView(artifact)}
                        className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-6 justify-between cursor-pointer hover:bg-gray-300"
                      >
                        <div className="px-4 pt-1 pb-3 border-b border-gray-400 col-span-1">
                          <span>{formatDate(artifact.creation_date || artifact.upload_date)}</span>
                        </div>
                        <div className="px-4 pt-1 pb-3 border-b border-gray-400 col-span-2">
                          <span>{safeGet(artifact, 'artifact_creator', 'Unknown Creator')}</span>
                        </div>
                        <div className="px-4 pt-1 pb-3 border-b border-gray-400 col-span-1">
                          <span>{safeGet(artifact, 'artifact_type', 'Unknown Type').replace(/\b\w/g, (char) => char.toUpperCase())}</span>
                        </div>
                        <div className="px-4 py-4 border-b border-gray-400 col-span-1">
                          <span className={`text-white ${getStatusBadgeClass(artifact.display_status)}  rounded-md px-4 py-1`}>
                            {safeGet(artifact, 'display_status', 'Unknown').replace(/\b\w/g, (char) => char.toUpperCase())}
                          </span>
                        </div>
                        <div className="px-4 py-4 border-b border-gray-400 col-span-1">
                          <span>{formatDate(artifact.modified_date || artifact.upload_date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </>
            )}

            </>)}
          </>)}
        </div>
      </div>
      
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={hideToast}
      />
    </>
  )
}

export default Artifact
