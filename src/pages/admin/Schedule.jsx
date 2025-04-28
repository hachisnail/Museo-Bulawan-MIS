// Schedule.jsx

import React, { useState } from 'react'
import AdminNav from '../../components/navbar/AdminNav'
import Calendar from 'react-calendar'
import TimePicker from 'react-time-picker'
import 'react-calendar/dist/Calendar.css'
import 'react-time-picker/dist/TimePicker.css'
import appointments from '../admin/sample.json'

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
                // Toggle selection - if already selected, deselect it
                if (selectedAppointment && selectedAppointment.id === ev.id) {
                  onSelectAppointment(null)
                } else {
                  onSelectAppointment(ev)
                }
              }}
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
                `}
              >
                <div
                  className={`
                    border-l-4
                    ${isSelected ? 'border-white' : 'border-black'}
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
                  absolute top-0 left-0 w-[20rem] max-w-[90vw]
                  min-h-[6rem]
                  border ${isSelected ? 'border-white' : 'border-black'}
                  rounded-lg shadow-2xl p-4
                  flex flex-col justify-between
                  z-50 opacity-0 group-hover:opacity-100
                  transition-all duration-300 ease-in-out
                  ${isSelected ? 'bg-gray-500 text-white' : 'bg-white'}
                  hover:scale-90
                  origin-top-left
                  w-full
                `}
              >
                <div
                  className={`
                    border-l-4
                    ${isSelected ? 'border-white' : 'border-black'}
                    pl-3 flex-1 flex flex-col justify-between relative
                  `}
                >
                  <div className="flex-1 overflow-visible">
                    <p className="font-bold text-base break-words">{ev.title}</p>
                    {ev.organizer && <p className="text-sm break-words">{ev.organizer}</p>}
                    {ev.numPeople && <p className="text-sm break-words">{ev.numPeople}</p>}
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

  // Track the currently selected appointment from the DayScheduler
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // State to manage new schedule form
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newStartTime, setNewStartTime] = useState('09:00')
  const [newEndTime, setNewEndTime] = useState('10:00')

  // Build a local date string for the selected date (no UTC offset).
  const dateString = getLocalDateString(selectedDate)

  // Filter only items that match selected day for "Today's Scheduled Tours"
  const todaysTours = appointments
    .filter((apt) => apt.date === dateString)
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime))

  const handleAddEvent = () => {
    console.log('New event:', {
      title: newTitle,
      description: newDesc,
      startTime: newStartTime,
      endTime: newEndTime,
      date: dateString
    })
    // Clear fields
    setNewTitle('')
    setNewDesc('')
    setNewStartTime('09:00')
    setNewEndTime('10:00')
    // For real usage, you'd dispatch or call an API here
  }

  // Labels
  const monthLabel =
    selectedDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    selectedDate.getFullYear()
  const weekdayName = selectedDate.toLocaleString('default', { weekday: 'long' })
  const dayNum = selectedDate.getDate()

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
                  appointments={appointments}
                  selectedDate={selectedDate}
                  onSelectAppointment={setSelectedAppointment}
                  selectedAppointment={selectedAppointment}
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
    </>
  )
}

export default Schedule
