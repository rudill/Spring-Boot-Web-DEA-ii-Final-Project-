import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TableList from './pages/TableList';
import TableDetails from './pages/TableDetails';
import AddTable from './pages/AddTable';
import EditTable from './pages/EditTable';
import OrderList from './pages/OrderList';
import OrderDetails from './pages/OrderDetails';
import CreateOrder from './pages/CreateOrder';
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
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tables" element={
              <ProtectedRoute>
                <Layout><TableList /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tables/add" element={
              <ProtectedRoute>
                <Layout><AddTable /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tables/edit/:id" element={
              <ProtectedRoute>
                <Layout><EditTable /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tables/:id" element={
              <ProtectedRoute>
                <Layout><TableDetails /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout><OrderList /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/create" element={
              <ProtectedRoute>
                <Layout><CreateOrder /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <Layout><OrderDetails /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
