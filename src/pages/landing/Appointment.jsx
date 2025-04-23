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

  const togglePurposeInfo = () => setShowPurposeInfo(!showPurposeInfo);
  const isTimeRequired = (purp) =>
    purp === 'School Field Trip' || purp === 'Workshops or Classes';
  const shouldShowTimeOptions = (purp) =>
    purp === 'School Field Trip' ||
    purp === 'Workshops or Classes' ||
    purp === 'Others';

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

  const handleSubmit = async () => {
    // Close the modal
    setShowConfirmationModal(false);

    // Create the local Philippine time string:
    const creationDatePH = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila'
    });

    const finalPreferredTime = selectedTime || 'Flexible';

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
        ? selectedDate.toISOString().split('T')[0]
        : null,
      preferred_time: finalPreferredTime,
      additional_notes: additionalNotes,
      // Add creation date in PH time
      creation_date: creationDatePH
    };

    try {
    const API_URL = import.meta.env.VITE_API_URL

      const response = await axios.post(
        `${API_URL}/api/auth/appointment`,
        payload
      );

      // If the server responds with 201 for success
      if (response.status === 201) {
        // Clear fields
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
                    <optgroup label="Educational Purposes">
                      <option>Research</option>
                      <option>Thesis or Dissertation Work</option>
                      <option>School Field Trip</option>
                      <option>Workshops or Classes</option>
                    </optgroup>
                    <optgroup label="Professional Engagements">
                      <option>Interviews</option>
                      <option>Collaboration Meetings</option>
                      <option>Photography or Media Projects</option>
                      <option>Conservation Consultation</option>
                      <option>Donations</option>
                      <option>Others</option>
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
                          Educational Purposes
                        </span>
                      </div>
                      <ol className="list-decimal ml-8 mb-6 text-base md:text-lg">
                        <li>
                          <strong>Research:</strong> Accessing archives or materials
                        </li>
                        <li>
                          <strong>Thesis / Dissertation:</strong> Consulting artifacts
                        </li>
                        <li>
                          <strong>School Field Trips:</strong> Coordinating visits
                        </li>
                        <li>
                          <strong>Workshops or Classes:</strong> Art/history sessions
                        </li>
                      </ol>

                      <div className="mb-5 flex items-center">
                        <div className="rounded-full border border-black w-8 h-8 flex items-center justify-center mr-3 font-bold text-base">
                          ?
                        </div>
                        <span className="font-semibold text-xl md:text-2xl">
                          Professional Engagements
                        </span>
                      </div>
                      <ol className="list-decimal ml-8 text-base md:text-lg">
                        <li>
                          <strong>Interviews:</strong> Meeting museum staff
                        </li>
                        <li>
                          <strong>Collaboration Meetings:</strong> Joint projects
                        </li>
                        <li>
                          <strong>Photography / Media:</strong> Shoots or filming
                        </li>
                        <li>
                          <strong>Conservation Consultation:</strong> Advice/services
                        </li>
                        <li>
                          <strong>Donations:</strong> Offering items/funds
                        </li>
                        <li>
                          <strong>Others:</strong> More specialized engagements
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
                      {['09:00-10:29', '10:30-11:59', '01:00-02:29', '02:30-04:00'].map((time) => (
                        <label
                          key={time}
                          className={`cursor-pointer border-2 border-black px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-100 ${selectedTime === time ? 'bg-[#cfdac8]' : ''
                            }`}
                        >
                          <input
                            type="radio"
                            name="preferredTime"
                            value={time}
                            required={isTimeRequired(purpose)}
                            className="hidden"
                            onChange={() => setSelectedTime(time)}
                          />
                          <span className="text-sm md:text-lg font-medium">
                            {time}
                          </span>
                        </label>
                      ))}
                    </div>
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
