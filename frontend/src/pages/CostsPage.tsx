import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { tripApi, analyticsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CostsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

  const {
    data: trip,
    isLoading: tripLoading,
  } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.getTripById(tripId!),
    enabled: !!tripId,
  });

  const {
    data: costBreakdown,
    isLoading: costsLoading,
  } = useQuery({
    queryKey: ['cost-breakdown', tripId],
    queryFn: () => analyticsApi.getTripCostBreakdown(tripId!),
    enabled: !!tripId,
  });

  if (tripLoading || costsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!trip || !costBreakdown) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load cost data</div>
        <Link to="/trips" className="btn btn-primary">
          Back to Trips
        </Link>
      </div>
    );
  }

  // Prepare chart data
  const categoryLabels = Object.keys(costBreakdown.costByCategory);
  const categoryValues = Object.values(costBreakdown.costByCategory);
  
  const categoryColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'
  ];

  const doughnutData = {
    labels: categoryLabels.map(label => label.replace('_', ' ')),
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryColors.slice(0, categoryLabels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const dayLabels = Object.keys(costBreakdown.costByDay).sort();
  const dayValues = dayLabels.map(day => costBreakdown.costByDay[day]);

  const barData = {
    labels: dayLabels.map(day => new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Costs',
        data: dayValues,
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  const budgetUsed = trip.budget ? (costBreakdown.totalCost / trip.budget) * 100 : 0;

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
          <h1 className="text-2xl font-semibold text-gray-900">
            {trip.title} - Cost Analysis
          </h1>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-600">Total Spent</div>
              <div className="text-2xl font-bold text-blue-900">
                ${costBreakdown.totalCost.toFixed(2)}
              </div>
            </div>
            
            {trip.budget && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-green-600">Budget</div>
                <div className="text-2xl font-bold text-green-900">
                  ${trip.budget.toFixed(2)}
                </div>
              </div>
            )}
            
            {trip.budget && (
              <div className={`rounded-lg p-4 ${budgetUsed > 100 ? 'bg-red-50' : budgetUsed > 80 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <div className={`text-sm font-medium ${budgetUsed > 100 ? 'text-red-600' : budgetUsed > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                  Budget Used
                </div>
                <div className={`text-2xl font-bold ${budgetUsed > 100 ? 'text-red-900' : budgetUsed > 80 ? 'text-yellow-900' : 'text-green-900'}`}>
                  {budgetUsed.toFixed(1)}%
                </div>
              </div>
            )}
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-600">Activities with Costs</div>
              <div className="text-2xl font-bold text-purple-900">
                {costBreakdown.activitiesWithCost} / {costBreakdown.totalActivities}
              </div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          {trip.budget && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Budget Progress</span>
                <span>${(trip.budget - costBreakdown.totalCost).toFixed(2)} remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${budgetUsed > 100 ? 'bg-red-500' : budgetUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Charts */}
          {categoryLabels.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Costs by Category</h3>
                </div>
                <div className="card-body">
                  <div className="h-64">
                    <Doughnut data={doughnutData} options={chartOptions} />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Daily Spending</h3>
                </div>
                <div className="card-body">
                  <div className="h-64">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cost data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add costs to your activities to see spending analysis.
              </p>
            </div>
          )}

          {/* Detailed Breakdown */}
          {categoryLabels.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Breakdown</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryLabels.map((category, index) => (
                    <div key={category} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: categoryColors[index] }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ${costBreakdown.costByCategory[category].toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostsPage;
