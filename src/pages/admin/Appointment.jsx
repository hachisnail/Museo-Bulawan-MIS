import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNav from '../../components/navbar/AdminNav'
import CustomDatePicker from '../../components/function/CustomDatePicker'
import { connectWebSocket, closeWebSocket } from '../../utils/websocket'
import { AppointmentModal } from '../../components/modals/AppointmentModal'
import Toast from '../../components/function/Toast';

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [columnFilter, setColumnFilter] = useState('')
  const [attendanceModalData, setAttendanceModalData] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [visitorRecordModalData, setVisitorRecordModalData] = useState(null);
  const [showVisitorRecordModal, setShowVisitorRecordModal] = useState(false);
  const [filteredData, setFilteredData] = useState({
    appointments: [],
    attendanceData: [],
    visitorRecords: []
  })

  // Stats from backend
  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    completed: 0,
    failed: 0,
    expectedVisitors: 0,
    present: 0
  })

  // Track the currently active tab
  const [activeTab, setActiveTab] = useState('forms')

  // Track which visitor record row is expanded
  const [expandedRecordId, setExpandedRecordId] = useState(null)

  // State for visitor records and attendance data
  const [visitorRecords, setVisitorRecords] = useState([])
  const [attendanceData, setAttendanceData] = useState([])

  // State for attendance popup
  const [showAttendancePopup, setShowAttendancePopup] = useState(false)
  const [attendancePopupData, setAttendancePopupData] = useState(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  // Toast message

  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Add this function to show toast with different types
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

  const token = localStorage.getItem('token')
  const API_URL = import.meta.env.VITE_API_URL

  /**
   * Format date to YYYY-MM-DD for API requests
   */
  const formatDateForAPI = (date) => {
    if (!date) return null;                  // if no date is selected
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;     // if the date is invalid
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  /**
   * Format date for display in the UI
   */
  const formatDateForDisplay = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }


  // Add these functions to your Appointment.jsx component

  // Function to fetch attendance detail from backend
  const fetchAttendanceDetail = async (appointmentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/auth/attendance/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance detail:', error);
      showToast('Error fetching attendance details', 'error');
      return null;
    }
  };

  // Function to fetch visitor record detail from backend
  const fetchVisitorRecordDetail = async (visitorId, appointmentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/auth/visitor-record/${visitorId}/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching visitor record detail:', error);
      return null;
    }
  };

  // Update the handleAttendanceRowClick function
  const handleAttendanceRowClick = async (row, e) => {
    // Only proceed if we have an appointment ID
    if (!row.appointment_id) {
      console.error('No appointment ID found for this attendance record');
      showToast('Cannot find appointment details', 'error');
      return;
    }

    // Get detailed data from backend
    const detailData = await fetchAttendanceDetail(row.appointment_id);

    if (!detailData) {
      showToast('Failed to load attendance details', 'error');
      return;
    }

    // Set data for the modal
    setAttendanceModalData(detailData);
    setShowAttendanceModal(true);
    setShowAttendancePopup(false); // Close the popup if it's open
  };

  // Update the handleVisitorDetailClick function for visitor records
  const handleVisitorDetailClick = async (detail, record) => {
    // Make sure we have the necessary IDs
    if (!record.id || !detail.appointment_id) {
      console.error('Missing visitor ID or appointment ID');
      showToast('Cannot find visitor details', 'error');
      return;
    }

    // Get detailed data from backend
    const detailData = await fetchVisitorRecordDetail(record.id, detail.appointment_id);

    if (!detailData) {
      showToast('Failed to load attendance details', 'error');
      return;
    }

    // Set data for the modal
    setVisitorRecordModalData(detailData);
    setShowVisitorRecordModal(true);
  };

  // Add this function for attendance tab clicks


  /**
   * Standardize status naming - convert any status to the consistent format
   * e.g., "TO_REVIEW" or "to_review" -> "To Review"
   */
  const standardizeStatus = (status) => {
    if (!status) return "To Review"

    // Convert to lowercase and remove underscores
    const formatted = status.toLowerCase().replace(/_/g, ' ')

    // Capitalize first letter of each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Get styled status label with unique colors for each status
   */
  const getStatusLabel = (status) => {
    const standardStatus = standardizeStatus(status)
    let bgColor = 'bg-gray-200'
    let textColor = 'text-gray-800'

    switch (standardStatus.toLowerCase()) {
      case 'confirmed':
        bgColor = 'bg-green-500'
        textColor = 'text-white'
        break
      case 'rejected':
        bgColor = 'bg-red-600'
        textColor = 'text-white'
        break
      case 'failed':
        bgColor = 'bg-orange-600'
        textColor = 'text-white'
        break
      case 'to review':
        bgColor = 'bg-purple-200'
        textColor = 'text-black'
        break
      case 'completed':
        bgColor = 'bg-blue-600'
        textColor = 'text-white'
        break
    }

    // Add these classes to ensure consistent height and width
    bgColor += ' h-9 w-30 flex items-center justify-center'


    return (
      <span className={`${bgColor} ${textColor} px-2 py-1 rounded inline-flex items-center justify-center`}>
        {standardStatus}
      </span>
    )
  }

  /**
   * Toggle visitor record row expansion
   */
  const toggleRecordExpansion = (id) => {
    if (expandedRecordId === id) {
      setExpandedRecordId(null) // collapse if already expanded
    } else {
      setExpandedRecordId(id) // expand this row
    }
  }

  /**
   * Fetch visitor records from the backend with date filter
   */
  const fetchVisitorRecords = async () => {
    try {
      // Use the same date filtering pattern as appointments
      let url = `${API_URL}/api/auth/visitor-records`;

      // Only apply date filtering if selectedDate is not null
      if (selectedDate) {
        const dateParam = formatDateForAPI(selectedDate);
        if (dateParam) {
          url += `?date=${dateParam}`;
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVisitorRecords(response.data);
    } catch (error) {
      console.error('Error fetching visitor records:', error);
    }
  };

  /**
   * Fetch appointments from the backend with date filter
   */
  /**
 * Fetch appointments from the backend with date filter
 */
  // Change fetchAppointments to not use date filtering on first load
  const fetchAppointments = async () => {
    try {
      // For the initial load, don't apply date filtering
      // Only filter if a date is specifically selected
      let url = `${API_URL}/api/auth/appointment`;

      // Only apply date filtering if selectedDate is not null and has been explicitly set
      if (selectedDate) {
        const dateParam = formatDateForAPI(selectedDate);
        if (dateParam) {
          url += `?date=${dateParam}`;
        }
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };




  /**
   * Fetch attendance data with date filter
   */
  const fetchAttendanceData = async () => {
    try {
      // Use the same date filtering pattern as appointments
      let url = `${API_URL}/api/auth/attendance`;

      // Only apply date filtering if selectedDate is not null
      if (selectedDate) {
        const dateParam = formatDateForAPI(selectedDate);
        if (dateParam) {
          url += `?date=${dateParam}`;
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  /**
   * Fetch stats from the backend with date filter
   */
  const fetchStats = async () => {
    try {
      // Only use date parameter if selectedDate is not null
      let url = `${API_URL}/api/auth/appointment/stats`;
      if (selectedDate) {
        const dateParam = formatDateForAPI(selectedDate);
        if (dateParam) {
          url += `?date=${dateParam}`;
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }


  /**
   * Update appointment status in the backend
   */
  const updateAppointmentStatus = async (appointmentId, newStatus, presentCount = undefined) => {
    try {
      const requestData = { status: newStatus };

      // If presentCount is provided, include it in the request
      if (presentCount !== undefined) {
        requestData.present_count = presentCount;
      }

      await axios.patch(
        `${API_URL}/api/auth/appointment/${appointmentId}/status`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast(`Message sent to ${modalData?.email || 'visitor'}`, 'success');
      console.log(`Appointment ${appointmentId} updated to: ${newStatus}`);
      fetchAppointments();
      fetchStats();
      fetchAttendanceData();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  }

  /**
   * Handle date change - refresh all data with the new date filter
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      showToast(`Filtering data for ${formatDateForDisplay(date)}`, 'info');
    } else {
      showToast('Showing all dates', 'info');
    }
  };

  /**
   * useEffect: Initial data + websocket
   */
  useEffect(() => {
    fetchAppointments();
    fetchStats();
    fetchAttendanceData();
    fetchVisitorRecords();

    const handleDataChange = () => {
      console.log('WebSocket: Data changed, refreshing...');
      fetchAppointments();
      fetchStats();
      fetchAttendanceData();
      fetchVisitorRecords();
    }

    const handleRefresh = () => {
      console.log('WebSocket: Refresh command received, refreshing...');
      fetchAppointments();
      fetchStats();
      fetchAttendanceData();
      fetchVisitorRecords();
    }

    connectWebSocket(handleDataChange, handleRefresh);
    return () => {
      closeWebSocket();
    }
  }, []);

  /**
   * useEffect: Refresh data when selected date changes
   */
  useEffect(() => {
    fetchAppointments();
    fetchStats();
    fetchAttendanceData();
    fetchVisitorRecords();
  }, [selectedDate]);

  /**
   * useEffect: Fetch data based on active tab
   */
  useEffect(() => {
    if (activeTab === 'forms') {
      fetchAppointments();
      fetchStats();
    } else if (activeTab === 'attendance') {
      fetchAttendanceData();
      fetchStats();
    } else if (activeTab === 'visitorRecords') {
      fetchVisitorRecords();
    }
  }, [activeTab]);

  // Add to the existing useEffect that handles filtering and sorting
  // Add this useEffect to fix visitor records tab data not showing on first load
  useEffect(() => {
    if (activeTab === 'forms') {
      let filtered = [...appointments];

      // Apply search filtering if needed
      if (searchQuery) {
        filtered = filtered.filter(appt =>
          (appt.Visitor?.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (appt.Visitor?.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (appt.preferred_time || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (appt.AppointmentStatus?.status || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filtering if needed
      if (statusFilter !== "All Statuses") {
        filtered = filtered.filter(appt => {
          const status = standardizeStatus(appt.AppointmentStatus?.status || 'To Review');
          return status === statusFilter;
        });
      }

      // Apply column filtering and sorting
      if (columnFilter) {
        switch (columnFilter) {
          case 'creation_date':
            filtered = filtered.sort((a, b) => {
              const result = new Date(a.creation_date) - new Date(b.creation_date);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'visitor_name':
            filtered = filtered.sort((a, b) => {
              const result = `${a.Visitor?.last_name} ${a.Visitor?.first_name}`.localeCompare(`${b.Visitor?.last_name} ${b.Visitor?.first_name}`);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'preferred_time':
            filtered = filtered.sort((a, b) => {
              const result = a.preferred_time.localeCompare(b.preferred_time);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'visitor_count':
            filtered = filtered.sort((a, b) => {
              const result = (a.population_count || 0) - (b.population_count || 0);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'status':
            filtered = filtered.sort((a, b) => {
              const statusA = standardizeStatus(a.AppointmentStatus?.status || 'To Review');
              const statusB = standardizeStatus(b.AppointmentStatus?.status || 'To Review');
              const result = statusA.localeCompare(statusB);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'updated_at':
            filtered = filtered.sort((a, b) => {
              const dateA = a.AppointmentStatus?.updated_at ? new Date(a.AppointmentStatus.updated_at) : new Date(0);
              const dateB = b.AppointmentStatus?.updated_at ? new Date(b.AppointmentStatus.updated_at) : new Date(0);
              const result = dateA - dateB;
              return sortDirection === 'asc' ? result : -result;
            });
            break;
        }
      }

      setFilteredData(prev => ({ ...prev, appointments: filtered }));

    } else if (activeTab === 'attendance') {
      let filtered = [...attendanceData];

      // Apply search filtering if needed
      if (searchQuery) {
        filtered = filtered.filter(record =>
          record.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.purpose?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply column filtering and sorting
      if (columnFilter) {
        switch (columnFilter) {
          case 'date':
            filtered = filtered.sort((a, b) => {
              const result = new Date(a.date) - new Date(b.date);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'visitor_name':
            filtered = filtered.sort((a, b) => {
              const result = a.visitorName.localeCompare(b.visitorName);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'purpose':
            filtered = filtered.sort((a, b) => {
              const result = a.purpose.localeCompare(b.purpose);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'preferred_date':
            filtered = filtered.sort((a, b) => {
              const result = new Date(a.preferredDate) - new Date(b.preferredDate);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'expected_visitor':
            filtered = filtered.sort((a, b) => {
              const result = parseInt(a.expectedVisitor || 0) - parseInt(b.expectedVisitor || 0);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'present':
            filtered = filtered.sort((a, b) => {
              const presentA = a.present === 'ongoing' ? 0 : parseInt(a.present || 0);
              const presentB = b.present === 'ongoing' ? 0 : parseInt(b.present || 0);
              const result = presentA - presentB;
              return sortDirection === 'asc' ? result : -result;
            });
            break;
        }
      }

      setFilteredData(prev => ({ ...prev, attendanceData: filtered }));

    } else if (activeTab === 'visitorRecords') {
      // Important: This is the missing part that wasn't correctly implemented
      let filtered = [...visitorRecords];

      // Apply search filtering if needed
      if (searchQuery) {
        filtered = filtered.filter(record =>
          record.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (record.date && record.date.toString().toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Apply column filtering and sorting
      if (columnFilter) {
        switch (columnFilter) {
          case 'date':
            filtered = filtered.sort((a, b) => {
              const dateA = a.date ? new Date(a.date) : new Date(0);
              const dateB = b.date ? new Date(b.date) : new Date(0);
              const result = dateA - dateB;
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'visitor_name':
            filtered = filtered.sort((a, b) => {
              const result = (a.visitorName || '').localeCompare(b.visitorName || '');
              return sortDirection === 'asc' ? result : -result;
            });
            break;
          case 'visit_counts':
            filtered = filtered.sort((a, b) => {
              const result = (a.visitCount || 0) - (b.visitCount || 0);
              return sortDirection === 'asc' ? result : -result;
            });
            break;
        }
      }

      setFilteredData(prev => ({ ...prev, visitorRecords: filtered }));
    }
  }, [searchQuery, statusFilter, columnFilter, sortDirection, activeTab, appointments, attendanceData, visitorRecords]);

  // Also add this useEffect to initialize filteredData whenever source data changes
  useEffect(() => {
    // Initialize filteredData with raw data whenever the source data changes
    if (visitorRecords.length > 0) {
      setFilteredData(prev => ({ ...prev, visitorRecords: [...visitorRecords] }));
    }
    if (attendanceData.length > 0) {
      setFilteredData(prev => ({ ...prev, attendanceData: [...attendanceData] }));
    }
    if (appointments.length > 0) {
      setFilteredData(prev => ({ ...prev, appointments: [...appointments] }));
    }
  }, [visitorRecords, attendanceData, appointments]);





  /**
   * Show the modal when a row is clicked
   */
  const handleRowClick = (appt) => {
    if (!appt || !appt.Visitor) return

    setModalData({
      appointmentId: appt.appointment_id,
      dateSent: appt.creation_date
        ? new Date(appt.creation_date).toLocaleString()
        : 'N/A',

      fromFirstName: appt.Visitor.first_name || 'N/A',
      fromLastName: appt.Visitor.last_name || 'N/A',
      email: appt.Visitor.email || 'N/A',
      phone: appt.Visitor.phone || 'N/A',

      purpose: appt.purpose_of_visit || 'N/A',
      populationCount: appt.population_count || 0,
      preferredDate: appt.preferred_date || 'N/A',
      preferredTime: appt.preferred_time || 'N/A',
      notes: appt.additional_notes || 'N/A',
      organization: appt.Visitor.organization || 'N/A',
      street: appt.Visitor.street || '',
      barangay: appt.Visitor.barangay || '',
      city_municipality: appt.Visitor.city_municipality || '',
      province: appt.Visitor.province || '',

      status: standardizeStatus(appt.AppointmentStatus?.status || 'To Review'),
      updatedAt: appt.AppointmentStatus?.updated_at
        ? new Date(appt.AppointmentStatus.updated_at).toLocaleString()
        : 'N/A'
    })
    setShowModal(true)
  }




  const handleCloseModal = () => {
    setShowModal(false)
    setModalData(null)
  }

  const handleSend = () => {
    showToast(`Message sent to ${modalData?.email || 'visitor'}`, 'success');
    setShowModal(false)
  }

  /**
   * Format date for display (MM-DD-YYYY)
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
  }

  /**
   * Button helper for styling
   */
  const tabButtonStyle = (tabName) => {
    return tabName === activeTab
      ? 'bg-black text-white border-black'
      : 'border-gray-500 text-black'
  }

  return (
    <>
      <div className="w-screen h-screen bg-[#F0F0F0] select-none flex pt-[7rem] overflow-hidden">
        {/* Left Nav */}
        <div className="bg-[#1C1B19] w-auto h-full min-w-[6rem] sm:min-w-auto">
          <AdminNav />
        </div>

        {/* Main content */}
        <div className="w-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-hidden">
          <span className="text-5xl font-semibold">Appointments</span>

          <div className="w-full h-[calc(100%-9rem)] flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5">
            {/* Left panel: Stats + Buttons */}
            <div className="min-w-[34rem] h-full flex flex-col gap-y-7">
              {/* Tab Buttons */}
              <div className="w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex py-2 gap-x-2">
                <button
                  onClick={() => setActiveTab('forms')}
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${tabButtonStyle('forms')}`}
                >
                  <span className="text-2xl font-semibold">Forms</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${tabButtonStyle('attendance')}`}
                >
                  <span className="text-2xl font-semibold">Attendance</span>
                </button>
                <button
                  onClick={() => setActiveTab('visitorRecords')}
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${tabButtonStyle('visitorRecords')}`}
                >
                  <span className="text-2xl font-semibold">Visitor Records</span>
                </button>
              </div>

              {/* Stats */}
              <div className="w-full h-full flex flex-col gap-y-[5rem] overflow-y-auto">
                {/* Total appointments */}
                <div className="bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm">
                  <span className="text-2xl text-white font-semibold">Total Appointments</span>
                  <div className="w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md">
                    <span className="text-2xl text-black font-semibold">
                      {appointments.length}
                    </span>
                  </div>
                </div>

                {/* More stats */}
                <div className="w-full h-auto flex flex-col gap-y-7">
                  <span className="text-2xl font-semibold text-[#727272]">
                    {formatDateForDisplay(selectedDate || new Date())}
                  </span>

                  {/* To Review */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">To Review</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">
                        {appointments.filter(appt =>
                          !appt.AppointmentStatus?.status ||
                          appt.AppointmentStatus?.status.toUpperCase() === 'TO_REVIEW'
                        ).length}
                      </span>
                    </div>
                  </div>

                  {/* Approved/Confirmed */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Approved</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.approved}</span>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Completed</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.completed}</span>
                    </div>
                  </div>

                  {/* Failed */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Failed</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.failed || 0}</span>
                    </div>
                  </div>

                  {/* Rejected */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Rejected</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.rejected}</span>
                    </div>
                  </div>

                  {/* Expected Visitors */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Expected Visitors</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.expectedVisitors}</span>
                    </div>
                  </div>

                  {/* Present */}
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Present</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.present}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tables */}
            <div className="w-full h-full flex flex-col gap-y-7 overflow-x-auto overflow-y-hidden">
              {/* Common controls above table */}
              <div className="min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <CustomDatePicker
                    selected={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                    isClearable={true}
                    placeholderText="Filter by Date"
                    popperPlacement="bottom-start"
                    popperClassName="z-50"
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
                    placeholder="Search History"
                    className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* Sorting Controls */}
                <div className="relative h-full min-w-48">
                  <select
                    className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      // Split the value to get column and direction
                      const [column, direction] = e.target.value.split('|');
                      setColumnFilter(column);
                      setSortDirection(direction || 'asc'); // Default to ascending if no direction
                    }}
                    value={`${columnFilter}|${sortDirection}`}
                  >
                    <option value="">Sort By...</option>

                    {/* Forms tab options */}
                    {activeTab === 'forms' && (
                      <>
                        <option value="creation_date|asc">Creation Date (Oldest First)</option>
                        <option value="creation_date|desc">Creation Date (Newest First)</option>
                        <option value="visitor_name|asc">Visitor Name (A-Z)</option>
                        <option value="visitor_name|desc">Visitor Name (Z-A)</option>
                        <option value="preferred_time|asc">Preferred Time (Earliest First)</option>
                        <option value="preferred_time|desc">Preferred Time (Latest First)</option>
                        <option value="status|asc">Status (A-Z)</option>
                        <option value="status|desc">Status (Z-A)</option>
                        <option value="visitor_count|asc">Visitor Count (Low-High)</option>
                        <option value="visitor_count|desc">Visitor Count (High-Low)</option>
                        <option value="updated_at|asc">Last Updated (Oldest First)</option>
                        <option value="updated_at|desc">Last Updated (Newest First)</option>
                      </>
                    )}

                    {/* Attendance tab options */}
                    {activeTab === 'attendance' && (
                      <>
                        <option value="date|asc">Date (Oldest First)</option>
                        <option value="date|desc">Date (Newest First)</option>
                        <option value="visitor_name|asc">Visitor Name (A-Z)</option>
                        <option value="visitor_name|desc">Visitor Name (Z-A)</option>
                        <option value="purpose|asc">Purpose of Visit (A-Z)</option>
                        <option value="purpose|desc">Purpose of Visit (Z-A)</option>
                        <option value="preferred_date|asc">Preferred Date (Oldest First)</option>
                        <option value="preferred_date|desc">Preferred Date (Newest First)</option>
                        <option value="expected_visitor|asc">Expected Visitors (Low-High)</option>
                        <option value="expected_visitor|desc">Expected Visitors (High-Low)</option>
                        <option value="present|asc">Present Count (Low-High)</option>
                        <option value="present|desc">Present Count (High-Low)</option>
                      </>
                    )}

                    {/* Visitor Records tab options */}
                    {activeTab === 'visitorRecords' && (
                      <>
                        <option value="date|asc">Date (Oldest First)</option>
                        <option value="date|desc">Date (Newest First)</option>
                        <option value="visitor_name|asc">Visitor Name (A-Z)</option>
                        <option value="visitor_name|desc">Visitor Name (Z-A)</option>
                        <option value="visit_counts|asc">Visit Counts (Low-High)</option>
                        <option value="visit_counts|desc">Visit Counts (High-Low)</option>
                      </>
                    )}
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>


                <div className="relative h-full min-w-48">
                  <select
                    className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All Statuses</option>
                    <option>Confirmed</option>
                    <option>Rejected</option>
                    <option>Failed</option>
                    <option>To Review</option>
                    <option>Completed</option>
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
              </div>

              {/* FORMS (Appointments) TABLE */}
              {activeTab === 'forms' && (
                <div className="flex flex-col min-w-[94rem] h-[calc(100%-7rem)]">
                  {/* Table Header - Fixed */}
                  <div className="bg-[#F0F0F0] min-w-[94rem] w-full font-semibold grid grid-cols-6 justify-between mb-7">
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Creation Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Visitor Name
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Preferred Time
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Status
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Visitor Count
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Last Updated
                    </div>
                  </div>

                  {/* Table Data - Scrollable */}
                  <div className="w-full min-w-[94rem] overflow-y-auto h-full border-t-1 border-t-gray-400">
                    {filteredData.appointments.length > 0 ? (
                      filteredData.appointments.map((appt) => {
                        const status = standardizeStatus(appt.AppointmentStatus?.status || 'To Review')
                        const updatedAt = appt.AppointmentStatus?.updated_at
                          ? new Date(appt.AppointmentStatus.updated_at).toLocaleString()
                          : 'N/A'

                        return (
                          <div
                            key={appt.appointment_id}
                            className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-6 cursor-pointer hover:bg-gray-300"
                            onClick={() => handleRowClick(appt)}
                          >
                            <div className="px-4 py-3 border-b-1 border-gray-400">
                              {appt.creation_date
                                ? new Date(appt.creation_date).toLocaleString()
                                : 'N/A'}
                            </div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">
                              {appt.Visitor?.first_name} {appt.Visitor?.last_name}
                            </div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">
                              {appt.preferred_time}
                            </div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">
                              {getStatusLabel(status)}
                            </div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">
                              {appt.population_count}
                            </div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">
                              {updatedAt}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="min-w-[94rem] h-full py-16 flex justify-center items-center border-b-1 border-gray-400">
                        <div className="text-2xl text-gray-500 flex flex-col items-center">
                          <i className="fas fa-inbox text-5xl mb-4"></i>
                          <p>No appointment data available</p>
                          <p className="text-lg mt-2">Try adjusting your filters or search criteria</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ATTENDANCE TABLE */}
              {activeTab === 'attendance' && (
                <div className="flex flex-col min-w-[94rem] h-[calc(100%-7rem)]">
                  {/* Table Header - Fixed */}
                  <div className="bg-[#F0F0F0] min-w-[94rem] w-full font-semibold grid grid-cols-6 justify-between mb-7">
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Visitor Name
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Purpose of Visit
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Preferred Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Expected Visitor
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Present
                    </div>
                  </div>

                  {/* Table Data - Scrollable */}
                  <div className="w-full min-w-[94rem] overflow-y-auto h-full border-t-1 border-t-gray-400">
                    {filteredData.attendanceData.length > 0 ? (
                      filteredData.attendanceData.map((row, i) => {
                        const presentValue = row.present ?? 'ongoing'
                        return (
                          <div
                            key={i}
                            className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-6 hover:bg-gray-300 cursor-pointer"
                            onClick={(e) => handleAttendanceRowClick(row, e)}
                          >
                            <div className="px-4 py-3 border-b-1 border-gray-400">{row.date}</div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">{row.visitorName}</div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">{row.purpose}</div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">{row.preferredDate}</div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">{row.expectedVisitor}</div>
                            <div className="px-4 py-3 border-b-1 border-gray-400">{presentValue}</div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="min-w-[94rem] h-full py-16 flex justify-center items-center border-b-1 border-gray-400">
                        <div className="text-2xl text-gray-500 flex flex-col items-center">
                          <i className="fas fa-calendar-check text-5xl mb-4"></i>
                          <p>No attendance records found</p>
                          <p className="text-lg mt-2">Try adjusting your filters or search criteria</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VISITOR RECORDS TABLE */}
              {activeTab === 'visitorRecords' && (
                <div className="flex flex-col min-w-[94rem] h-[calc(100%-7rem)]">
                  {/* Table Header - Fixed */}
                  <div className="bg-[#F0F0F0] min-w-[94rem] w-full font-semibold grid grid-cols-3 justify-between mb-7">
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2 w-[480px]">
                      Visitors
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      visit counts
                    </div>
                  </div>

                  {/* Table Data - Scrollable */}
                  <div className="w-full min-w-[94rem] overflow-y-auto h-full border-t-1 border-t-gray-400">
                    {filteredData.visitorRecords.length > 0 ? (
                      filteredData.visitorRecords.map((record) => (
                        <React.Fragment key={record.id}>
                          {/* Main Row */}
                          <div
                            className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-3 cursor-pointer hover:bg-gray-300 border-b-1 border-gray-200"
                            onClick={() => toggleRecordExpansion(record.id)}
                          >
                            <div className="px-4 py-4">{formatDate(record.date)}</div>
                            <div className="px-4 py-4">{record.visitorName}</div>
                            <div className="px-4 py-4 flex justify-between items-center">
                              <span>{record.visitCount}</span>
                              <i className={`fas fa-chevron-${expandedRecordId === record.id ? 'up' : 'down'} mr-4 text-gray-500`}></i>
                            </div>
                          </div>

                          {/* Expanded Row with Details */}
                          {expandedRecordId === record.id && (
                            <div className="min-w-[94rem] flex justify-end">
                              <div className="w-[45%] my-4 mr-4 rounded-lg overflow-hidden shadow-sm">
                                {record.details && record.details.length > 0 ? (
                                  <div style={{
                                    maxHeight: record.details.length > 3 ? 'calc(3*3.5rem)' : 'auto',
                                    overflowY: record.details.length > 3 ? 'scroll' : 'visible',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#333 #ccc'
                                  }}>
                                    <table className="w-full border-collapse bg-white">
                                      <thead className="sticky top-0 bg-white z-10">
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Purpose of visit</th>
                                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Visitor Count</th>
                                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Present</th>
                                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                                          <th className="w-10 py-3 px-2 text-right">
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {record.details.map((detail, idx) => {
                                          const detailWithId = {
                                            ...detail,
                                            appointment_id: detail.appointment_id || null
                                          };

                                          return (
                                            <tr key={idx} className={idx !== record.details.length - 1 ? "border-b border-gray-200" : ""}>
                                              <td className="py-3 px-4 text-gray-800">{detail.purpose}</td>
                                              <td className="py-3 px-4 text-center text-gray-800">{detail.visitorCount}</td>
                                              <td className="py-3 px-4 text-center text-gray-800">{detail.present}</td>
                                              <td className="py-3 px-4 text-center text-gray-800">{formatDate(detail.date)}</td>
                                              <td className="py-3 px-2 text-right">
                                                <button
                                                  className="text-blue-500 hover:text-blue-700"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVisitorDetailClick(detailWithId, record);
                                                  }}
                                                >
                                                  <i className="fas fa-eye"></i>
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="p-8 text-center text-gray-500">
                                    No details available for this record.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="min-w-[94rem] h-full py-16 flex justify-center items-center border-b-1 border-gray-400">
                        <div className="text-2xl text-gray-500 flex flex-col items-center">
                          <i className="fas fa-user-clock text-5xl mb-4"></i>
                          <p>No visitor records available</p>
                          <p className="text-lg mt-2">Try adjusting your filters or search criteria</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      // snippet code
      // In Appointment.jsx, pass the showToast function to AppointmentModal
      <AppointmentModal
        showModal={showModal}
        modalData={modalData}
        onClose={handleCloseModal}
        onSend={() => {
          // Only show email sent message for the first phase (To Review)
          if (modalData.status === 'To Review') {
            showToast(`Message sent to ${modalData?.email || 'visitor'}`, 'success');
          } else if (modalData.status === 'Confirmed' && modalData.approveVisit === 'arrive') {
            showToast('Visitor check-in completed', 'success');
          } else if (modalData.status === 'Confirmed' && modalData.approveVisit === 'cancel') {
            showToast('Appointment canceled', 'warning');
          }
          setShowModal(false);
        }}
        updateAppointmentStatus={async (id, status, presentCount) => {
          await updateAppointmentStatus(id, status, presentCount);
          showToast(`Appointment status updated to ${status}`, 'success');
        }}
        showRespondSection={true}
        showToast={showToast}
      />


      <AppointmentModal
        showModal={showAttendanceModal}
        modalData={attendanceModalData}
        onClose={() => setShowAttendanceModal(false)}
        showRespondSection={false}
        showToast={showToast}
      />

      <AppointmentModal
        showModal={showVisitorRecordModal}
        modalData={visitorRecordModalData}
        onClose={() => setShowVisitorRecordModal(false)}
        showRespondSection={false}
        showToast={showToast}
      />


      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={hideToast}
      />
    </>
  )
}

export default Appointment
