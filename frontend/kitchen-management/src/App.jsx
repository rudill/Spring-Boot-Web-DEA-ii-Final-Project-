import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuItemList from './pages/MenuItemList';
import MenuItemDetails from './pages/MenuItemDetails';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';
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
            <Route path="/menu" element={
              <ProtectedRoute>
                <Layout><MenuItemList /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/menu/:id" element={
              <ProtectedRoute>
                <Layout><MenuItemDetails /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/menu/add" element={
              <ProtectedRoute>
                <Layout><AddMenuItem /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/menu/edit/:id" element={
              <ProtectedRoute>
                <Layout><EditMenuItem /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout><OrderList /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <Layout><OrderDetails /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders/create" element={
              <ProtectedRoute>
                <Layout><CreateOrder /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
