import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';

const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});
  const [showModal, setShowModal] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventText, setNewEventText] = useState('');

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  // Load & clean events
  useEffect(() => {
    const stored = localStorage.getItem('calendarEvents');
    if (stored) {
      let parsed: { [key: string]: string[] } = JSON.parse(stored);

      // remove past events
      const today = new Date();
      parsed = Object.fromEntries(
        Object.entries(parsed).filter(([date]) => new Date(date) >= today)
      );

      setEvents(parsed);
      localStorage.setItem('calendarEvents', JSON.stringify(parsed));
    }
  }, []);

  // Save when events change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!newEventDate || !newEventText.trim()) return;

    setEvents(prev => {
      const updated = { ...prev };
      if (!updated[newEventDate]) updated[newEventDate] = [];
      updated[newEventDate].push(newEventText.trim());
      return updated;
    });

    setNewEventText('');
    setNewEventDate('');
    setShowModal(false);
  };

  const deleteEvent = (dateKey: string, index: number) => {
    setEvents(prev => {
      const updated = { ...prev };
      updated[dateKey].splice(index, 1);
      if (updated[dateKey].length === 0) delete updated[dateKey];
      return updated;
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

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasEvents = events[dateKey] && events[dateKey].length > 0;
      const isToday = isCurrentMonth && today.getDate() === day;

      days.push(
        <div
          key={day}
          className={`
            h-20 p-2 rounded-xl border transition-all cursor-pointer
            ${isToday ? 'bg-purple-800/40 border-purple-400' : 'bg-gray-900/50 border-gray-700/60'}
            ${hasEvents ? 'ring-2 ring-blue-400/50' : ''}
            hover:bg-gray-700/40 hover:border-purple-500
          `}
          onClick={() => {
            setNewEventDate(dateKey);
            setShowModal(true);
          }}
        >
          <div className={`text-sm font-bold ${isToday ? 'text-purple-300' : 'text-gray-300'}`}>
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
      {/* Header */}
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

        <div className="space-x-2 flex">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-700/70 border border-purple-500 rounded-lg hover:bg-purple-600"
          >
            <Plus size={16} />
            <span className="font-semibold">Add Event</span>
          </button>
          <button
            onClick={() => setShowManage(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-red-500 rounded-lg hover:bg-red-600"
          >
            <Trash2 size={16} />
            <span className="font-semibold">Manage</span>
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {daysOfWeek.map(day => (
          <div key={day} className="text-sm font-semibold text-purple-400 border-b border-purple-600 pb-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2 flex-1 min-h-0">{renderCalendarDays()}</div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-purple-600 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-purple-400">{Object.keys(events).length}</div>
          <div className="text-xs text-gray-400">Days with Events</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">{Object.values(events).flat().length}</div>
          <div className="text-xs text-gray-400">Total Events</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{new Date().getDate()}</div>
          <div className="text-xs text-gray-400">Today</div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-600 rounded-xl p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-purple-300 mb-4">Add Event</h3>

            <label className="block text-sm text-gray-400 mb-2">Date</label>
            <input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded-lg bg-gray-800 border border-purple-600 text-white"
            />

            <label className="block text-sm text-gray-400 mb-2">Event</label>
            <input
              type="text"
              placeholder="Enter event..."
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded-lg bg-gray-800 border border-purple-600 text-white"
            />

            <button
              onClick={addEvent}
              className="w-full py-2 bg-purple-700 border border-purple-500 rounded-lg hover:bg-purple-600 font-semibold"
            >
              Save Event
            </button>
          </div>
        </div>
      )}

      {/* Manage Events Modal */}
      {showManage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-600 rounded-xl p-6 w-[32rem] max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowManage(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-red-400 mb-4">Manage Events</h3>

            {Object.entries(events).length === 0 && (
              <p className="text-gray-400">No events to manage.</p>
            )}

            <div className="space-y-4">
              {Object.entries(events).map(([date, evs]) => (
                <div key={date} className="border-b border-gray-700 pb-2">
                  <p className="text-purple-300 font-semibold mb-2">{date}</p>
                  <ul className="space-y-2">
                    {evs.map((ev, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-gray-800 px-3 py-1 rounded">
                        <span>{ev}</span>
                        <button
                          onClick={() => deleteEvent(date, idx)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;
