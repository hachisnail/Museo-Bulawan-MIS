// Schedule.jsx

import React, { useState } from 'react'
import AdminNav from '../../components/navbar/AdminNav'
import Calendar from 'react-calendar'
import TimePicker from 'react-time-picker'
import 'react-calendar/dist/Calendar.css'
import 'react-time-picker/dist/TimePicker.css'
import appointments from '../admin/sample.json'
import axios from 'axios'
import Toast from '../../components/function/Toast'
import { useEffect } from 'react'


// ---------------- UTILITY FUNCTIONS ----------------

// Safely build a YYYY-MM-DD string from a Date object (no UTC offset).
function getLocalDateString(dateObj) {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function timeStringToMinutes(str) {
  const [hourStr, minuteStr] = str.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10) || 0
  return hour * 60 + minute
}

function formatTimeTo12H(str) {
  let [hour, minute] = str.split(':')
  hour = parseInt(hour, 10)
  minute = parseInt(minute, 10) || 0

  const suffix = hour >= 12 ? 'pm' : 'am'
  const normalized = hour % 12 || 12
  const minuteStr = minute.toString().padStart(2, '0')
  return `${normalized}:${minuteStr}${suffix}`
}

function eventsOverlap(a, b) {
  return a.start < b.end && b.start < a.end
}

// Add this with other state declarations


