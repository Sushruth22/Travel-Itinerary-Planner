import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { tripApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CalendarPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    data: trip,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.getTripById(tripId!),
    enabled: !!tripId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load trip</div>
        <Link to="/trips" className="btn btn-primary">
          Back to Trips
        </Link>
      </div>
    );
  }

  const tripStart = new Date(trip.startDate);
  const tripEnd = new Date(trip.endDate);
  
  // Generate calendar days
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const isDateInTrip = (date: Date) => {
    return date >= tripStart && date <= tripEnd;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to={`/trips/${trip.id}`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Trip
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {trip.title} - Calendar
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-medium text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(tripStart)}
                className="btn btn-primary text-sm"
              >
                Go to Trip Start
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 py-2 px-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, dayIdx) => {
              const isInTrip = isDateInTrip(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              
              return (
                <div
                  key={day.toString()}
                  className={`
                    bg-white p-2 h-32 relative
                    ${isCurrentMonth ? '' : 'text-gray-400'}
                    ${isTodayDate ? 'bg-blue-50' : ''}
                    ${isInTrip ? 'ring-2 ring-primary-500' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`
                      text-sm
                      ${isTodayDate ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {isInTrip && (
                      <Link
                        to={`/trips/${trip.id}/days/${format(day, 'yyyy-MM-dd')}`}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        View
                      </Link>
                    )}
                  </div>
                  
                  {isInTrip && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600">
                        Day {Math.floor((day.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1}
                      </div>
                      {/* Placeholder for activities */}
                      <div className="mt-1 space-y-1">
                        <div className="text-xs bg-primary-100 text-primary-800 px-1 py-0.5 rounded truncate">
                          Activities...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-primary-500 rounded mr-2"></div>
                Trip Days
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-50 rounded mr-2"></div>
                Today
              </div>
            </div>
            <div>
              Trip: {format(tripStart, 'MMM dd')} - {format(tripEnd, 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
