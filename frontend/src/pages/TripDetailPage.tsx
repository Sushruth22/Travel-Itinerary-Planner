import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { tripApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/trips"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Trips
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {trip.coverImageUrl && (
          <div className="h-64 bg-gray-200">
            <img
              src={trip.coverImageUrl}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
              {trip.destination && (
                <p className="text-lg text-gray-600 mb-2">📍 {trip.destination}</p>
              )}
              <p className="text-gray-500">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({getDuration()} days)
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/trips/${trip.id}/calendar`}
                className="btn btn-primary"
              >
                Calendar View
              </Link>
              <Link
                to={`/trips/${trip.id}/costs`}
                className="btn btn-secondary"
              >
                Cost Analysis
              </Link>
            </div>
          </div>

          {trip.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{trip.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-body">
                <h4 className="font-medium text-gray-900 mb-2">Trip Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{getDuration()} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Members:</span>
                    <span>{trip.memberCount}</span>
                  </div>
                  {trip.budget && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span>${trip.budget.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visibility:</span>
                    <span>{trip.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Link
                    to={`/trips/${trip.id}/calendar`}
                    className="block w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded"
                  >
                    📅 View Calendar
                  </Link>
                  <Link
                    to={`/trips/${trip.id}/costs`}
                    className="block w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded"
                  >
                    💰 Cost Breakdown
                  </Link>
                  <button className="block w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded">
                    👥 Manage Members
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded">
                    ⚙️ Trip Settings
                  </button>
                </div>
              </div>
            </div>

            {trip.tags && trip.tags.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