// ---------------- DAY SCHEDULER ----------------
const DayScheduler = ({
  appointments,
  selectedDate,
  onSelectAppointment,
  selectedAppointment
}) => {
  // Convert `selectedDate` to local date string
  const selectedDateStr = getLocalDateString(selectedDate)

  // Filter only events that match the selectedDate (by string comparison)
  const filteredEvents = appointments.filter((apt) => {
    return apt.date === selectedDateStr
  })

  // Our day runs from 7:00am to 6:00pm
  const dayStart = 7 * 60
  const dayEnd = 18 * 60
  const totalMinutes = dayEnd - dayStart

  // Convert appointments to structured data
  const events = filteredEvents.map((apt) => {
    const start = timeStringToMinutes(apt.startTime)
    const end = timeStringToMinutes(apt.endTime)
    return { ...apt, start, end }
  })

  // Sort events by start time
  events.sort((a, b) => a.start - b.start)

  // 1) Build "clusters" of events that overlap in time
  events.forEach((e) => {
    e.clusterId = -1
  })
  let clusterIndex = 0

  for (let i = 0; i < events.length; i++) {
    if (events[i].clusterId === -1) {
      const stack = [events[i]]
      events[i].clusterId = clusterIndex
      while (stack.length > 0) {
        const current = stack.pop()
        for (let j = 0; j < events.length; j++) {
          if (
            events[j].clusterId === -1 &&
            eventsOverlap(current, events[j])
          ) {
            events[j].clusterId = clusterIndex
            stack.push(events[j])
          }
        }
      }
      clusterIndex++
    }
  }

  // 2) For each cluster, assign sub-lanes so overlapping events share width
  const clusterCount = clusterIndex
  for (let c = 0; c < clusterCount; c++) {
    const clusterEvents = events.filter((e) => e.clusterId === c)
    clusterEvents.sort((a, b) => a.start - b.start)

    const lanes = []
    for (const ev of clusterEvents) {
      let placed = false
      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i]
        const lastInLane = lane[lane.length - 1]
        if (ev.start >= lastInLane.end) {
          lane.push(ev)
          placed = true
          break
        }
      }
      if (!placed) lanes.push([ev])
    }

    lanes.forEach((lane, laneIndex) => {
      lane.forEach((ev) => {
        ev.laneIndex = laneIndex
        ev.laneCount = lanes.length
      })
    })
  }

  // Logic to reposition the hover card when hovering
  const handleMouseEnter = (e) => {
    const parentRect = e.currentTarget.parentNode.getBoundingClientRect()
    const hoverCard = e.currentTarget.querySelector('.hover-card')
    if (!hoverCard) return

    // Remove any old inline positioning
    hoverCard.style.removeProperty('top')

    setTimeout(() => {
      const hoverRect = hoverCard.getBoundingClientRect()

      // If bottom of card overflows parent
      if (hoverRect.bottom > parentRect.bottom) {
        const overflowBottom = hoverRect.bottom - parentRect.bottom
        hoverCard.style.top = `-${overflowBottom + 8}px`
      }

      // If top of card is above parent
      if (hoverRect.top < parentRect.top) {
        const overflowTop = parentRect.top - hoverRect.top
        hoverCard.style.top = `${overflowTop + 8}px`
      }
    }, 0)
  }

  const handleMouseLeave = (e) => {
    const hoverCard = e.currentTarget.querySelector('.hover-card')
    if (hoverCard) {
      hoverCard.style.removeProperty('top')
    }
  }

  // Add this with other state declarations



  return (
    <div className="w-full h-full relative bg-gray-200 overflow-hidden">
      {/* Left timeline ruler */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-gray-900 text-white z-10 rounded-md"
        style={{ width: '4.5rem' }}
      >
        {Array.from({ length: (dayEnd - dayStart) / 60 }).map((_, idx) => {
          const hour = dayStart / 60 + idx
          return (
            <div
              key={hour}
              className="relative border-b border-gray-700"
              style={{ height: `${100 / ((dayEnd - dayStart) / 60)}%` }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {formatTimeTo12H(`${hour.toString().padStart(2, '0')}:00`)}
              </span>
            </div>
          )
        })}
        <div
          className="relative"
          style={{
            height: `${100 / ((dayEnd - dayStart) / 60)}%`
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {formatTimeTo12H(`${(dayEnd / 60).toString().padStart(2, '0')}:00`)}
          </span>
        </div>
      </div>

      {/* Main scheduler area */}
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{ left: '4.5rem' }}
      >
        {/* Hour lines */}
        {Array.from({ length: (dayEnd - dayStart) / 60 + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full border-t border-gray-300 rounded-md"
            style={{
              top: `calc(${(i / ((dayEnd - dayStart) / 60)) * 100}%)`
            }}
          />
        ))}

        {/* Render each event */}
        {events.map((ev) => {
          const startOffset = ev.start - dayStart
          const endOffset = ev.end - dayStart
          const top = (startOffset / totalMinutes) * 100
          const height = ((endOffset - startOffset) / totalMinutes) * 100

          const width = `${100 / ev.laneCount}%`
          const left = `${(ev.laneIndex / ev.laneCount) * 100}%`

          // Highlight if selected
          const isSelected =
            selectedAppointment && selectedAppointment.id === ev.id

          return (
            <div
              key={ev.id}
              onClick={() => {
                if (selectedAppointment && selectedAppointment.id === ev.id) {
                  onSelectAppointment(null)
                } else {
                  onSelectAppointment(ev)
                }
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="group absolute p-1 cursor-pointer"
              style={{
                top: `${top}%`,
                height: `${height}%`,
                left,
                width
              }}
            >
              {/* Normal (non-hover) view */}
              <div
                className={`
                    w-full h-full
                    border ${isSelected ? 'border-white bg-gray-500 text-white' : 'border-gray-300 bg-white'}
                    rounded shadow-sm p-2 flex flex-col justify-between relative
                    transition-all overflow-hidden
                    group-hover:opacity-0
                    ${ev.isAppointment ? 'border-l-4 border-l-blue-500' : ''}
                    ${ev.isSchedule && ev.availability === 'EXCLUSIVE' ? 'border-l-4 border-l-red-500' : ''}
                    ${ev.isSchedule && ev.availability === 'SHARED' ? 'border-l-4 border-l-green-500' : ''}
                  `}
              >
                <div
                  className={`
                      pl-2 h-full flex flex-col justify-between relative
                    `}
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-xs sm:text-sm truncate">
                      {ev.title}
                    </p>
                    {ev.organizer && (
                      <p className="text-[10px] sm:text-xs truncate">
                        {ev.organizer}
                      </p>
                    )}
                    {ev.numPeople && (
                      <p className="text-[10px] sm:text-xs truncate">
                        {ev.numPeople}
                      </p>
                    )}
                    {ev.isAppointment && (
                      <p className="text-[10px] sm:text-xs truncate text-blue-500">
                        Appointment
                      </p>
                    )}
                    {ev.isSchedule && (
                      <p className="text-[10px] sm:text-xs truncate text-green-500">
                        {ev.availability === 'EXCLUSIVE' ? 'Exclusive Schedule' : 'Shared Schedule'}
                      </p>
                    )}
                  </div>
                  <p
                    className={`
                        absolute bottom-1 right-2 text-[10px] sm:text-xs
                        ${isSelected ? '' : 'text-gray-400'}
                      `}
                  >
                    {formatTimeTo12H(ev.startTime)} - {formatTimeTo12H(ev.endTime)}
                  </p>
                </div>
              </div>

              {/* Hover (expanded) view */}
              <div
                className={`
                    hover-card
                    absolute top-0 left-0 w-[20rem] max-w-[90vw]
                    min-h-[6rem]
                    border ${isSelected ? 'border-white' : 'border-gray-300'}
                    rounded-lg shadow-2xl p-4
                    flex flex-col justify-between
                    z-50 opacity-0 group-hover:opacity-100
                    transition-all duration-300 ease-in-out
                    ${isSelected ? 'bg-gray-500 text-white' : 'bg-white'}
                    hover:scale-90
                    origin-top-left
                    w-full
                    ${ev.isAppointment ? 'border-l-4 border-l-blue-500' : ''}
                    ${ev.isSchedule && ev.availability === 'EXCLUSIVE' ? 'border-l-4 border-l-red-500' : ''}
                    ${ev.isSchedule && ev.availability === 'SHARED' ? 'border-l-4 border-l-green-500' : ''}
                  `}
              >
                <div
                  className={`
                      pl-3 flex-1 flex flex-col justify-between relative
                    `}
                >
                  <div className="flex-1 overflow-visible">
                    <p className="font-bold text-base break-words">{ev.title}</p>
                    {ev.organizer && <p className="text-sm break-words">{ev.organizer}</p>}
                    {ev.numPeople && <p className="text-sm break-words">{ev.numPeople}</p>}

                    {/* Event type and availability indicator */}
                    {ev.isAppointment && (
                      <div className="mt-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                          <i className="fas fa-calendar-check mr-1"></i> Appointment
                        </span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                          <i className="fas fa-users mr-1"></i> Shared
                        </span>
                      </div>
                    )}

                    {ev.isSchedule && (
                      <div className="mt-2 mb-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
                          <i className="fas fa-calendar mr-1"></i> Schedule
                        </span>
                        <span className={`ml-2 px-2 py-1 ${ev.availability === 'EXCLUSIVE' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} rounded-md text-xs font-medium`}>
                          <i className={`fas ${ev.availability === 'EXCLUSIVE' ? 'fa-lock' : 'fa-users'} mr-1`}></i>
                          {ev.availability === 'EXCLUSIVE' ? 'Exclusive' : 'Shared'}
                        </span>
                      </div>
                    )}

                    {/* Status indicator for appointments */}
                    {ev.isAppointment && ev.status && (
                      <div className="mt-1 mb-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium
                            ${ev.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : ''}
                            ${ev.status === 'TO_REVIEW' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${ev.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                            ${ev.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
                            ${ev.status === 'FAILED' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                          <i className={`fas ${ev.status === 'CONFIRMED' ? 'fa-check-circle' :
                            ev.status === 'TO_REVIEW' ? 'fa-clock' :
                              ev.status === 'REJECTED' ? 'fa-times-circle' :
                                ev.status === 'COMPLETED' ? 'fa-flag-checkered' :
                                  'fa-exclamation-circle'
                            } mr-1`}></i>
                          {ev.status.replace('_', ' ').charAt(0) + ev.status.replace('_', ' ').slice(1).toLowerCase()}
                        </span>
                      </div>
                    )}

                    {/* Description if available */}
                    {ev.description && (
                      <p className="text-sm break-words mt-2 text-gray-600">
                        {ev.description}
                      </p>
                    )}
                  </div>
                  <p
                    className={`
                        absolute bottom-2 right-3 text-xs sm:text-sm
                        ${isSelected ? 'text-white' : 'text-gray-400'}
                      `}
                  >
                    {formatTimeTo12H(ev.startTime)} - {formatTimeTo12H(ev.endTime)}
                  </p>
                </div>
              </div>
            </div>
          )

        })}
      </div>
    </div>
  )
}


// ---------------- MAIN SCHEDULE PAGE ----------------
const Schedule = () => {
  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [newAvailability, setNewAvailability] = useState('SHARED') // Default to 'SHARED'
  // Track the currently selected appointment from the DayScheduler
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // State to manage new schedule form
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newStartTime, setNewStartTime] = useState('09:00')
  const [newEndTime, setNewEndTime] = useState('10:00')

  // Build a local date string for the selected date (no UTC offset).
  const dateString = getLocalDateString(selectedDate)
  const monthLabel = selectedDate.toLocaleString('default', { month: 'long' }) + ' ' + selectedDate.getFullYear()
  const weekdayName = selectedDate.toLocaleString('default', { weekday: 'long' })
  const dayNum = selectedDate.getDate()
  // Filter only items that match selected day for "Today's Scheduled Tours"
  const todaysTours = appointments
    .filter((apt) => apt.date === dateString)
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime))

  const [backendEvents, setBackendEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || '/api'
  // Fetch data when component mounts or selectedDate changes
  useEffect(() => {
    fetchEvents()
  }, [selectedDate, dateString])

  const handleAddEvent = async () => {
    try {
      // Validate input
      if (!newTitle) {
        showToast('Please enter an event title', 'error');
        return;
      }

      if (newStartTime >= newEndTime) {
        showToast('Start time must be earlier than end time', 'error');
        return;
      }

      // Get the token from localStorage (same pattern as in Appointment.jsx)
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('You need to be logged in to add schedules', 'error');
        return;
      }

      // Get API URL from environment variables
      const API_URL = import.meta.env.VITE_API_URL || '/api';

      // Create the schedule data object
      const scheduleData = {
        title: newTitle,
        description: newDesc,
        date: dateString,
        start_time: newStartTime,
        end_time: newEndTime,
        availability: newAvailability
      };

      console.log('Sending schedule data:', scheduleData);

      // Make API call to backend using axios
      const response = await axios.post(
        `${API_URL}/api/auth/schedules`,
        scheduleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Schedule created successfully:', response.data);

      // Show success notification
      showToast('Schedule added successfully', 'success');

      // Clear form fields
      setNewTitle('');
      setNewDesc('');
      setNewStartTime('09:00');
      setNewEndTime('10:00');
      setNewAvailability('SHARED');

    } catch (error) {
      console.error('Error creating schedule:', error);

      // Show error notification
      if (error.response) {
        showToast(`Error: ${error.response.data.message || 'Failed to create schedule'}`, 'error');
      } else {
        showToast('Network error. Please try again.', 'error');
      }
    }
  };

  // Fetch both schedules and appointments from the backend
  // Fetch both schedules and appointments from the backend
  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showToast("Not authenticated. Please log in.", 'error')
        setIsLoading(false)
        return
      }

      // Format date for API
      const formattedDate = dateString

      // Fetch schedules
      const schedulesResponse = await axios.get(
        `${API_URL}/api/auth/schedules?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log("Schedules response:", schedulesResponse.data)

      // Fetch appointments
      const appointmentsResponse = await axios.get(
        `${API_URL}/api/auth/appointment?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log("Appointments response:", appointmentsResponse.data)

      // Convert appointments to the same format as schedules
      const appointmentEvents = appointmentsResponse.data.map(appointment => {
        // Default time if preferred_time is missing
        let startTime = "09:00";
        let endTime = "10:00";

        if (appointment.preferred_time && typeof appointment.preferred_time === 'string') {
          const timeParts = appointment.preferred_time.split('-');
          if (timeParts.length > 0 && timeParts[0]) {
            startTime = timeParts[0].trim();

            if (timeParts.length > 1 && timeParts[1]) {
              endTime = timeParts[1].trim();
            } else {
              // Calculate end time by adding 1 hour to start time
              const [hours, minutes] = startTime.split(':').map(part => parseInt(part, 10));
              if (!isNaN(hours)) {
                const newHours = (hours + 1) % 24;
                endTime = `${newHours.toString().padStart(2, '0')}:${minutes ? minutes.toString().padStart(2, '0') : '00'}`;
              }
            }
          }
        }

        return {
          id: `appointment-${appointment.appointment_id}`,
          title: appointment.purpose_of_visit || 'Appointment',
          description: appointment.additional_notes || '',
          date: appointment.preferred_date,
          startTime,
          endTime,
          organizer: `${appointment.Visitor?.first_name || ''} ${appointment.Visitor?.last_name || ''}`.trim(),
          numPeople: `${appointment.population_count || 1} visitors`,
          availability: 'SHARED', // Appointments are automatically shared
          isAppointment: true,
          status: appointment.AppointmentStatus?.status || 'TO_REVIEW'
        };
      })

      // Convert schedules to the expected format
      const scheduleEvents = schedulesResponse.data.map(schedule => ({
        id: `schedule-${schedule.schedule_id}`,
        title: schedule.title,
        description: schedule.description || '',
        date: schedule.date,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        availability: schedule.availability,
        isSchedule: true
      }))

      console.log("Schedule events:", scheduleEvents)
      console.log("Appointment events:", appointmentEvents)

      // Combine both types of events
      const allEvents = [...appointmentEvents, ...scheduleEvents]
      console.log("All events:", allEvents)
      setBackendEvents(allEvents)

    } catch (error) {
      console.error('Error fetching events:', error)
      showToast('Failed to load events', 'error')
    } finally {
      setIsLoading(false)
    }
  }


  // Helper function to add an hour to a time string (e.g., "09:00" -> "10:00")
  // Helper function to add an hour to a time string (e.g., "09:00" -> "10:00")
  const addHourToTime = (timeStr) => {
    if (!timeStr) return "00:00"; // Default if timeStr is undefined

    const parts = timeStr.split(':');
    if (parts.length < 2) return "00:00"; // Default if format is incorrect

    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);

    if (isNaN(hour) || isNaN(minute)) return "00:00"; // Default if parsing fails

    const newHour = (hour + 1) % 24;
    return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });
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


  return (
    <>
      <div className="w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]">
        {/* Admin Navigation */}
        <div className="bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto">
          <AdminNav />
        </div>

        <div className="w-full bg-[#F0F0F0] min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-auto">
          <span className="text-5xl font-semibold text-black">Schedule</span>
          <div className="w-full h-full flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 justify-between sm:px-12 gap-x-10">

            {/* LEFT SECTION - Calendar & Today's Scheduled Tours */}
            <div className="sm:[w-31rem] h-full flex flex-col gap-y-6 items-center justify-around">
              {/* Calendar */}
              <div className="min-w-[31rem] max-w-[31rem] min-h-[28rem] flex flex-col gap-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold">{monthLabel}</span>
                </div>
                <div className="rounded-xl bg-black p-3 shadow-xl">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName="relative"
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        // Build local date string for the tile's date
                        const ds = getLocalDateString(date)
                        const count = appointments.filter((apt) => apt.date === ds).length
                        if (count > 0) {
                          return (
                            <span className="absolute top-1 right-1 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">
                              {count}
                            </span>
                          )
                        }
                      }
                      return null
                    }}
                    showNeighboringMonth={false}
                    className="p-2 rounded-lg mx-auto text-lg"
                  />
                </div>
              </div>

              {/* Today's Scheduled Tours */}
              <div className="min-w-[31rem] max-w-[31rem] flex flex-col min-h-[35rem] bg-white rounded-xl shadow-xl p-5">
                <span className="text-2xl font-semibold mb-4">Today's Scheduled Tours</span>
                <div className="w-full border-t border-gray-200 pt-4 space-y-3 max-h-120 overflow-y-auto">
                  {todaysTours.length === 0 && (
                    <div className="bg-gray-100 text-gray-700 p-3 rounded-lg">
                      No Scheduled Tours
                    </div>
                  )}
                  {todaysTours.map((tour, idx) => (
                    <div
                      key={tour.id || idx}
                      className={`
                        ${idx % 2 === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}
                        p-3 rounded-lg flex items-center justify-between
                      `}
                    >
                      <div className="flex items-center">
                        <div
                          className={`
                            ${idx % 2 === 0 ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'}
                            px-3 py-1.5 rounded mr-3 text-sm
                          `}
                        >
                          {tour.startTime}-{tour.endTime}
                        </div>
                        <div>
                          <div className="font-medium">
                            {tour.organizer ? tour.organizer : 'No Name'}
                          </div>
                          {tour.numPeople && (
                            <div className="text-sm">{tour.numPeople}</div>
                          )}
                        </div>
                      </div>
                      {/* Example label for first item only, can remove if unwanted */}
                      {idx === 0 && (
                        <div className="bg-green-500 text-xs px-2 py-1 rounded">tour done</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION - Day Scheduler */}
            <div className="w-full min-w-[55rem] h-full flex flex-col gap-y-8">
              <div className="w-full min-h-[5rem] flex flex-col justify-between">
                <span className="text-4xl font-bold text-black">Today's Schedule</span>
                <div className="w-full h-fit flex items-center">
                  <span className="w-[14rem] text-center text-3xl font-bold text-[#9590FF]">
                    {weekdayName} {dayNum}
                  </span>
                  <div className="flex items-center ml-4">
                    <i
                      className="text-3xl fa-solid fa-less-than cursor-pointer hover:text-gray-700"
                      onClick={() => {
                        const prevDay = new Date(selectedDate)
                        prevDay.setDate(prevDay.getDate() - 1)
                        setSelectedDate(prevDay)
                      }}
                    />
                    <span className="mx-3" />
                    <i
                      className="text-3xl fa-solid fa-greater-than cursor-pointer hover:text-gray-700"
                      onClick={() => {
                        const nextDay = new Date(selectedDate)
                        nextDay.setDate(nextDay.getDate() + 1)
                        setSelectedDate(nextDay)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-full bg-white p-5 rounded-xl shadow-xl">
                <DayScheduler
                  appointments={backendEvents}
                  selectedDate={selectedDate}
                  onSelectAppointment={setSelectedAppointment}
                  selectedAppointment={selectedAppointment}
                  isLoading={isLoading}
                />

              </div>
            </div>

            {/* RIGHT SECTION - Clock, Form, and Selected Appointment */}
            <div className="min-w-[31rem] h-full flex flex-col gap-y-5">
              {/* Simple Clock (placeholder) */}
              <div className="w-full rounded-xl bg-white shadow-xl p-6 flex items-center justify-center gap-x-8 hover:shadow-2xl transition-shadow">
                <div className="bg-gray-100 p-3 rounded-full">
                  <i className="text-5xl fa-solid fa-clock text-[#9590FF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-5xl font-bold">12:00pm</span>
                  <span className="text-2xl font-semibold text-end text-[#9590FF]">
                    Lunch Time
                  </span>
                </div>
              </div>

              {/* Add Schedule */}
              <div className="w-full max-w-lg mx-auto rounded-2xl bg-white shadow-2xl p-8 space-y-6">
                <div>
                  <span className="text-2xl font-bold block mb-2 text-gray-800">
                    Add a Schedule for
                  </span>
                  <span className="text-lg font-semibold text-[#A6A3F6]">
                    {weekdayName} {dayNum}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Event Title */}
                  <div className="flex flex-col">
                    <label htmlFor="event-title" className="text-sm text-gray-600 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="event-title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A6A3F6] text-sm"
                      placeholder="Enter event title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  {/* Event Description */}
                  <div className="flex flex-col">
                    <label htmlFor="event-desc" className="text-sm text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      id="event-desc"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A6A3F6] text-sm resize-none"
                      rows="3"
                      placeholder="Enter event description"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                    />
                  </div>

                  {/* Start / End Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="start-time" className="text-sm text-gray-600 mb-1">
                        Start Time
                      </label>
                      <TimePicker
                        id="start-time"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A6A3F6] text-sm"
                        onChange={setNewStartTime}
                        value={newStartTime}
                        format="hh:mm a"
                        disableClock
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="end-time" className="text-sm text-gray-600 mb-1">
                        End Time
                      </label>
                      <TimePicker
                        id="end-time"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A6A3F6] text-sm"
                        onChange={setNewEndTime}
                        value={newEndTime}
                        format="hh:mm a"
                        disableClock
                      />
                    </div>
                  </div>

                  {/* Availability Selection - Improved Layout */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2">
                      Availability
                    </label>
                    <div className="flex gap-4">
                      <label className="bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors w-full">
                        <input
                          type="radio"
                          name="availability"
                          value="SHARED"
                          checked={newAvailability === 'SHARED'}
                          onChange={() => setNewAvailability('SHARED')}
                          className="w-4 h-4 text-[#A6A3F6] focus:ring-[#A6A3F6]"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">Shared</span>
                          <span className="text-xs text-gray-500">Can be booked with other events</span>
                        </div>
                      </label>
                      <label className="bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors w-full">
                        <input
                          type="radio"
                          name="availability"
                          value="EXCLUSIVE"
                          checked={newAvailability === 'EXCLUSIVE'}
                          onChange={() => setNewAvailability('EXCLUSIVE')}
                          className="w-4 h-4 text-[#A6A3F6] focus:ring-[#A6A3F6]"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">Exclusive</span>
                          <span className="text-xs text-gray-500">Reserved for this event only</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Add Event Button */}
                  <button
                    className="w-full bg-[#A6A3F6] text-white py-3 rounded-lg font-semibold hover:bg-[#8e8aec] transition-all flex items-center justify-center gap-2"
                    onClick={handleAddEvent}
                  >
                    <i className="fa-solid fa-plus" /> Add Event
                  </button>
                </div>
              </div>



              {/* Selected Appointment */}
              <div className="w-full shadow-xl bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Selected Appointment</h2>
                {selectedAppointment ? (
                  <>
                    <p className="mb-2">
                      <strong>Title:</strong> {selectedAppointment.title}
                    </p>
                    <p className="mb-2">
                      <strong>Organizer:</strong>{' '}
                      {selectedAppointment.organizer || '—'}
                    </p>
                    <p className="mb-2">
                      <strong>Time:</strong>{' '}
                      {formatTimeTo12H(selectedAppointment.startTime)} -{' '}
                      {formatTimeTo12H(selectedAppointment.endTime)}
                    </p>
                    {selectedAppointment.numPeople && (
                      <p className="mb-2">
                        <strong>Number of People:</strong>{' '}
                        {selectedAppointment.numPeople}
                      </p>
                    )}
                    {selectedAppointment.description && (
                      <p className="mb-2">
                        <strong>Description:</strong>{' '}
                        {selectedAppointment.description}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        // Mark as completed...
                        setSelectedAppointment(null)
                      }}
                      className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                    >
                      Mark as Done
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500 italic">No appointment selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#A6A3F6] border-t-transparent"></div>
            <span>Loading events...</span>
          </div>
        </div>
      )}
      {/* Toast notifications */}
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={hideToast}
      />

    </>
  )
}

export default Schedule
