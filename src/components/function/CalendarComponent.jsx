import React, { useState, useEffect } from 'react';

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
      // Replace with your actual API endpoint
      const response = await fetch('/api/events');
      const data = await response.json();
      
      // Format events by date for easier lookup
      const eventsByDate = {};
      data.forEach(event => {
        const dateStr = event.date.split('T')[0];
        if (!eventsByDate[dateStr]) {
          eventsByDate[dateStr] = [];
        }
        eventsByDate[dateStr].push(event);
      });
      
      setEvents(eventsByDate);
    } catch (error) {
      console.error('Error fetching events:', error);
      
      setEvents({
        "2025-04-01": [{ title: "Monthly Meeting", description: "Team sync", special: false }],
        "2025-04-09": [{ title: "Important Event", description: "Priority task", special: true }],
        "2025-04-17": [{ title: "Conference", description: "Annual industry meet", special: false }],
        "2025-04-18": [{ title: "Conference Day 2", description: "Workshops", special: false }],
        "2025-04-19": [{ title: "Conference Day 3", description: "Networking", special: false }],
        "2025-04-20": [{ title: "Report Due", description: "Submit quarterly report", special: false }],
      });
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

  return (
    <div className="w-full mx-auto px-4 py-8 flex flex-col gap-y-5">
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
            const isSpecialEvent = hasEvents && events[dateStr].some(event => event.special === true);

            const isTodayDate = isToday(date);
            
            return (
              <div 
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  h-28 border border-gray-200 p-2 cursor-pointer transition
                  ${!date.isCurrentMonth ? 'text-gray-400' : ''}
                  ${isTodayDate ? 'bg-[#e0c67d]' : ''}
                  ${hasEvents && !isSpecialEvent && !isTodayDate ? 'bg-yellow-100' : ''}
                  ${isSpecialEvent ? 'bg-[#7d8e6a] text-white' : ''}
                  hover:bg-gray-100
                `}
              >
                <span className={`text-sm ${isTodayDate ? 'font-bold' : ''}`}>
                  {date.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  border-1 border-gray-400 w-full max-w-md mx-4 overflow-hidden">
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
                <i class="fas fa-times text-xl cursor-pointer"></i>
              </button>
            </div>
            <div className="px-6 py-4">
              {selectedEvents.length === 0 ? (
                <p className="text-gray-500">No events for this date</p>
              ) : (
                <div className="space-y-4">
                  {selectedEvents.map((event, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <h4 className="font-medium text-lg">{event.title}</h4>
                      {event.description && (
                        <p className="text-gray-600 mt-1">{event.description}</p>
                      )}
                      {event.time && (
                        <p className="text-gray-500 text-sm mt-2">{event.time}</p>
                      )}
                    </div>
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
