import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ClipboardList, Clock, ChefHat, CheckCircle, Flame, ShoppingCart } from 'lucide-react';
import { menuService, orderService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [menuCount, setMenuCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, menuRes] = await Promise.all([
        orderService.getDashboardCounts(),
        menuService.getAllMenuItems(),
      ]);
      setDashboardData(dashboardRes.data.data);
      setMenuCount(menuRes.data.data?.length || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const statCards = [
    {
      title: 'Total Menu Items',
      value: menuCount,
      icon: UtensilsCrossed,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Pending Orders',
      value: dashboardData?.PENDING || 0,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Cooking',
      value: dashboardData?.COOKING || 0,
      icon: Flame,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
    {
      title: 'Ready to Serve',
      value: dashboardData?.READY || 0,
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
  ];

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to ආලකමන්දා Hotel Kitchen Management System</p>
        </div>
        <Link to="/orders/create" className="btn btn-primary">
          <ShoppingCart size={20} />
          New Order
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 mt-4">
        <div className="card">
          <h3 className="card-title">
            <ChefHat size={20} />
            Order Summary
          </h3>
          <div className="financial-stats">
            <div className="financial-item">
              <span className="financial-label">Served Today</span>
              <span className="financial-value">
                {dashboardData?.SERVED || 0}
              </span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Total Active Orders</span>
              <span className="financial-value">
                {(dashboardData?.PENDING || 0) + (dashboardData?.COOKING || 0) + (dashboardData?.READY || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">
            <ClipboardList size={20} />
            Quick Actions
          </h3>
          <div className="quick-actions">
            <Link to="/menu" className="action-link">
              View All Menu Items
            </Link>
            <Link to="/menu/add" className="action-link">
              Add New Menu Item
            </Link>
            <Link to="/orders" className="action-link">
              View All Orders
            </Link>
            <Link to="/orders/create" className="action-link">
              Create New Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
