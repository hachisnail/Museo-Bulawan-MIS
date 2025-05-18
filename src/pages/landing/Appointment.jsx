import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ScrollRestoration } from 'react-router-dom';
import LandingNav from '../../components/navbar/LandingNav';
import CustomDatePicker from '../../components/function/CustomDatePicker';
import useAddressLogic from '../../components/function/AddressHook';

function TypedDropdown({
  placeholder,
  options,
  selectedItem,
  onChange,
  disabled = false
}) {
  const [inputText, setInputText] = useState(selectedItem?.name || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    setInputText(selectedItem?.name || '');
  }, [selectedItem]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onChange(item);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange(null);
    setInputText('');
    setShowDropdown(false);
  };

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(inputText.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex border-2 border-black rounded-2xl px-4 py-3 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
      >
        <input
          className="outline-none flex-grow placeholder-gray-500 text-base md:text-lg"
          placeholder={placeholder}
          value={inputText}
          disabled={disabled}
          onChange={(e) => {
            setInputText(e.target.value);
            if (!disabled) {
              setShowDropdown(true);
            }
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
        />
        {selectedItem && !disabled && (
          <button
            type="button"
            className="ml-2 text-black font-bold"
            onClick={handleClear}
          >
            X
          </button>
        )}
      </div>

      {showDropdown && !disabled && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-400 shadow-md rounded-md">
          {filteredOptions.length ? (
            filteredOptions.map((o) => (
              <li
                key={o.code}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(o)}
              >
                {o.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}

const Appointment = () => {
  const {
    provinces,
    cities,
    barangays,
    selectedProvince,
    setSelectedProvince,
    selectedCity,
    setSelectedCity,
    selectedBarangay,
    setSelectedBarangay
  } = useAddressLogic();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [street, setStreet] = useState('');

  const [purpose, setPurpose] = useState('');
  const [populationCount, setPopulationCount] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [showPurposeInfo, setShowPurposeInfo] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Add state for time slot availability
  const [timeSlotCounts, setTimeSlotCounts] = useState({});
  const [timeSlotExclusive, setTimeSlotExclusive] = useState({});
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  // Add this with your other state declarations
  const [confirmedSlots, setConfirmedSlots] = useState({});

  const togglePurposeInfo = () => setShowPurposeInfo(!showPurposeInfo);
  const isTimeRequired = (purp) =>
    purp === 'School Field Trip' || purp === 'Workshops or Classes';
  const shouldShowTimeOptions = (purp) =>
    purp === 'School Field Trip' ||
    purp === 'Workshops or Classes' ||
    purp === 'Others';

  function convertTimeFormatToUIKey(startTime, endTime) {
    // Map 24-hour time back to UI display format
    const timeMap = {
      "09:00-10:29": "09:00-10:29",
      "10:30-11:59": "10:30-11:59",
      "13:00-14:29": "01:00-02:29", // 1:00 PM - 2:29 PM
      "14:30-16:00": "02:30-04:00"  // 2:30 PM - 4:00 PM
    };

    const standardKey = `${startTime}-${endTime}`;

    // Return the UI format key if found in our mapping
    if (timeMap[standardKey]) {
      return timeMap[standardKey];
    }

    // Check if we have 12-hour format already
    if (timeMap.values().includes(standardKey)) {
      return standardKey;
    }

    return null;
  }

  // Function to check time slot availability considering both appointments and schedules
  // Inside the checkTimeSlotAvailability function
  const checkTimeSlotAvailability = async (date) => {
    if (!date) return;

    setIsLoadingTimeSlots(true);
    console.log('Checking availability for date:', date);

    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      console.log('Formatted date:', formattedDate);

      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const timeSlots = ['09:00-10:29', '10:30-11:59', '01:00-02:29', '02:30-04:00'];
      const counts = {};
      const exclusive = {};
      const confirmedSlots = {}; // Track confirmed appointments

      timeSlots.forEach(slot => {
        counts[slot] = 0;
        exclusive[slot] = false;
        confirmedSlots[slot] = false;
      });

      // Fetch confirmed appointments
      console.log('Fetching appointments...');
      const appointmentResponse = await axios.get(`${API_URL}/api/auth/appointment`, { withCredentials: true });
      console.log('Appointments fetched:', appointmentResponse.data);

      const todayAppointments = appointmentResponse.data.filter(appointment => {
        const appointmentDate = appointment.preferred_date.split('T')[0];
        return appointmentDate === formattedDate;
      });
      console.log('Today\'s appointments:', todayAppointments);

      // Inside checkTimeSlotAvailability function
      todayAppointments.forEach(appointment => {
        const status = (appointment.AppointmentStatus?.status || '').toUpperCase();
        if (status === 'CONFIRMED') {
          if (appointment.start_time && appointment.end_time) {
            // Convert HH:MM:SS to HH:MM format
            let startTime = appointment.start_time.substring(0, 5);
            let endTime = appointment.end_time.substring(0, 5);

            // Create a standardized time slot key by converting to 24-hour format if needed
            let timeSlotKey;

            // Check if we need to convert from 12-hour to 24-hour format
            const startHour = parseInt(startTime.split(':')[0], 10);
            const endHour = parseInt(endTime.split(':')[0], 10);

            // Convert afternoon hours (1-4) to 24-hour format
            if (startHour >= 1 && startHour <= 4) {
              const convertedStartHour = startHour + 12;
              startTime = `${convertedStartHour}:${startTime.split(':')[1]}`;
            }

            if (endHour >= 1 && endHour <= 4) {
              const convertedEndHour = endHour + 12;
              endTime = `${convertedEndHour}:${endTime.split(':')[1]}`;
            }

            // Find matching time slot in UI format
            const mappedKey = convertTimeFormatToUIKey(startTime, endTime);

            if (mappedKey) {
              confirmedSlots[mappedKey] = true; // Block this time slot
            }
          }
        }
      });


      // Fetch exclusive schedules
      console.log('Fetching schedules...');
      const scheduleResponse = await axios.get(`${API_URL}/api/auth/schedules?date=${formattedDate}`, { withCredentials: true });
      console.log('Schedules fetched:', scheduleResponse.data);

      if (scheduleResponse.data && Array.isArray(scheduleResponse.data)) {
        scheduleResponse.data.filter(schedule => schedule.status !== 'COMPLETED').forEach(schedule => {
          console.log('Processing schedule:', schedule);
          if (schedule.start_time && schedule.end_time) {
            timeSlots.forEach(slot => {
              const [slotStart, slotEnd] = slot.split('-');
              if (checkTimeOverlap(schedule.start_time, schedule.end_time, slotStart, slotEnd)) {
                console.log(`Overlap found for slot ${slot}`);
                if (schedule.availability === 'EXCLUSIVE') {
                  exclusive[slot] = true;
                  console.log(`Slot ${slot} marked as exclusive`);
                } else {
                  counts[slot] += 1;
                  console.log(`Count increased for slot ${slot}`);
                }
              }
            });
          }
        });
      }

      console.log('Final counts:', counts);
      console.log('Final exclusive slots:', exclusive);
      console.log('Final confirmed slots:', confirmedSlots);

      // Update time slot counts, exclusivity, and confirmed slots
      setTimeSlotCounts(counts);
      setTimeSlotExclusive(exclusive);
      setConfirmedSlots(confirmedSlots);

    } catch (error) {
      console.error('Error checking time slot availability:', error);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const checkTimeOverlap = (start1, end1, start2, end2) => {
    const timeToMinutes = (timeStr) => {
      // First standardize the time format
      let hour, minute;

      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
        // Handle 12-hour format with AM/PM indicator
        const isPM = timeStr.toLowerCase().includes('pm');
        const timePart = timeStr.toLowerCase().replace(/am|pm/g, '').trim();
        const [hourStr, minuteStr] = timePart.split(':');
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr || '0', 10);

        // Convert to 24-hour format
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
      } else {
        // Handle format without AM/PM indicator
        const cleanTime = timeStr.split(':').slice(0, 2).join(':');
        const [hourStr, minuteStr] = cleanTime.split(':');
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr || '0', 10);

        // Museum hours are 9:00am-5:00pm
        // For hours between 1 and 5 without AM/PM indicator, assume PM (13:00-17:00)
        if (hour >= 1 && hour <= 5) {
          hour += 12; // Convert to 24-hour format (e.g., 2:30 becomes 14:30)
        }
        // Hours 9-12 remain as is (assumed to be AM)
      }

      return hour * 60 + minute;
    };

    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    console.log(`Converted times - T1: ${s1}-${e1} minutes, T2: ${s2}-${e2} minutes`);
    const hasOverlap = s1 < e2 && s2 < e1;
    console.log(`Overlap result: ${hasOverlap}`);

    return hasOverlap;
  };

  // Fetch time slot availability when date changes
  useEffect(() => {
    if (selectedDate) {
      checkTimeSlotAvailability(selectedDate);
    }
  }, [selectedDate]);

  // Automatically capitalize the first letter of the name fields
  const handleFirstNameChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setLastName(value);
  };

  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  // Inside your Appointment component...
  const handleSubmit = async () => {
    // Close the modal
    setShowConfirmationModal(false);

    // Extract start and end times from the time range if selected
    let startTimeValue = null;
    let endTimeValue = null;

    if (selectedTime) {
      const [startTime, endTime] = selectedTime.split('-');

      // Convert to 24-hour format
      const convertTo24Hour = (timeStr) => {
        const [hourStr, minuteStr] = timeStr.split(':');
        let hour = parseInt(hourStr, 10);
        // For hours 1-5 without AM/PM, assume PM (13:00-17:00)
        if (hour >= 1 && hour <= 5) {
          hour += 12; // Convert to 24-hour format
        }
        return `${hour.toString().padStart(2, '0')}:${minuteStr}:00`;
      };

      startTimeValue = convertTo24Hour(startTime);
      endTimeValue = convertTo24Hour(endTime);
    }


    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      organization,
      province: selectedProvince?.name || '',
      barangay: selectedBarangay?.name || '',
      city_municipality: selectedCity?.name || '',
      street,
      purpose_of_visit: purpose,
      population_count: populationCount,
      preferred_date: selectedDate
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : null,
      preferred_time: selectedTime,
      start_time: startTimeValue,
      end_time: endTimeValue,
      additional_notes: additionalNotes
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL
      const response = await axios.post(
        `${API_URL}/api/auth/appointment`,
        payload
      );

      if (response.status === 201) {
        // Clear fields after successful submission
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setOrganization('');
        setStreet('');
        setPurpose('');
        setPopulationCount('');
        setSelectedDate(null);
        setSelectedTime('');
        setAdditionalNotes('');
        setSelectedProvince(null);
        setSelectedCity(null);
        setSelectedBarangay(null);

        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        console.error('Error:', response.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <>
      <ScrollRestoration />

      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white py-3 px-5 rounded-md shadow-lg">
          Appointment submitted successfully!
        </div>
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[90%] max-w-md mx-auto p-6 rounded-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-6">
              Are you sure you want to submit this appointment?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 border-2 border-gray-400 rounded-md hover:bg-gray-100"
              >
                No, Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-screen h-full pt-7">
        <LandingNav />

        <div className="w-full bg-white py-6 font-medium font-[HinaMincho] shadow-lg my-5 px-4 md:px-20">
          <span className="text-3xl md:text-5xl">Appointment Form</span>
        </div>

        <div className="mx-4 md:mx-20 py-4 px-2 md:px-12">
          <div className="flex flex-col md:flex-row w-full gap-x-10 gap-y-6 mb-10">
            <div className="flex flex-col font-[HindKochi] text-2xl md:text-3xl">
              <div className="flex items-center gap-x-3">
                <i className="text-4xl md:text-5xl fa-solid fa-clock"></i>
                <span className="font-bold">Museo Bulawan</span>
              </div>
              <span className="ml-9">
                Open Daily 9:00am-5:00pm, Monday-Friday
              </span>
            </div>
            <div className="flex flex-col font-[HindKochi] text-2xl md:text-3xl">
              <div className="flex items-center gap-x-3">
                <i className="text-4xl md:text-5xl fa-solid fa-location-dot"></i>
                <span className="font-bold">Museum Location</span>
              </div>
              <span className="ml-9">
                Camarines Norte Provincial Capitol Grounds, Daet Philippines
              </span>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-lg p-6 md:p-8 mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl md:text-4xl font-bold">
                Tell Us About Yourself
              </span>
            </div>

            <form onSubmit={handleOpenConfirmation} className="mt-6 space-y-6">
              {/* First Name */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  First Name
                  {!firstName.trim() && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              {/* Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Last Name
                  {!lastName.trim() && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={handleLastNameChange}
                  className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Email
                  {!email.trim() && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
                <label className="md:col-span-2 text-lg md:text-xl font-bold">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+639123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="^(09|\+639)\d{9}$"
                  title="Please enter a valid PH phone number starting with 09 or +639 (e.g. 09123456789 / +639123456789)"
                  className="md:col-span-3 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              {/* Organization */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Organization
                </label>
                <input
                  type="text"
                  placeholder="School/Institution/etc"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              {/* Province and City */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Province
                  {!selectedProvince?.name && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <div className="md:col-span-4">
                  <TypedDropdown
                    placeholder="Type or choose Province"
                    options={provinces}
                    selectedItem={selectedProvince}
                    onChange={setSelectedProvince}
                  />
                </div>

                <label className="md:col-span-2 text-lg md:text-xl font-bold">
                  City/Municipality
                  {!selectedCity?.name && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <div className="md:col-span-3">
                  <TypedDropdown
                    placeholder="Type or choose City"
                    options={cities}
                    selectedItem={selectedCity}
                    onChange={setSelectedCity}
                    disabled={!selectedProvince}
                  />
                </div>
              </div>

              {/* Barangay and Street */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Barangay
                  {!selectedBarangay?.name && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <div className="md:col-span-4">
                  <TypedDropdown
                    placeholder="Type or choose Barangay"
                    options={barangays}
                    selectedItem={selectedBarangay}
                    onChange={setSelectedBarangay}
                    disabled={!selectedCity}
                  />
                </div>
                <label className="md:col-span-2 text-lg md:text-xl font-bold">
                  Street
                </label>
                <input
                  type="text"
                  placeholder="Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="md:col-span-3 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              {/* Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 relative">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Purpose of Visit
                  {!purpose.trim() && <span className="text-red-500"> *</span>}
                </label>
                <div className="md:col-span-9 flex items-center gap-x-3">
                  <select
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg w-full"
                  >
                    <option value="">Choose Purpose</option>
                    <optgroup label="Document Access Request">
                      <option>Research Paper</option>
                    </optgroup>
                    <optgroup label="Engagements">
                      <option>School Field Trip</option>
                      <option>Museum Group Tour</option>
                      <option>Interviews</option>
                      <option>Collaboration Meetings</option>
                      <option>Photography or Media Projects</option>
                      <option>Conservation Consultation</option>
                    </optgroup>
                  </select>

                  <button
                    onClick={togglePurposeInfo}
                    type="button"
                    className="w-10 h-10 flex items-center justify-center border border-black rounded-full text-2xl font-bold hover:bg-gray-200"
                    title="View purpose details"
                  >
                    ?
                  </button>

                  {showPurposeInfo && (
                    <div className="absolute z-50 w-[300px] md:w-[400px] top-full right-0 mt-2 bg-white shadow-md border border-gray-400 p-4 md:p-8 rounded-md">
                      <div className="mb-5 flex items-center">
                        <div className="rounded-full border border-black w-8 h-8 flex items-center justify-center mr-3 font-bold text-base">
                          ?
                        </div>
                        <span className="font-semibold text-xl md:text-2xl">
                          Document Access Request
                        </span>
                      </div>
                      <ol className="list-decimal ml-8 mb-6 text-base md:text-lg">
                        <li>
                          <strong>Research Paper:</strong> Accessing archives or materials for academic research
                        </li>
                      </ol>

                      <div className="mb-5 flex items-center">
                        <div className="rounded-full border border-black w-8 h-8 flex items-center justify-center mr-3 font-bold text-base">
                          ?
                        </div>
                        <span className="font-semibold text-xl md:text-2xl">
                          Engagements
                        </span>
                      </div>
                      <ol className="list-decimal ml-8 text-base md:text-lg">
                        <li>
                          <strong>School Field Trip:</strong> Educational visits for students
                        </li>
                        <li>
                          <strong>Museum Group Tour:</strong> Guided tours for visitor groups
                        </li>
                        <li>
                          <strong>Interviews:</strong> Meeting museum staff
                        </li>
                        <li>
                          <strong>Collaboration Meetings:</strong> Joint projects
                        </li>
                        <li>
                          <strong>Photography / Media Projects:</strong> Shoots or filming
                        </li>
                        <li>
                          <strong>Conservation Consultation:</strong> Advice/services
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>


              {/* Population Count */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Population Count
                  {!populationCount.trim() && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={populationCount}
                  onChange={(e) => setPopulationCount(e.target.value)}
                  className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              {/* Preferred Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Preferred Date
                  {!selectedDate && <span className="text-red-500"> *</span>}
                </label>
                <div className="md:col-span-4">
                  <CustomDatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText="Month Day, Year"
                    dateFormat="MMMM d, yyyy"
                    className="px-4 py-3 w-full border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                  />
                </div>

                {shouldShowTimeOptions(purpose) ? (
                  <>
                    <label className="md:col-span-2 text-lg md:text-xl font-bold">
                      Select your preferred Time
                      {isTimeRequired(purpose) && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <div className="md:col-span-3 flex flex-wrap gap-2 md:gap-3">
                      {['09:00-10:29', '10:30-11:59', '01:00-02:29', '02:30-04:00'].map((time) => {
                        // Check if slot is unavailable due to exclusivity, count limit, or confirmed appointment
                        const isExclusive = timeSlotExclusive[time];
                        const hasConfirmedAppointment = confirmedSlots[time];
                        const isUnavailable = isExclusive || hasConfirmedAppointment;

                        let unavailabilityReason = '';
                        if (isExclusive) {
                          unavailabilityReason = 'This time slot has an exclusive schedule and is not available.';
                        } else if (hasConfirmedAppointment) {
                          unavailabilityReason = 'This time slot already has a confirmed appointment.';
                        }

                        return (
                          <div key={time} className="relative group">
                            <label
                              className={`cursor-pointer border-2 border-black px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-100 
          ${selectedTime === time ? 'bg-[#cfdac8]' : ''} 
          ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <input
                                type="radio"
                                name="preferredTime"
                                value={time}
                                required={isTimeRequired(purpose)}
                                className="hidden"
                                onChange={() => !isUnavailable && setSelectedTime(time)}
                                disabled={isUnavailable}
                              />
                              <span className="text-sm md:text-lg font-medium">{time}</span>
                              {isUnavailable && (
                                <span className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center text-red-600">
                                  <i className="fa-solid fa-times text-xl"></i>
                                </span>
                              )}
                            </label>

                            {/* Hover tooltip for unavailable time slots */}
                            {isUnavailable && (
                              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm pointer-events-none">
                                {unavailabilityReason}
                              </div>
                            )}
                          </div>
                        );
                      })}


                    </div>
                    {isLoadingTimeSlots && (
                      <div className="md:col-span-5 text-sm text-gray-500 mt-1">
                        Checking availability...
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2" />
                    <div className="md:col-span-3" />
                  </>
                )}
              </div>

              {/* Additional Notes */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-4">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Additional Notes
                </label>
                <textarea
                  rows="4"
                  placeholder="Any extra info or requests"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#524433] text-white px-6 md:px-10 py-3 rounded-full hover:bg-[#3e3428] transition text-base md:text-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
