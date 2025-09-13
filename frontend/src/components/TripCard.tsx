import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onUpdate: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onUpdate }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {trip.coverImageUrl && (
        <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={trip.coverImageUrl}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <Link
                to={`/trips/${trip.id}`}
                className="hover:text-primary-600 transition-colors"
              >
                {trip.title}
              </Link>
            </h3>
            {trip.destination && (
              <p className="text-sm text-gray-600 mb-2">📍 {trip.destination}</p>
            )}
            <p className="text-sm text-gray-500 mb-3">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({getDuration()} days)
            </p>
            {trip.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {trip.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{trip.memberCount} member{trip.memberCount !== 1 ? 's' : ''}</span>
            {trip.budget && (
              <span>${trip.budget.toLocaleString()}</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/trips/${trip.id}/calendar`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Calendar
            </Link>
            <Link
              to={`/trips/${trip.id}/costs`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Costs
            </Link>
          </div>
        </div>
        
        {trip.tags && trip.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {trip.tags.map((tag) => (
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
    </div>
  );
};

export default TripCard;
