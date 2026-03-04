import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CreateReservationPage from './pages/CreateReservationPage';
import ViewReservationsPage from './pages/ViewReservationsPage';
import GuestDirectoryPage from './pages/GuestDirectoryPage';
import GuestProfilePage from './pages/GuestProfilePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-900">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reservation" element={<CreateReservationPage />} />
          <Route path="/reservations" element={<ViewReservationsPage />} />
          <Route path="/guests" element={<GuestDirectoryPage />} />
          <Route path="/guests/:id" element={<GuestProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
