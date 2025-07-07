"use client";

import { useState, useEffect, useRef } from 'react';

interface CustomCalendarProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function CustomCalendar({
  selected,
  onChange,
  placeholder = "Select date",
  className = "",
  disabled = false,
  minDate,
  maxDate,
  selectsStart = false,
  selectsEnd = false,
  startDate,
  endDate
}: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const inputRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  // Check if date is in range (for range selection)
  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  // Check if date is start or end of range
  const isRangeStart = (date: Date) => {
    return startDate && date.toDateString() === startDate.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    return endDate && date.toDateString() === endDate.toDateString();
  };

  // Check if date is disabled
  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    // Disable dates more than 1 year from today
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (date > oneYearFromNow) return true;
    
    return false;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;
    
    if (selectsStart) {
      onChange(date);
      setIsOpen(false);
    } else if (selectsEnd) {
      onChange(date);
      setIsOpen(false);
    } else {
      onChange(date);
      setIsOpen(false);
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if navigation buttons should be disabled
  const isPrevDisabled = minDate && new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) < minDate;
  const isNextDisabled = maxDate && new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > maxDate;

  const days = generateCalendarDays();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div ref={inputRef} className={`relative ${className}`}>
      {/* Input field */}
      <div
        className={`w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={selected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {selected ? formatDate(selected) : placeholder}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              disabled={isPrevDisabled}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={goToNextMonth}
              disabled={isNextDisabled}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-10" />;
              }

                             const isSelected = selected && day.toDateString() === selected.toDateString();
               const isToday = day.toDateString() === new Date().toDateString();
               const isDisabledDay = isDisabled(day);
               const isInRangeDay = isInRange(day);
               const isRangeStartDay = isRangeStart(day);
               const isRangeEndDay = isRangeEnd(day);
               
               // Check if date is more than 1 year from today
               const oneYearFromNow = new Date();
               oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
               const isMoreThanOneYear = day > oneYearFromNow;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabledDay}
                                     className={`
                     h-10 w-10 rounded-lg text-sm font-medium transition-colors
                     ${isSelected 
                       ? 'bg-blue-600 text-white' 
                       : isRangeStartDay || isRangeEndDay
                       ? 'bg-blue-500 text-white'
                       : isInRangeDay
                       ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                       : isToday
                       ? 'border-2 border-blue-500 text-blue-600 dark:text-blue-400'
                       : isMoreThanOneYear
                       ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                       : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                     }
                     ${isDisabledDay ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                   `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 