// Schedule.jsx

import React, { useState } from 'react'
import AdminNav from '../../components/navbar/AdminNav'
import Calendar from 'react-calendar'
import TimePicker from 'react-time-picker'
import 'react-calendar/dist/Calendar.css'
import 'react-time-picker/dist/TimePicker.css'
// import appointments from '../admin/sample.json'
import LiveClock from '../../components/function/LiveClock'
import axios from 'axios'
import Toast from '../../components/function/Toast'
import { useEffect } from 'react'
import { AppointmentModal } from '../../components/modals/AppointmentModal'
import { connectWebSocket, closeWebSocket } from '../../utils/services/websocket'


// ---------------- UTILITY FUNCTIONS ----------------
// Add this function to the utility functions section (around line 70)
function countOverlappingEvents(events, startTime, endTime) {
  // Convert the new times to minutes for comparison
  const newStart = timeStringToMinutes(startTime);
  const newEnd = timeStringToMinutes(endTime);

  // Create a reference event for comparison
  const newEvent = { start: newStart, end: newEnd };

  // Count events that would overlap with the new event
  return events.filter(event => {
    const eventStart = timeStringToMinutes(event.startTime);
    const eventEnd = timeStringToMinutes(event.endTime);
    return eventsOverlap(newEvent, { start: eventStart, end: eventEnd });
  }).length;
}

