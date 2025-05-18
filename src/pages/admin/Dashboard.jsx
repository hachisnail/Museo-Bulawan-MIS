import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/navbar/AdminNav';
import axios from 'axios';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Consolidated state for all dashboard data
  const [dashboardData, setDashboardData] = useState({
    visitors: {
      expected: 0,
      present: 0,
      presentPercentage: 0,
    },
    monthly: {
      current: {
        present: 0,
        absent: 0
      },
      previous: {
        present: 0,
        absent: 0
      }
    },
    appointmentRate: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      counts: Array(12).fill(0)
    },
    visits: {
      approved: {
        total: 0,
        today: 0,
        thisMonth: 0
      },
      pending: {
        total: 0,
        today: 0,
        thisMonth: 0
      }
    },
    quota: {
      targetVisitors: 1000,
      currentVisitors: 0,
      percentage: 0
    },
    pendingQueries: []
  });

  // Utility functions
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getChangeIcon = (current, previous) => {
    if (current === previous) return "";
    return current > previous ?
      <i className="fa-solid fa-arrow-up"></i> :
      <i className="fa-solid fa-arrow-down"></i>;
  };


  // Fetch all dashboard data in one function
  const fetchDashboardData = async () => {
    try {
      // const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;

      // if (!token) {
      //   console.error('No authentication token found');
      //   return;
      // }

      // Get current date information for filtering
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-11

      // Format dates for API calls
      const todayFormatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const monthFormatted = `${firstDayOfMonth.getFullYear()}-${String(firstDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}`;

      // Make parallel API calls for better performance
      const [
        visitorStatsResponse,
        todayStatsResponse,
        monthStatsResponse,
        appointmentsResponse
      ] = await Promise.all([
        axios.get(`${API_URL}/api/auth/appointment/stats`, { withCredentials: true }),
        axios.get(`${API_URL}/api/auth/appointment/stats?date=${todayFormatted}`, { withCredentials: true }),
        axios.get(`${API_URL}/api/auth/appointment/stats?date=${monthFormatted}`, { withCredentials: true }),
        axios.get(`${API_URL}/api/auth/appointment`, { withCredentials: true })
      ]);

      // Process all appointments for various statistics
      const appointments = appointmentsResponse.data;

      // 1. Process visitor stats
      const expectedVisitors = visitorStatsResponse.data.expectedVisitors || 0;
      const presentVisitors = visitorStatsResponse.data.present || 0;
      const presentPercentage = expectedVisitors > 0 ? Math.round((presentVisitors / expectedVisitors) * 100) : 0;

      // 2. Process monthly comparison data
      const currentMonthData = { present: 0, expected: 0 };
      const previousMonthData = { present: 0, expected: 0 };

      appointments.forEach(appointment => {
        if (!appointment.creation_date) return;

        const appDate = new Date(appointment.creation_date);
        const appMonth = appDate.getMonth();
        const appYear = appDate.getFullYear();

        const expectedCount = appointment.population_count || 0;
        const presentCount = appointment.AppointmentStatus?.present_count || 0;

        // Current month data
        if (appMonth === currentMonth && appYear === currentYear) {
          currentMonthData.expected += expectedCount;
          currentMonthData.present += presentCount;
        }

        // Previous month data
        const prevMonth = currentMonth > 0 ? currentMonth - 1 : 11;
        const prevYear = currentMonth > 0 ? currentYear : currentYear - 1;

        if (appMonth === prevMonth && appYear === prevYear) {
          previousMonthData.expected += expectedCount;
          previousMonthData.present += presentCount;
        }
      });

      // 3. Process appointment rate data (monthly counts for the current year)
      const monthlyCounts = Array(12).fill(0);

      appointments.forEach(appointment => {
        if (appointment.creation_date) {
          const date = new Date(appointment.creation_date);
          if (date.getFullYear() === currentYear) {
            const month = date.getMonth(); // 0-11
            monthlyCounts[month]++;
          }
        }
      });

      // 4. Process visit stats (approved and pending)
      // Count pending visits (TO_REVIEW status)
      const allPending = appointments.filter(appt =>
        !appt.AppointmentStatus?.status ||
        appt.AppointmentStatus.status.toUpperCase() === 'TO_REVIEW'
      ).length;

      // Count today's pending
      const todayPending = appointments.filter(appt => {
        if (!appt.creation_date) return false;
        const apptDate = new Date(appt.creation_date);
        return (
          apptDate.getDate() === currentDate.getDate() &&
          apptDate.getMonth() === currentMonth &&
          apptDate.getFullYear() === currentYear &&
          (!appt.AppointmentStatus?.status || appt.AppointmentStatus.status.toUpperCase() === 'TO_REVIEW')
        );
      }).length;

      // Count this month's pending
      const monthPending = appointments.filter(appt => {
        if (!appt.creation_date) return false;
        const apptDate = new Date(appt.creation_date);
        return (
          apptDate.getMonth() === currentMonth &&
          apptDate.getFullYear() === currentYear &&
          (!appt.AppointmentStatus?.status || appt.AppointmentStatus.status.toUpperCase() === 'TO_REVIEW')
        );
      }).length;

      // 5. Process quota stats
      let yearlyVisitorCount = 0;
      appointments.forEach(appointment => {
        if (appointment.creation_date) {
          const appDate = new Date(appointment.creation_date);
          if (appDate.getFullYear() === currentYear) {
            if (appointment.AppointmentStatus?.status?.toUpperCase().includes('CONFIRM') ||
              appointment.AppointmentStatus?.status?.toUpperCase().includes('COMPLET')) {
              yearlyVisitorCount += appointment.AppointmentStatus.present_count || appointment.population_count || 0;
            }
          }
        }
      });

      const targetVisitors = 1000;
      const quotaPercentage = Math.min(100, Math.round((yearlyVisitorCount / targetVisitors) * 100));

      // 6. Process pending queries for the list
      const pendingQueries = appointments
        .filter(appt =>
          !appt.AppointmentStatus?.status ||
          appt.AppointmentStatus.status.toUpperCase() === 'TO_REVIEW'
        )
        .slice(0, 5)
        .map(appt => ({
          id: appt.appointment_id,
          name: `${appt.Visitor?.first_name || ''} ${appt.Visitor?.last_name || ''}`,
          date: appt.creation_date ? new Date(appt.creation_date).toLocaleDateString() : 'N/A',
          purpose: appt.purpose_of_visit,
          visitors: appt.population_count
        }));

      // Update all dashboard data at once
      setDashboardData({
        visitors: {
          expected: expectedVisitors,
          present: presentVisitors,
          presentPercentage: presentPercentage
        },
        monthly: {
          current: {
            present: currentMonthData.present,
            absent: currentMonthData.expected - currentMonthData.present
          },
          previous: {
            present: previousMonthData.present,
            absent: previousMonthData.expected - previousMonthData.present
          }
        },
        appointmentRate: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          counts: monthlyCounts
        },
        visits: {
          approved: {
            total: visitorStatsResponse.data.approved || 0,
            today: todayStatsResponse.data.approved || 0,
            thisMonth: monthStatsResponse.data.approved || 0
          },
          pending: {
            total: allPending || 0,
            today: todayPending || 0,
            thisMonth: monthPending || 0
          }
        },
        quota: {
          targetVisitors: targetVisitors,
          currentVisitors: yearlyVisitorCount,
          percentage: quotaPercentage
        },
        pendingQueries: pendingQueries
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  // Single useEffect to fetch all data
  useEffect(() => {
    fetchDashboardData();
  }, []); // Run once on component mount

  // Chart configurations
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    }
  };

  const donutData = {
    labels: ['Present Visitors', 'Others'],
    datasets: [
      {
        data: [
          dashboardData.visitors.present,
          dashboardData.visitors.expected - dashboardData.visitors.present
        ],
        backgroundColor: ['#3E2D1C', '#CFC3B5'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: dashboardData.appointmentRate.labels,
    datasets: [
      {
        label: 'Appointments',
        data: dashboardData.appointmentRate.counts,
        backgroundColor: '#3E2D1C',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        {/* Sidebar */}
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className='w-full min-h-full h-full p-7 overflow-scroll'>

          {/* TOP ROW */}
          <div className='w-full flex flex-col xl:flex-row h-1/2 '>

            {/* -- Expected Visitors + (present/absent boxes) -- */}
            <div className="xl:w-1/2 w-full flex gap-x-2 p-2 sm:h-full h-1/2">
              <div className="shadow-lg shadow-gray-600 h-full min-w-[16rem] sm:min-w-[20rem] md:min-w-[25rem] lg:min-w-[30rem] xl:min-w-[35rem] rounded-lg bg-white flex flex-col p-4 gap-2 sm:gap-3 md:gap-4">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-semibold text-center">
                  Expected Visitors
                </span>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl text-center">
                  {dashboardData.visitors.expected}
                </span>
                <div className="flex-1 flex flex-col justify-center items-center">
                  {/* Donut Chart container */}
                  <div className="relative sm:w-full sm:h-full w-[80%] h-[80%]">
                    <Doughnut data={donutData} options={donutOptions} />
                    {/* Centered Text in Donut */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest">
                        {dashboardData.visitors.presentPercentage}%
                      </span>
                      <span className="text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-2xl mt-2">
                        Present Visitors
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Present, Absent, etc. */}
              <div className='w-full flex-col px-2 gap-y-4 flex h-full'>
                <div className='shadow-lg shadow-gray-600 flex flex-col w-full h-full px-2 xl:px-5 py-2 xl:py-8 rounded-lg bg-black'>
                  <span className='text-xm xl:text-4xl text-white font-bold'>Present</span>
                  <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-fit h-fit flex gap-x-2 items-end'>
                      <span className='text-xl xl:text-6xl text-white font-bold'>
                        {dashboardData.monthly.current.present}
                      </span>
                      <span className={`${parseFloat(calculatePercentageChange(dashboardData.monthly.current.present, dashboardData.monthly.previous.present)) > 0 ? 'text-[#D5FFCB]' : 'text-[#FF9B9B]'} text-xs xl:text-2xl`}>
                        {Math.abs(calculatePercentageChange(dashboardData.monthly.current.present, dashboardData.monthly.previous.present))}%
                        {getChangeIcon(dashboardData.monthly.current.present, dashboardData.monthly.previous.present)}
                      </span>
                    </div>
                  </div>
                  <span className='text-sm xl:text-2xl text-[#EAC39C]'>
                    Compared to last month ({dashboardData.monthly.previous.present})
                  </span>
                </div>

                <div className='shadow-lg shadow-gray-600 flex flex-col w-full h-full px-2 xl:px-5 py-2 xl:py-8 rounded-lg bg-black'>
                  <span className='text-xm xl:text-4xl text-white font-bold'>Absent</span>
                  <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-fit h-fit flex gap-x-2 items-end'>
                      <span className='text-xl xl:text-6xl text-white font-bold'>
                        {dashboardData.monthly.current.absent}
                      </span>
                      <span className={`${parseFloat(calculatePercentageChange(dashboardData.monthly.current.absent, dashboardData.monthly.previous.absent)) < 0 ? 'text-[#D5FFCB]' : 'text-[#FF9B9B]'} text-xs xl:text-2xl`}>
                        {Math.abs(calculatePercentageChange(dashboardData.monthly.current.absent, dashboardData.monthly.previous.absent))}%
                        {getChangeIcon(dashboardData.monthly.current.absent, dashboardData.monthly.previous.absent)}
                      </span>
                    </div>
                  </div>
                  <span className='text-sm xl:text-2xl text-[#EAC39C]'>
                    Compared to last month ({dashboardData.monthly.previous.absent})
                  </span>
                </div>
              </div>

            </div>

            {/* -- Appointment Rate -- */}
            <div className="xl:w-1/2 w-full p-2 sm:h-full h-1/2">
              <div className='shadow-lg shadow-gray-600  w-full h-full rounded-lg bg-[#1C1B19] flex flex-col p-5 gap-3 md:gap-6 md:p-10'>
                <span className='text-3xl font-bold text-white md:text-5xl'>Appointment Rate</span>
                <div className='bg-white h-full w-full rounded-xl p-3 md:p-6'>
                  {/* Bar chart here */}
                  <div className='w-full sm:h-full h-[8rem]'>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className='w-full flex flex-col xl:flex-row h-1/2 '>
            <div className="xl:w-1/2 w-ful gap-x-2 flex p-2 sm:h-full h-1/2">
              <div className='w-full flex  h-full'>
                {/* Approved Visits and pending this boxes was all datas about*/}
                <div className='min-w-[8rem] lg:min-w-[16rem] flex flex-col p-2 gap-y-2 h-full'>
                  <div className='shadow-lg shadow-gray-600 flex flex-col h-1/2 w-full rounded-lg bg-[#1C1B19] p-2 xl:p-4'>
                    <span className='text-white font-bold text-[8px] xl:text-2xl'>Approved Visits</span>
                    <div className='w-full h-full flex items-center justify-center'>
                      <span className='font-bold text-white text-3xl xl:text-8xl'>{dashboardData.visits.approved.total}</span>
                    </div>
                  </div>
                  <div className='shadow-lg shadow-gray-600 flex flex-col h-1/2 w-full rounded-lg bg-[#1C1B19] p-2 xl:p-4'>
                    <span className='text-white font-bold text-[8px] xl:text-2xl'>Pending Visits</span>
                    <div className='w-full h-full flex items-center justify-center'>
                      <span className='font-bold text-white text-3xl xl:text-8xl'>{dashboardData.visits.pending.total}</span>
                    </div>
                  </div>
                </div>

                {/* Quota boxes */}
                <div className='w-full flex flex-col p-2 gap-y-2 h-full'>
                  {/* This part is connected to approved visits */}
                  <div className='h-1/2 pt-4 pr-4 w-full'>
                    <div className='shadow-lg shadow-gray-600 flex p-2 xl:p-4 w-full h-full rounded-lg bg-[#EFEEDE]'>
                      <div className="min-w-[4rem] sm:min-w-[9rem] flex-col flex h-full p-2">
                        <span className='text-lg xl:text-4xl font-bold'>Today</span>
                        <div className='w-full h-full flex items-center justify-center overflow-clip'>
                          <span className='text-2xl xl:text-8xl font-semibold'>{dashboardData.visits.approved.today}</span>
                        </div>
                      </div>

                      <div className='w-full h-full pt-4 xl:pt-10'>
                        <div className="w-full h-full flex flex-col bg-black rounded-lg p-2">
                          <span className='text-[#EAC39C] text-xs xl:text-xl font-semibold'>This Month</span>
                          <div className='w-full h-full flex items-center justify-center'>
                            <span className='text-[#EAC39C] text-lg xl:text-8xl font-semibold'>{dashboardData.visits.approved.thisMonth}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* This part is connected to pending visits */}
                  <div className='h-1/2 pt-4 pr-4 w-full'>
                    <div className='shadow-lg shadow-gray-600 flex p-2 xl:p-4 w-full h-full rounded-lg bg-[#EFEEDE]'>
                      <div className="min-w-[4rem] sm:min-w-[9rem] flex-col flex h-full p-2">
                        <span className='text-lg xl:text-4xl font-bold'>Today</span>
                        <div className='w-full h-full flex items-center justify-center overflow-clip'>
                          <span className='text-2xl xl:text-8xl font-semibold'>{dashboardData.visits.pending.today}</span>
                        </div>
                      </div>
                      <div className='w-full h-full pt-4 xl:pt-10'>
                        <div className="w-full h-full flex flex-col bg-black rounded-lg p-2">
                          <span className='text-[#EAC39C] text-xs xl:text-xl font-semibold'>This Month</span>
                          <div className='w-full h-full flex items-center justify-center'>
                            <span className='text-[#EAC39C] text-lg xl:text-8xl font-semibold'>{dashboardData.visits.pending.thisMonth}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quota animation */}
              <div className='min-w-[12rem] md:min-w-[20rem] lg:min-w-[23rem] px-2 h-full'>
                <div className='w-full h-full rounded-lg bg-black shadow-lg shadow-gray-600 flex flex-col gap-y-6 p-6'>
                  <div className='w-full flex justify-between h-auto'>
                    <span className='text-white text-xl sm:text-2xl font-semibold'>Quota</span>
                    <span className='text-[#EAC39C] text-xl sm:text-2xl font-semibold'>{dashboardData.quota.percentage}%</span>
                  </div>
                  <div className="relative w-full h-full bg-white rounded-lg flex flex-col justify-start items-start overflow-hidden">
                    <div className="w-full h-[32%] p-2 z-10">
                      <span>{dashboardData.quota.targetVisitors}</span>
                    </div>
                    <div className="relative w-full h-[68%] text-white flex items-center justify-center z-10 font-bold text-3xl">
                      <span className="absolute">{dashboardData.quota.currentVisitors}</span>
                      <svg
                        className="absolute top-0 left-0 w-full h-full"
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                        style={{
                          transform: `translateY(${100 - dashboardData.quota.percentage}%)`,
                          transition: 'transform 1s ease-in-out'
                        }}
                      >
                        <path
                          fill="#0066FF"
                          d="M0,30 C150,0 350,60 500,30 L500,150 L0,150 Z"
                        >
                          <animate
                            attributeName="d"
                            dur="4s"
                            repeatCount="indefinite"
                            values="
                M0,30 C150,0 350,60 500,30 L500,150 L0,150 Z;
                M0,20 C150,40 350,-20 500,20 L500,150 L0,150 Z;
                M0,30 C150,0 350,60 500,30 L500,150 L0,150 Z
              "
                          />
                        </path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom-right elements (Pending Queries, Walk-Ins, etc.) */}
            <div className="xl:w-1/2 w-full gap-x-6 flex p-5 sm:h-full h-1/2">
              <div className='w-1/2 h-full'>
                <div className='w-full shadow-lg shadow-gray-600 p-4 flex-col flex h-full '>
                  <div
                    className='w-full px-2 flex justify-between items-center py-2 h-auto border-b-2 cursor-pointer'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <span className='text-lg sm:text-3xl font-semibold'>Pending Queries</span>
                    <i className={`fa-solid fa-arrow-${isCollapsed ? 'up' : 'down'} text-sm sm:text-4xl cursor-pointer`}></i>
                  </div>

                  {/* List of pending queries */}
                  <div className={`flex-1 flex flex-col overflow-y-auto ${isCollapsed ? 'hidden' : 'block'}`}>
                    {dashboardData.pendingQueries.length > 0 ? (
                      dashboardData.pendingQueries.map((query) => (
                        <div key={query.id} className="border-b border-gray-200 py-3 px-2 hover:bg-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">{query.name}</span>
                            <span className="text-gray-500 text-sm">{query.date}</span>
                          </div>
                          <div className="mt-1 text-gray-700">{query.purpose}</div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span className="bg-gray-200 px-2 py-1 rounded">{query.visitors} visitors</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <i className="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
                        <p className="text-gray-500">No pending queries!</p>
                      </div>
                    )}

                    {dashboardData.pendingQueries.length > 0 && (
                      <div className="mt-auto p-2 text-center">
                        <a
                          href="/admin/appointment"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View all pending requests ({dashboardData.visits.pending.total})
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              <div className='w-1/2 flex flex-col justify-around h-full p-2'>
                <span className='text-2xl sm:text-6xl font-semibold'>Walk-Ins</span>
                <div className='w-full h-fit gap-y-4 flex flex-col'>
                  <button
                    onClick={() => {
                      window.open("/appointment", "appointmentTab");
                    }}
                    className='cursor-pointer shadow-lg shadow-gray-600 w-full flex items-center justify-between px-5 sm:px-10 border-3 rounded-lg h-[4rem] sm:h-[8rem]'
                  >
                    <span className='sm:text-4xl text-2xl font-semibold'>Appointment</span>
                    <i className="fa-regular fa-square-plus text-2xl sm:text-5xl"></i>
                  </button>



                  <button className='cursor-pointer shadow-lg shadow-gray-600 w-full flex items-center justify-between px-5 sm:px-10 border-3 rounded-lg h-[4rem] sm:h-[8rem]'>
                    <span className='sm:text-4xl text-2xl font-semibold'>Donation</span>
                    <i className="fa-regular fa-square-plus text-2xl sm:text-5xl"></i>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
