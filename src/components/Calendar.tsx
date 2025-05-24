import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  events?: {
    date: Date;
    title: string;
    color: string;
  }[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  
  useEffect(() => {
    if (selectedDate) {
      setDisplayedMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  
  // Get month details
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Calculate first day of the week (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Get days from previous month to display
  const prevMonthDays = [];
  const daysFromPrevMonth = firstDayOfWeek;
  const prevMonth = new Date(year, month, 0);
  const prevMonthDaysCount = prevMonth.getDate();
  
  for (let i = prevMonthDaysCount - daysFromPrevMonth + 1; i <= prevMonthDaysCount; i++) {
    prevMonthDays.push({
      day: i,
      month: 'prev',
      date: new Date(year, month - 1, i)
    });
  }
  
  // Current month days
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      day: i,
      month: 'current',
      date: new Date(year, month, i)
    });
  }
  
  // Next month days to fill the grid
  const nextMonthDays = [];
  const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
  const daysFromNextMonth = 42 - totalDaysDisplayed; // 6 rows * 7 days = 42
  
  for (let i = 1; i <= daysFromNextMonth; i++) {
    nextMonthDays.push({
      day: i,
      month: 'next',
      date: new Date(year, month + 1, i)
    });
  }
  
  // Combine all days
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  
  // Format month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedMonth = `${monthNames[month]} ${year}`;
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setDisplayedMonth(new Date(year, month - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setDisplayedMonth(new Date(year, month + 1, 1));
  };
  
  // Check if a date has events
  const getEventForDate = (date: Date) => {
    return events.find(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is selected
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  return (
    <Box sx={{ width: '100%', bgcolor: 'white', p: 2, borderRadius: 2, height: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header with month navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <IconButton size="small" onClick={goToPrevMonth} sx={{ color: '#999' }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ color: '#333333' }}>
          {formattedMonth}
        </Typography>
        <IconButton size="small" onClick={goToNextMonth} sx={{ color: '#999' }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      
      {/* Days of week */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mt: 1 }}>
        {daysOfWeek.map(day => (
          <Typography 
            key={day} 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '0.75rem',
              mb: 1
            }}
          >
            {day}
          </Typography>
        ))}
        
        {/* Calendar days */}
        {allDays.map((dayInfo, index) => {
          const isCurrentMonth = dayInfo.month === 'current';
          const isSelectedDay = isSelected(dayInfo.date);
          const isTodayDate = isToday(dayInfo.date);
          const event = getEventForDate(dayInfo.date);
          
          return (
            <Box 
              key={`${dayInfo.month}-${dayInfo.day}`}
              onClick={() => onDateSelect && isCurrentMonth && onDateSelect(dayInfo.date)}
              sx={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: isTodayDate ? '#2563eb' : isSelectedDay ? '#90caf9' : 'transparent',
                color: isTodayDate 
                  ? '#FFFFFF'  // Explicit white for today
                  : isSelectedDay 
                    ? '#333333' // Darker text for selected day (not today)
                    : isCurrentMonth 
                      ? 'text.primary' // Default for other current month days
                      : '#CCCCCC',    // Lighter grey for other month days (was #ccc)
                cursor: isCurrentMonth ? 'pointer' : 'default',
                fontWeight: isTodayDate || isSelectedDay ? 500 : 400,
                position: 'relative',
                '&:hover': isCurrentMonth ? {
                  bgcolor: !isTodayDate && !isSelectedDay ? '#f0f7ff' : undefined
                } : undefined
              }}
            >
              {dayInfo.day}
              {event && (
                <Box 
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: '2px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    bgcolor: event.color
                  }}
                />
              )}
            </Box>          );
        })}
      </Box>
    </Box>
  );
};

export default Calendar;
