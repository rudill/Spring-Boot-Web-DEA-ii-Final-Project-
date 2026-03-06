import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/rooms/Dashboard';
import RoomList from './pages/rooms/RoomList';
import RoomDetails from './pages/rooms/RoomDetails';
import AddRoom from './pages/rooms/AddRoom';
import EditRoom from './pages/rooms/EditRoom';
import Statistics from './pages/rooms/Statistics';
import StatusHistory from './pages/rooms/StatusHistory';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/rooms" element={
              <ProtectedRoute>
                <Layout>
                  <RoomList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/rooms/add" element={
              <ProtectedRoute>
                <Layout>
                  <AddRoom />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/rooms/edit/:roomNumber" element={
              <ProtectedRoute>
                <Layout>
                  <EditRoom />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/rooms/:roomNumber/history" element={
              <ProtectedRoute>
                <Layout>
                  <StatusHistory />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/rooms/:roomNumber" element={
              <ProtectedRoute>
                <Layout>
                  <RoomDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/room-statistics" element={
              <ProtectedRoute>
                <Layout>
                  <Statistics />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
