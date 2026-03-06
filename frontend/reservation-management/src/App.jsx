import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CreateReservationPage from './pages/CreateReservationPage';
import ViewReservationsPage from './pages/ViewReservationsPage';
import GuestDirectoryPage from './pages/GuestDirectoryPage';
import GuestProfilePage from './pages/GuestProfilePage';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background text-slate-900">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/reservation" element={
              <ProtectedRoute>
                <CreateReservationPage />
              </ProtectedRoute>
            } />
            <Route path="/reservations" element={
              <ProtectedRoute>
                <ViewReservationsPage />
              </ProtectedRoute>
            } />
            <Route path="/guests" element={
              <ProtectedRoute>
                <GuestDirectoryPage />
              </ProtectedRoute>
            } />
            <Route path="/guests/:id" element={
              <ProtectedRoute>
                <GuestProfilePage />
              </ProtectedRoute>
            } />

            {/* Catch all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