// Modify the handleAddEvent function (around line 1023)


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
// DayScheduler updated to show clean cards and empty state message
const DayScheduler = ({
  appointments,
  selectedDate,
  onSelectAppointment,
  selectedAppointment,
  isLoading
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

  const handleMouseEnter = (e) => {
    // Use offsetParent or a closer container if parentNode is not the true bounding box
    // but for most cases, parentNode might suffice. Adjust if needed.
    const parentRect = e.currentTarget.parentNode.getBoundingClientRect();
    const hoverCard = e.currentTarget.querySelector('.hover-card');
    if (!hoverCard) return;

    // Reset positioning
    hoverCard.style.removeProperty('top');
    hoverCard.style.removeProperty('left');
    hoverCard.style.removeProperty('transform-origin');

    setTimeout(() => {
      const hoverRect = hoverCard.getBoundingClientRect();

      // -- RIGHT OVERFLOW --
      if (hoverRect.right > parentRect.right) {
        const overflowRight = hoverRect.right - parentRect.right + 8;
        hoverCard.style.left = `-${overflowRight}px`;
        hoverCard.style.transformOrigin = 'top right';
      }

      // -- LEFT OVERFLOW --
      if (hoverRect.left < parentRect.left) {
        const overflowLeft = parentRect.left - hoverRect.left + 8;
        hoverCard.style.left = `${overflowLeft}px`;
        hoverCard.style.transformOrigin = 'top left';
      }

      // -- BOTTOM OVERFLOW --
      if (hoverRect.bottom > parentRect.bottom) {
        const overflowBottom = hoverRect.bottom - parentRect.bottom + 8;
        hoverCard.style.top = `-${overflowBottom}px`;
        // Keep transform origin at top so it “slides up” if needed
      }

      // -- TOP OVERFLOW --
      if (hoverRect.top < parentRect.top) {
        const overflowTop = parentRect.top - hoverRect.top + 8;
        hoverCard.style.top = `${overflowTop}px`;
      }
    }, 10);
  };

  const handleMouseLeave = (e) => {
    const hoverCard = e.currentTarget.querySelector('.hover-card');
    if (!hoverCard) return;

    hoverCard.style.removeProperty('top');
    hoverCard.style.removeProperty('left');
    hoverCard.style.removeProperty('transform-origin');
  };



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

        {/* Empty state message when no events */}
        {events.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white bg-opacity-80 rounded-lg p-6 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No events scheduled</h3>
              <p className="text-gray-600 mt-1">There are no schedules or appointments for this day.</p>
            </div>
          </div>
        )}

        {/* Render each event */}
        {events.map((ev) => {
          const startOffset = ev.start - dayStart
          const endOffset = ev.end - dayStart
          const top = (startOffset / totalMinutes) * 100
          const height = ((endOffset - startOffset) / totalMinutes) * 100

          const width = `${100 / ev.laneCount}%`
          const left = `${(ev.laneIndex / ev.laneCount) * 100}%`

          // Highlight if selected
          const isSelected = selectedAppointment && selectedAppointment.id === ev.id

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
              {/* Normal (non-hover) view - SIMPLIFIED */}
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
                  className="pl-2 h-full flex flex-col justify-between relative"
                >
                  <div className="flex-1 overflow-hidden">
                    {/* Title with proper formatting */}
                    <p className="font-bold text-xs sm:text-sm truncate">
                      {ev.title}
                    </p>

                    {/* For appointments, show visitor name instead of organizer */}
                    {ev.isAppointment && ev.organizer && (
                      <p className="text-[10px] sm:text-xs truncate">
                        Visitor: {ev.organizer}
                      </p>
                    )}

                    {/* People count only for appointments */}
                    {ev.isAppointment && ev.numPeople && (
                      <p className="text-[10px] sm:text-xs truncate">
                        {ev.numPeople}
                      </p>
                    )}

                    {/* Simple type label without availability text */}
                    <p className={`text-[10px] sm:text-xs truncate ${ev.isAppointment ? 'text-blue-500' : 'text-green-500'}`}>
                      {ev.isAppointment ? 'Appointment' : 'Schedule'}
                    </p>
                  </div>

                  {/* Time display at the bottom */}
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
    min-h-[8rem]
    border ${isSelected ? 'border-white' : 'border-gray-300'}
    rounded-lg shadow-2xl p-4
    flex flex-col justify-between
    z-50 opacity-0 group-hover:opacity-100
    transition-all duration-300 ease-in-out
    ${isSelected ? 'bg-gray-500 text-white' : 'bg-white'}
    origin-top-left
    ${ev.isAppointment ? 'border-l-4 border-l-blue-500' : ''}
    ${ev.isSchedule && ev.availability === 'EXCLUSIVE' ? 'border-l-4 border-l-red-500' : ''}
    ${ev.isSchedule && ev.availability === 'SHARED' ? 'border-l-4 border-l-green-500' : ''}
  `}
                style={{
                  width: '20rem',
                  height: 'auto',
                  minHeight: '8rem',
                  // The positioning will now be handled by JavaScript
                }}
              >

                <div className="pl-3 flex-1 flex flex-col justify-between relative">
                  {/* Content area with proper spacing */}
                  <div className="flex-1 overflow-visible pb-8"> {/* Adding padding at bottom to prevent overlap with time */}
                    {/* Title with proper formatting */}
                    <p className="font-bold text-base mb-1 break-words">{ev.title}</p>

                    {/* For appointments only, show visitor information */}
                    {ev.isAppointment && ev.organizer && (
                      <p className="text-sm mb-1 break-words">
                        <span className="font-medium">Visitor:</span> {ev.organizer}
                      </p>
                    )}

                    {/* People count only for appointments */}
                    {ev.isAppointment && ev.numPeople && (
                      <p className="text-sm mb-2 break-words">{ev.numPeople}</p>
                    )}

                    {/* Type badges - more detailed in hover mode */}
                    <div className="mt-1 mb-1 flex flex-wrap gap-1">
                      {ev.isAppointment && (
                        <>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium inline-block mb-1">
                            <i className="fas fa-calendar-check mr-1"></i> Appointment
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium inline-block mb-1">
                            <i className="fas fa-users mr-1"></i> Shared
                          </span>
                        </>
                      )}

                      {ev.isSchedule && (
                        <>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-medium inline-block mb-1">
                            <i className="fas fa-calendar mr-1"></i> Schedule
                          </span>
                          <span className={`px-2 py-1 ${ev.availability === 'EXCLUSIVE' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} rounded-md text-xs font-medium inline-block mb-1`}>
                            <i className={`fas ${ev.availability === 'EXCLUSIVE' ? 'fa-lock' : 'fa-users'} mr-1`}></i>
                            {ev.availability === 'EXCLUSIVE' ? 'Exclusive' : 'Shared'}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description with limit to prevent overflow */}
                    {ev.description && (
                      <div className="mt-2">
                        <p className="text-sm break-words text-gray-600 max-h-16 overflow-y-auto">
                          {ev.description.length > 100 ? `${ev.description.substring(0, 100)}...` : ev.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time at the bottom */}
                  <p className={`absolute bottom-0 right-3 text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>
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
  // const todaysTours = appointments
  //   .filter((apt) => apt.date === dateString)
  //   .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime))

  const [backendEvents, setBackendEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || '/api'
  // Fetch data when component mounts or selectedDate changes
  // Add these with other state variables in the Schedule component
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Add these state variables with your other state declarations
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [todayTours, setTodayTours] = useState([]);
  const [viewedDate, setViewedDate] = useState(new Date());

  // Schedule.jsx - Lines 967-1161

  // Define utility functions for data fetching
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("Not authenticated. Please log in.", 'error');
        setIsLoading(false);
        return;
      }

      // Format date for API
      const formattedDate = dateString;
      console.log("Fetching data for date:", formattedDate);

      // FETCH SCHEDULES 
      console.log("Fetching schedules from:", `${API_URL}/api/auth/schedules?date=${formattedDate}`);
      const schedulesResponse = await axios.get(
        `${API_URL}/api/auth/schedules?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Raw schedules data:", schedulesResponse.data);

      // Process schedules - filter out COMPLETED status
      const scheduleEvents = schedulesResponse.data
        .filter(schedule => schedule.status !== 'COMPLETED')
        .map(schedule => ({
          id: `schedule-${schedule.schedule_id}`,
          title: schedule.title || 'Unnamed Schedule',
          description: schedule.description || '',
          date: schedule.date,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          availability: schedule.availability || 'SHARED',
          status: schedule.status || 'ACTIVE',
          isSchedule: true,
          schedule_id: schedule.schedule_id // Store the ID for easier access later
        }));

      console.log("Processed schedule events:", scheduleEvents);

      // FETCH ALL APPOINTMENTS
      console.log("Fetching appointments from:", `${API_URL}/api/auth/appointment`);
      let appointmentsResponse;
      try {
        appointmentsResponse = await axios.get(
          `${API_URL}/api/auth/appointment`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Raw appointments data count:", appointmentsResponse.data.length);
      } catch (appointmentError) {
        console.error("Error fetching appointments:", appointmentError);
        showToast('Failed to load appointments', 'error');
        appointmentsResponse = { data: [] };
      }

      // CONFIRMED APPOINTMENTS ONLY - Filter by status and date
      const confirmedAppointments = appointmentsResponse.data.filter(appointment => {
        if (!appointment || !appointment.preferred_date) {
          return false;
        }

        // Check if status is CONFIRMED
        const status = appointment.AppointmentStatus?.status || '';
        const isConfirmed = status.toUpperCase() === 'CONFIRMED';

        // Normalize date format by removing any time portion
        const appointmentDate = appointment.preferred_date.split('T')[0];

        // Match both date and CONFIRMED status
        const matches = appointmentDate === formattedDate && isConfirmed;

        if (matches) {
          console.log("Found CONFIRMED appointment for selected date:", appointment);
        }

        return matches;
      });

      console.log("CONFIRMED appointments count:", confirmedAppointments.length);

      // Process CONFIRMED appointments
      const appointmentEvents = confirmedAppointments.map(appointment => {
        // Handle time formats
        let startTime = "09:00";
        let endTime = "10:00";

        // Try to use direct time fields first
        if (appointment.start_time && appointment.end_time) {
          startTime = appointment.start_time;
          endTime = appointment.end_time;
        }
        // Fall back to preferred_time if available
        else if (appointment.preferred_time && appointment.preferred_time.includes('-')) {
          const [startPart, endPart] = appointment.preferred_time.split('-').map(t => t.trim());

          // Convert from 12-hour format (9:00 AM) to 24-hour format (09:00)
          if (startPart) {
            startTime = convertTo24Hour(startPart);
          }

          if (endPart) {
            endTime = convertTo24Hour(endPart);
          } else {
            // If no end time, add 1 hour to start time
            const hourVal = parseInt(startTime.split(':')[0], 10);
            const minuteVal = parseInt(startTime.split(':')[1], 10);
            const newHour = (hourVal + 1) % 24;
            endTime = `${newHour.toString().padStart(2, '0')}:${minuteVal.toString().padStart(2, '0')}`;
          }
        }

        return {
          id: `appointment-${appointment.appointment_id}`,
          title: appointment.purpose_of_visit || 'Unnamed Appointment',
          description: appointment.additional_notes || '',
          date: appointment.preferred_date.split('T')[0],
          startTime,
          endTime,
          organizer: appointment.Visitor ?
            `${appointment.Visitor.first_name || ''} ${appointment.Visitor.last_name || ''}`.trim() :
            'Unknown Visitor',
          numPeople: `${appointment.population_count || 1} visitors`,
          isAppointment: true,
          status: 'CONFIRMED',
          availability: 'SHARED' // All appointments are shared by default
        };
      });

      console.log("Processed appointment events:", appointmentEvents);

      // Combine and set events
      const allEvents = [...appointmentEvents, ...scheduleEvents];
      console.log("Final combined events:", allEvents);
      console.log("Total events:", allEvents.length);

      setBackendEvents(allEvents);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      showToast('Error loading schedule data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayTours = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("Not authenticated. Please log in.", 'error');
        return;
      }

      // Format date for API
      const formattedDate = dateString;
      console.log("Fetching today's tours for:", formattedDate);

      // Get all schedules for today (including completed ones)
      const schedulesResponse = await axios.get(
        `${API_URL}/api/auth/schedules?date=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Get all appointments
      const appointmentsResponse = await axios.get(
        `${API_URL}/api/auth/appointment`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Today's schedules:", schedulesResponse.data.length);
      console.log("All appointments:", appointmentsResponse.data.length);

      // Process all schedules for today
      const todaySchedules = schedulesResponse.data
        .filter(schedule => schedule && schedule.date)  // Ensure date exists
        .map(schedule => ({
          id: `schedule-${schedule.schedule_id}`,
          title: schedule.title || 'Schedule',
          organizer: 'Schedule',
          date: schedule.date,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          isDone: schedule.status === 'COMPLETED',
          isSchedule: true
        }));

      console.log("Processed schedules:", todaySchedules.length);

      // Filter appointments for today's date and process them
      // Only include CONFIRMED and COMPLETED appointments
      const todayAppointments = appointmentsResponse.data
        .filter(appointment => {
          // Skip if preferred_date is missing
          if (!appointment.preferred_date) {
            return false;
          }

          // Normalize date format by removing any time portion
          const appointmentDate = appointment.preferred_date.split('T')[0];
          const matchesDate = appointmentDate === formattedDate;

          if (matchesDate) {
            console.log(`Found appointment for ${formattedDate}:`, appointment.appointment_id);
          }

          return matchesDate;
        })
        .filter(appointment => {
          // Only include CONFIRMED and COMPLETED appointments (case-insensitive)
          const status = (appointment.AppointmentStatus?.status || '').toUpperCase();
          return status === 'CONFIRMED' || status === 'COMPLETED';
        })
        .map(appointment => {
          // Process time values
          let startTime = "09:00";
          let endTime = "10:00";

          // Try direct time fields first
          if (appointment.start_time && appointment.end_time) {
            startTime = appointment.start_time;
            endTime = appointment.end_time;
            console.log(`Using direct time fields for ${appointment.appointment_id}: ${startTime}-${endTime}`);
          }
          // Fall back to preferred_time if available
          else if (appointment.preferred_time && typeof appointment.preferred_time === 'string') {
            try {
              const timeParts = appointment.preferred_time.split('-');
              if (timeParts[0]) startTime = convertTo24Hour(timeParts[0].trim());
              if (timeParts[1]) endTime = convertTo24Hour(timeParts[1].trim());
              console.log(`Parsed preferred_time for ${appointment.appointment_id}: ${startTime}-${endTime}`);
            } catch (error) {
              console.error("Error parsing preferred_time:", appointment.preferred_time, error);
              // Keep default times on error
            }
          }

          return {
            id: `appointment-${appointment.appointment_id}`,
            title: appointment.purpose_of_visit || 'Visitor Appointment',
            organizer: appointment.Visitor ?
              `${appointment.Visitor.first_name || ''} ${appointment.Visitor.last_name || ''}`.trim() :
              'Unknown Visitor',
            numPeople: `${appointment.population_count || 1} visitors`,
            date: appointment.preferred_date.split('T')[0],
            startTime,
            endTime,
            isDone: (appointment.AppointmentStatus?.status || '').toUpperCase() === 'COMPLETED',
            isAppointment: true
          };
        });

      console.log("Processed appointments:", todayAppointments.length);

      // Combine and sort by start time
      const allTours = [...todaySchedules, ...todayAppointments];
      allTours.sort((a, b) => {
        return timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime);
      });

      console.log("Today's total tours:", allTours.length);
      setTodayTours(allTours);

    } catch (error) {
      console.error('Error fetching today tours:', error);
      showToast('Error loading today\'s tours', 'error');
    }
  };

  const fetchMonthEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Use viewedDate instead of selectedDate to determine which month to fetch
      const year = viewedDate.getFullYear();
      const month = viewedDate.getMonth();

      console.log(`Fetching calendar events for month: ${month + 1}/${year}`);

      // Get all schedules
      const schedulesResponse = await axios.get(
        `${API_URL}/api/auth/schedules`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Get all appointments
      const appointmentsResponse = await axios.get(
        `${API_URL}/api/auth/appointment`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("All schedules:", schedulesResponse.data.length);
      console.log("All appointments:", appointmentsResponse.data.length);

      // Filter schedules for this month and process them
      const monthSchedules = schedulesResponse.data
        .filter(schedule => {
          if (!schedule.date) return false;

          // Parse date properly and compare year and month
          const scheduleDate = new Date(schedule.date);
          return !isNaN(scheduleDate.getTime()) &&
            scheduleDate.getMonth() === month &&
            scheduleDate.getFullYear() === year;
        })
        .map(schedule => ({
          id: `schedule-${schedule.schedule_id}`,
          date: schedule.date.split('T')[0], // Normalize date format
          isActive: schedule.status !== 'COMPLETED',
          isSchedule: true
        }));

      console.log("Month-filtered schedules:", monthSchedules.length);

      // Filter appointments for this month and process them
      const monthAppointments = appointmentsResponse.data
        .filter(appointment => {
          // Skip appointments without preferred_date
          if (!appointment.preferred_date) return false;

          // Extract date and normalize format (remove time portion if present)
          const dateStr = appointment.preferred_date.split('T')[0];
          const appointmentDate = new Date(dateStr);

          // Check if date is valid and in current month/year
          return !isNaN(appointmentDate.getTime()) &&
            appointmentDate.getMonth() === month &&
            appointmentDate.getFullYear() === year;
        })
        .map(appointment => ({
          id: `appointment-${appointment.appointment_id}`,
          date: appointment.preferred_date.split('T')[0],
          isActive: (appointment.AppointmentStatus?.status || '').toUpperCase() === 'CONFIRMED',
          isAppointment: true
        }));

      console.log("Month-filtered appointments:", monthAppointments.length);

      // Combine both types of events
      const allEvents = [...monthSchedules, ...monthAppointments];
      console.log(`Total filtered calendar events: ${allEvents.length}`);

      setCalendarEvents(allEvents);

    } catch (error) {
      console.error('Error fetching monthly events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Date changed, fetching data for:", dateString);
    fetchEvents();
    fetchTodayTours();
    fetchMonthEvents();
    const handleDataChange = () => {
      console.log('WebSocket: Data changed, refreshing all components...');
      
      // Refresh all components that need updates
      fetchEvents();         // Update day scheduler events
      fetchTodayTours();     // Update today's scheduled tours
      fetchMonthEvents();    // Update calendar view with event counts (this is key for calendar dots)
    }
  
    const handleRefresh = () => {
      console.log('WebSocket: Refresh command received, refreshing all components...');
      
      // Refresh all components that need updates
      fetchEvents();         // Update day scheduler events
      fetchTodayTours();     // Update today's scheduled tours
      fetchMonthEvents();    // Update calendar view with event counts (this is key for calendar dots)
    }
  
    // Connect to WebSocket and set up handlers
    connectWebSocket(handleDataChange, handleRefresh);
    
    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      closeWebSocket();
    }
  }, [selectedDate, dateString]);
  
  

  // Separate useEffect for month view calendar events
  useEffect(() => {
    fetchMonthEvents();
  }, [viewedDate, API_URL]);



  // Handle mark as done button click
  const handleMarkAsDone = async () => {
    if (!selectedAppointment) return;

    if (selectedAppointment.isAppointment) {
      try {
        const token = localStorage.getItem('token');
        const appointmentId = selectedAppointment.id.replace('appointment-', '');

        // Get the full appointment data
        const response = await axios.get(
          `${API_URL}/api/auth/attendance/${appointmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Set up the data for the AppointmentModal
        setModalData({
          appointmentId,
          fromFirstName: selectedAppointment.organizer.split(' ')[0] || '',
          fromLastName: selectedAppointment.organizer.split(' ').slice(1).join(' ') || '',
          email: response.data?.email || '',
          phone: response.data?.phone || '',
          purpose: selectedAppointment.title || '',
          populationCount: parseInt(selectedAppointment.numPeople) || 0,
          preferredDate: selectedAppointment.date || '',
          preferredTime: `${selectedAppointment.startTime} - ${selectedAppointment.endTime}`,
          notes: selectedAppointment.description || '',
          status: 'CONFIRMED', // Force confirmed status to show arrive/cancel options
        });

        // Show the appointment modal
        setShowAppointmentModal(true);

      } catch (error) {
        console.error('Error fetching appointment details:', error);
        showToast('Error loading appointment details', 'error');
      }
    } else if (selectedAppointment.isSchedule) {
      // For schedules, show a confirmation dialog
      setShowConfirmModal(true);
    }
  };

  // Handle schedule confirmation
  const handleScheduleConfirm = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const scheduleId = selectedAppointment.schedule_id;

      // Update schedule status to COMPLETED
      const response = await axios.patch(
        `${API_URL}/api/auth/schedules/${scheduleId}/status`,
        { status: 'COMPLETED' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showToast('Schedule marked as completed', 'success');
      setSelectedAppointment(null); // Clear selection
      setShowConfirmModal(false);
      fetchEvents(); // Refresh the view

    } catch (error) {
      console.error('Error updating schedule status:', error);
      showToast('Error updating schedule status', 'error');
    } finally {
      setIsLoading(false);
    }
  };



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

      // Check for overlapping limit - NEW CODE
      const overlappingCount = countOverlappingEvents(backendEvents, newStartTime, newEndTime);

      // Enforce limit of 5 overlapping events
      if (overlappingCount >= 5) {
        showToast('Maximum limit reached: Cannot add more than 5 overlapping events at the same time', 'error');
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

      // Refresh the events to show the newly added event
      fetchEvents();

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









  // Helper function to convert 12-hour time format to 24-hour format
  // Handles "9:00 AM", "9:00", etc.
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "09:00";

    // Check if time string has AM/PM
    const hasAMPM = timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm');

    if (hasAMPM) {
      // Handle 12-hour format with AM/PM
      const isPM = timeStr.toLowerCase().includes('pm');
      // Remove AM/PM and trim
      const cleanTime = timeStr.toLowerCase().replace(/am|pm/g, '').trim();
      const [hourStr, minuteStr] = cleanTime.split(':');
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr || '0', 10);

      // Convert to 24-hour format
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    } else {
      // Already in 24-hour format or just missing AM/PM
      const [hourStr, minuteStr] = timeStr.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr || '0', 10);

      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
  };



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
                    // Add this prop to detect month changes
                    onActiveStartDateChange={({ activeStartDate }) => {
                      console.log("Calendar view changed to:", activeStartDate);
                      setViewedDate(activeStartDate);
                    }}
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        // Get the date string in YYYY-MM-DD format for comparison
                        const ds = getLocalDateString(date);

                        // Count active schedules for this date
                        const activeSchedules = calendarEvents.filter(event =>
                          event.date === ds && event.isSchedule && event.isActive
                        ).length;

                        // Count confirmed appointments for this date
                        const confirmedAppointments = calendarEvents.filter(event =>
                          event.date === ds && event.isAppointment && event.isActive
                        ).length;

                        // Total count of events
                        const totalCount = activeSchedules + confirmedAppointments;

                        // Only show badge if there are events (no zero badges)
                        return totalCount > 0 ? (
                          <span className="absolute top-1 right-1 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">
                            {totalCount}
                          </span>
                        ) : null;
                      }
                      return null;
                    }}
                    showNeighboringMonth={false}
                    className="p-2 rounded-lg mx-auto text-lg"
                  />





                </div>
              </div>

              {/* Today's Scheduled Tours */}
              <div className="min-w-[31rem] max-w-[31rem] flex flex-col min-h-[30rem] bg-white rounded-xl shadow-xl p-5">
                <span className="text-2xl font-semibold mb-4">Today's Scheduled Tours</span>
                <div className="w-full border-t border-gray-200 pt-4 space-y-3 max-h-120 overflow-y-auto">
                  {todayTours.length === 0 && (
                    <div className="bg-gray-100 text-gray-700 p-3 rounded-lg">
                      No Scheduled Tours
                    </div>
                  )}
                  {todayTours.map((tour, idx) => (
                    <div
                      key={tour.id || idx}
                      className={`
          ${idx % 2 === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}
          p-3 rounded-lg flex items-center justify-between
        `}
                    >
                      <div className="flex items-center flex-grow">
                        <div
                          className={`
              ${idx % 2 === 0 ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'}
              px-3 py-1.5 rounded mr-3 text-sm
            `}
                        >
                          {formatTimeTo12H(tour.startTime)}-{formatTimeTo12H(tour.endTime)}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">
                            {tour.organizer || 'No Name'}
                          </div>
                          <div className="text-sm truncate max-w-[150px]">
                            {tour.title}
                          </div>
                          {tour.numPeople && (
                            <div className="text-sm">{tour.numPeople}</div>
                          )}
                        </div>
                      </div>
                      {/* Show "done" label for completed tours */}
                      {tour.isDone && (
                        <div className="bg-green-500 text-xs px-2 py-1 rounded whitespace-nowrap">
                          tour done
                        </div>
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
                  appointments={backendEvents}  // Use backendEvents here
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
              {/* Live Clock with Time Context */}
              <div className="w-full rounded-xl bg-white shadow-xl p-6 flex items-center justify-center gap-x-8 hover:shadow-2xl transition-shadow">
                <div className="bg-gray-100 p-3 rounded-full">
                  <i className="text-5xl fa-solid fa-clock text-[#9590FF]" />
                </div>
                <div className="flex flex-col">
                  <LiveClock />
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

                  {/* Exclusive Event Warning/Helper */}
                  <div className="mt-2">
                    <div className="flex items-start">
                      <i className="fas fa-info-circle text-blue-500 mr-2 mt-1"></i>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Note:</span> You cannot schedule during times that have exclusive events.
                        {newAvailability === 'EXCLUSIVE' && (
                          <span className="block mt-1 text-amber-600">
                            This event will be marked as exclusive and will block other events during this time slot.
                          </span>
                        )}
                      </p>
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



              {/* Selected Appointment/Schedule */}
              <div className="w-full shadow-xl bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Selected Event</h2>
                {selectedAppointment ? (
                  <>
                    {/* Title with label based on type */}
                    <p className="mb-2">
                      <strong>{selectedAppointment.isAppointment ? 'Purpose:' : 'Title:'}</strong> {selectedAppointment.title}
                    </p>

                    {/* Show Visitor only for appointments */}
                    {selectedAppointment.isAppointment && selectedAppointment.organizer && (
                      <p className="mb-2">
                        <strong>Visitor:</strong> {selectedAppointment.organizer}
                      </p>
                    )}

                    {/* Time for both types */}
                    <p className="mb-2">
                      <strong>Time:</strong>{' '}
                      {formatTimeTo12H(selectedAppointment.startTime)} -{' '}
                      {formatTimeTo12H(selectedAppointment.endTime)}
                    </p>

                    {/* Number of People only for appointments */}
                    {selectedAppointment.isAppointment && selectedAppointment.numPeople && (
                      <p className="mb-2">
                        <strong>Number of People:</strong>{' '}
                        {selectedAppointment.numPeople}
                      </p>
                    )}

                    {/* Availability only for schedules */}
                    {selectedAppointment.isSchedule && (
                      <p className="mb-2">
                        <strong>Availability:</strong>{' '}
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${selectedAppointment.availability === 'EXCLUSIVE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {selectedAppointment.availability}
                        </span>
                      </p>
                    )}

                    {/* Description for both types */}
                    {selectedAppointment.description && (
                      <p className="mb-2">
                        <strong>Description:</strong>{' '}
                        <span className="text-gray-700">{selectedAppointment.description}</span>
                      </p>
                    )}


                    <div className="flex justify-end">
                      <button
                        onClick={handleMarkAsDone}
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                      >
                        Mark as Done
                      </button>
                    </div>

                  </>
                ) : (
                  <p className="text-gray-500 italic">No event selected</p>
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
      {/* AppointmentModal for completing appointments */}
      {showAppointmentModal && (
        <AppointmentModal
          showModal={showAppointmentModal}
          modalData={modalData}
          onClose={() => {
            setShowAppointmentModal(false);
            // Also clear selection when modal is closed
            setSelectedAppointment(null);
          }}
          onSend={() => {
            setShowAppointmentModal(false);
            setSelectedAppointment(null); // Add this line to clear selection
            fetchEvents(); // Refresh events
          }}
          updateAppointmentStatus={async (id, status, presentCount) => {
            try {
              const token = localStorage.getItem('token');
              await axios.patch(
                `${API_URL}/api/auth/appointment/${id}/status`,
                {
                  status,
                  present_count: presentCount
                },
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              showToast(`Appointment status updated to ${status}`, 'success');
              fetchEvents(); // Refresh events
              setSelectedAppointment(null); // Also add here to ensure selection is cleared
            } catch (error) {
              console.error('Error updating appointment status:', error);
              showToast('Error updating appointment status', 'error');
            }
          }}
        />
      )}


      {/* Confirmation modal for schedules */}
      {showConfirmModal && (
        // Replace the existing modal backdrop div with this:

        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Mark Schedule as Completed</h3>
            <p className="mb-6">
              Are you sure you want to mark this schedule as completed?
              <br />
              <span className="font-semibold">{selectedAppointment?.title}</span>
              <br />
              <span className="text-sm text-gray-500">
                {selectedAppointment?.date}, {formatTimeTo12H(selectedAppointment?.startTime)} - {formatTimeTo12H(selectedAppointment?.endTime)}
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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

export default Schedule
