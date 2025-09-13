import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { tripApi, activityApi } from '../services/api';
import { ActivityCreateRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ActivityCard from '../components/ActivityCard';
import CreateActivityModal from '../components/CreateActivityModal';

const DayViewPage: React.FC = () => {
  const { tripId, date } = useParams<{ tripId: string; date: string }>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: trip,
    isLoading: tripLoading,
  } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.getTripById(tripId!),
    enabled: !!tripId,
  });

  // For this demo, we'll simulate day plan data
  const dayPlanId = 'demo-day-plan-id'; // In real app, this would come from the trip data

  const {
    data: activities = [],
    isLoading: activitiesLoading,
  } = useQuery({
    queryKey: ['activities', dayPlanId],
    queryFn: () => activityApi.getActivitiesByDayPlan(dayPlanId),
    enabled: !!dayPlanId,
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: ActivityCreateRequest) => 
      activityApi.createActivity(dayPlanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', dayPlanId] });
      setIsCreateModalOpen(false);
      toast.success('Activity created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create activity');
    },
  });

  if (tripLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!trip || !date) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Trip or date not found</div>
        <Link to="/trips" className="btn btn-primary">
          Back to Trips
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(date), 'EEEE, MMMM dd, yyyy');
  const dayNumber = Math.floor(
    (new Date(date).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to={`/trips/${trip.id}/calendar`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Calendar
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Day {dayNumber} - {formattedDate}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{trip.title}</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              Add Activity
            </button>
          </div>
        </div>

        <div className="p-6">
          {activitiesLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first activity for this day.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn btn-primary"
                >
                  Add Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Activities ({activities.length})
                </h2>
                <div className="text-sm text-gray-500">
                  Total cost: ${activities.reduce((sum, activity) => sum + (activity.cost || 0), 0).toFixed(2)}
                </div>
              </div>
              
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onUpdate={() => queryClient.invalidateQueries({ queryKey: ['activities', dayPlanId] })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createActivityMutation.mutate(data)}
        isLoading={createActivityMutation.isPending}
      />
    </div>
  );
};

export default DayViewPage;
