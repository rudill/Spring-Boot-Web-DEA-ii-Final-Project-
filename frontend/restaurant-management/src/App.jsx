import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MenuItemList from './pages/MenuItemList';
import MenuItemForm from './pages/MenuItemForm';
import TableList from './pages/TableList';
import TableForm from './pages/TableForm';
import OrderList from './pages/OrderList';
import OrderDetails from './pages/OrderDetails';
import Statistics from './pages/Statistics';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/menu-items" element={<MenuItemList />} />
            <Route path="/menu-items/add" element={<MenuItemForm />} />
            <Route path="/menu-items/edit/:id" element={<MenuItemForm />} />
            <Route path="/tables" element={<TableList />} />
            <Route path="/tables/add" element={<TableForm />} />
            <Route path="/tables/edit/:id" element={<TableForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
