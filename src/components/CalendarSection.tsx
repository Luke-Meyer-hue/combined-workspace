import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: string[] }>({
    '2025-01-15': ['Team Meeting at 10:00 AM'],
    '2025-01-22': ['Project Deadline'],
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth();

    const days = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasEvents = events[dateKey] && events[dateKey].length > 0;
      const isToday = isCurrentMonth && today.getDate() === day;

      days.push(
        <div
          key={day}
          className={`
            h-20 p-2 rounded-xl border transition-all duration-200 cursor-pointer
            ${isToday ? 'bg-purple-800/40 border-purple-400' : 'bg-gray-900/50 border-gray-700/60'}
            ${hasEvents ? 'ring-2 ring-blue-400/50' : ''}
            hover:bg-gray-700/40 hover:border-purple-500
          `}
        >
          <div
            className={`
              text-sm font-bold
              ${isToday ? 'text-purple-300' : 'text-gray-300'}
            `}
          >
            {day}
          </div>
          {hasEvents && (
            <div className="mt-1 space-y-1">
              {events[dateKey].slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md truncate"
                >
                  {event}
                </div>
              ))}
              {events[dateKey].length > 2 && (
                <div className="text-xs text-gray-400">+{events[dateKey].length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 border-b border-purple-600 pb-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 bg-gray-800/70 border border-purple-600 rounded-lg hover:bg-purple-700/40"
          >
            <ChevronLeft size={20} />
          </button>

          <h3 className="text-2xl font-bold text-purple-300 tracking-wide">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 bg-gray-800/70 border border-purple-600 rounded-lg hover:bg-purple-700/40"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-700/70 border border-purple-500 rounded-lg hover:bg-purple-600 transition-all">
          <Plus size={16} />
          <span className="font-semibold">Add Event</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 min-h-0">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {daysOfWeek.map(day => (
            <div
              key={day}
              className="text-sm font-semibold text-purple-400 border-b border-purple-600 pb-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-purple-600 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-purple-400">
            {Object.keys(events).length}
          </div>
          <div className="text-xs text-gray-400">Total Events</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {Object.values(events).flat().length}
          </div>
          <div className="text-xs text-gray-400">This Month</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">
            {new Date().getDate()}
          </div>
          <div className="text-xs text-gray-400">Today</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
