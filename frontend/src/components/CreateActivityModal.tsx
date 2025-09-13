import React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityCreateRequest, ActivityCategory } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActivityCreateRequest) => void;
  isLoading: boolean;
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ActivityCreateRequest>();

  const handleFormSubmit = (data: ActivityCreateRequest) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const categories: { value: ActivityCategory; label: string }[] = [
    { value: 'TRANSPORTATION', label: '🚗 Transportation' },
    { value: 'ACCOMMODATION', label: '🏨 Accommodation' },
    { value: 'DINING', label: '🍽️ Dining' },
    { value: 'SIGHTSEEING', label: '🏛️ Sightseeing' },
    { value: 'ENTERTAINMENT', label: '🎭 Entertainment' },
    { value: 'SHOPPING', label: '🛍️ Shopping' },
    { value: 'OUTDOOR', label: '🌲 Outdoor' },
    { value: 'CULTURAL', label: '🎨 Cultural' },
    { value: 'RELAXATION', label: '🧘 Relaxation' },
    { value: 'BUSINESS', label: '💼 Business' },
    { value: 'OTHER', label: '📌 Other' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Activity</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Activity Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="input mt-1"
                placeholder="Enter activity title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input mt-1"
                placeholder="Describe the activity..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  {...register('startTime')}
                  type="time"
                  className="input mt-1"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  {...register('endTime')}
                  type="time"
                  className="input mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="input mt-1"
                  placeholder="Where is this activity?"
                />
              </div>
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                  Cost ($)
                </label>
                <input
                  {...register('cost', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Cost must be positive' }
                  })}
                  type="number"
                  step="0.01"
                  className="input mt-1"
                  placeholder="0.00"
                />
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register('category')}
                className="input mt-1"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700">
                Booking URL
              </label>
              <input
                {...register('bookingUrl')}
                type="url"
                className="input mt-1"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                className="input mt-1"
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex items-center"
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                Add Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityModal;
