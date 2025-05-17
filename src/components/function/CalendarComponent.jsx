import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Calendar = () => {
  const now = new Date();
  const [currentDate] = useState(now); 
  const [currentMonth] = useState(now.getMonth());
  const [currentYear] = useState(now.getFullYear());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);


  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/public-articles`);
      // Group articles by date (YYYY-MM-DD)
      const eventsByDate = {};
      response.data.forEach(article => {
        console.log("Article:", article);
        if (!article.upload_date) return;
        const dateStr = article.upload_date.split('T')[0];
        if (!eventsByDate[dateStr]) {
          eventsByDate[dateStr] = [];
        }
        eventsByDate[dateStr].push(article);
      });
      setEvents(eventsByDate);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents({});
    }
  };

  // Calendar rendering helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Get days from previous month
    const daysFromPrevMonth = firstDay;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    const days = [];
    
    // Add days from previous month
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      days.push({
        day: i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month (to fill a 6-row grid)
    const totalDaysShown = 42; // 6 rows of 7 days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
    for (let i = 1; days.length < totalDaysShown; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    const dateStr = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    setSelectedDate(new Date(date.year, date.month, date.day));
    setSelectedEvents(events[dateStr] || []);
    setModalOpen(true);
  };

  // Check if a date is today
  const isToday = (date) => {
    return date.day === currentDate.getDate() && 
           date.month === currentDate.getMonth() && 
           date.year === currentDate.getFullYear();
  };

  const calendarDays = generateCalendarDays();

 const encodeId = (id, name) => {
  const encodedString = `${id}::${name}`;
  return btoa(encodedString);
};

  return (
    <div className="w-full mx-auto md:px-4 py-8 flex flex-col gap-y-5">
      {/* Month Header */}
      <span className='text-8xl font-hina'>{monthNames[currentMonth]}</span>
      
      {/* Calendar Grid */}
      <div className="bg-white overflow-hidden shadow">
        {/* Calendar Header */}
        <div className="grid h-20 items-center grid-cols-7 bg-gray-900 text-white">
          {weekdays.map((day, index) => (
            <div key={index} className="py-2 h-full flex justify-center items-center text-center font-medium">
             <span className='text-xl font-semibold'>{day}</span> 
            </div>
          ))}
        </div>
        
        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dateStr = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
            const hasEvents = events[dateStr] && events[dateStr].length > 0;
            const isTodayDate = isToday(date);
            
            return (
              <div 
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                 h-23 xl:h-28 border border-gray-200 p-2 cursor-pointer transition
                  ${!date.isCurrentMonth ? 'text-gray-400' : ''}
                  ${isTodayDate ? 'bg-[#e0c67d]' : ''}
                  ${hasEvents && !isTodayDate ? 'bg-yellow-100' : ''}
                  hover:bg-gray-100
                `}
              >
                <span className={`text-sm ${isTodayDate ? 'font-bold' : ''}`}>
                  {date.day}
                </span>
                {/* Show article titles if any */}
                {hasEvents && (
                  <div className="mt-1 space-y-1">
                    {events[dateStr].slice(0, 2).map((event, idx) => (
                      <div key={idx} className="text-xs truncate text-black font-semibold">
                        {event.title}
                      </div>
                    ))}
                    {events[dateStr].length > 2 && (
                      <div className="text-xs text-gray-500">+{events[dateStr].length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-1 border-gray-400 w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {selectedDate?.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl cursor-pointer"></i>
              </button>
            </div>
            <div className="px-6 py-4">
              {selectedEvents.length === 0 ? (
  <p className="text-gray-500">No events for this date</p>
) : (
  <div className="space-y-4">
    {selectedEvents.map((event, index) => (
  <NavLink
    key={index}
    to={`/article/${encodeId(event.article_id, event.title)}`}
    className="block border-b border-gray-200 pb-4 last:border-0 cursor-pointer hover:bg-gray-100 transition"
    onClick={() => setModalOpen(false)}
    title={event.title}
  >
    <h4 className="font-medium text-lg text-blue-700 underline">{event.title}</h4>
    {event.article_category && (
      <p className="text-gray-600 mt-1">{event.article_category}</p>
    )}
    {/* You can add more fields here if needed */}
  </NavLink>
))}
  </div>
)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
