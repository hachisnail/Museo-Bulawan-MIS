import { useState, useEffect, useRef } from "react";

const LiveClock = () => {
  const [time, setTime] = useState('');
  const [timeLabel, setTimeLabel] = useState('');
  // Use a ref to keep track of the DOM element that needs updating
  const timeDisplayRef = useRef(null);
  const labelDisplayRef = useRef(null);
  
  useEffect(() => {
    // Function to update clock
    const updateClock = () => {
      const now = new Date();
      
      // Format time as 12-hour with am/pm
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      // Create the time string
      const timeString = `${hours}:${minutes}${ampm}`;
      
      // Set the time string in state
      setTime(timeString);
      
      // Also directly update the DOM if the ref is available
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = timeString;
      }
      
      // Set time context label
      let newLabel = '';
      if (hours >= 8 && hours < 11 && ampm === 'am') {
        newLabel = 'Good Morning';
      } else if ((hours >= 11 && hours <= 12 && ampm === 'am') || (hours === 12 && ampm === 'pm')) {
        newLabel = 'Lunch Time';
      } else if (hours >= 1 && hours <= 5 && ampm === 'pm') {
        newLabel = 'Good Afternoon';
      } else if (hours >= 6 && hours <= 10 && ampm === 'pm') {
        newLabel = 'Good Evening';
      } else {
        newLabel = 'Good Night';
      }
      
      setTimeLabel(newLabel);
      
      // Also directly update the label in DOM
      if (labelDisplayRef.current) {
        labelDisplayRef.current.textContent = newLabel;
      }
    };
    
    // Update clock immediately
    updateClock();
    
    // Update clock every second
    const intervalId = setInterval(updateClock, 1000);
    
    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <>
      <span className="text-5xl font-bold" ref={timeDisplayRef}>{time}</span>
      <span className="text-2xl font-semibold text-end text-[#9590FF]" ref={labelDisplayRef}>
        {timeLabel}
      </span>
    </>
  );
};

export default LiveClock;
