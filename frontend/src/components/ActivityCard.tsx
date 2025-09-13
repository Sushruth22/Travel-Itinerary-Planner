import React from 'react';
import { format } from 'date-fns';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onUpdate: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onUpdate }) => {
  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
      TRANSPORTATION: '🚗',
      ACCOMMODATION: '🏨',
      DINING: '🍽️',
      SIGHTSEEING: '🏛️',
      ENTERTAINMENT: '🎭',
      SHOPPING: '🛍️',
      OUTDOOR: '🌲',
      CULTURAL: '🎨',
      RELAXATION: '🧘',
      BUSINESS: '💼',
      OTHER: '📌',
    };
    return icons[category || 'OTHER'] || '📌';
  };

  return (
    <div className={`card ${activity.isCompleted ? 'opacity-75' : ''}`}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getCategoryIcon(activity.category)}</span>
              <h3 className={`font-medium ${activity.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {activity.title}
              </h3>
              {activity.isCompleted && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              )}
            </div>
            
            {activity.description && (
              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {activity.startTime && (
                <span>🕒 {formatTime(activity.startTime)}</span>
              )}
              {activity.location && (
                <span>📍 {activity.location}</span>
              )}
              {activity.cost && (
                <span>💰 ${activity.cost.toFixed(2)}</span>
              )}
            </div>
            
            {activity.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">{activity.notes}</p>
            )}
            
            {activity.tags && activity.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {activity.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    style={tag.color ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => {
                // Toggle completion logic would go here
                onUpdate();
              }}
              className={`btn text-sm ${
                activity.isCompleted ? 'btn-secondary' : 'btn-primary'
              }`}
            >
              {activity.isCompleted ? 'Mark Incomplete' : 'Complete'}
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {activity.bookingUrl && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={activity.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              🔗 View Booking Details
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
