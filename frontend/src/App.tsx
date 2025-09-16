import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import CalendarPage from './pages/CalendarPage';
import DayViewPage from './pages/DayViewPage';
import CostsPage from './pages/CostsPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, isLoading } = useAuth();

  // Temporarily bypass authentication for testing
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/trips" replace />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/trips/:tripId/calendar" element={<CalendarPage />} />
        <Route path="/trips/:tripId/days/:date" element={<DayViewPage />} />
        <Route path="/trips/:tripId/costs" element={<CostsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/trips" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
