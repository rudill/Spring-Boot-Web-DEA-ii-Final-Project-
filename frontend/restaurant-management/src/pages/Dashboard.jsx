import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Table2, ClipboardList, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { orderService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await orderService.getStatistics();
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  const statCards = [
    { title: 'Total Menu Items', value: stats?.totalMenuItems || 0, icon: UtensilsCrossed, color: '#b45309', bgColor: '#fef3c7' },
    { title: 'Available Items',  value: stats?.availableMenuItems || 0, icon: CheckCircle, color: '#10b981', bgColor: '#d1fae5' },
    { title: 'Total Tables',     value: stats?.totalTables || 0,  icon: Table2,          color: '#3b82f6', bgColor: '#dbeafe' },
    { title: 'Available Tables', value: stats?.availableTables || 0, icon: Table2,       color: '#8b5cf6', bgColor: '#ede9fe' },
    { title: 'Total Orders',     value: stats?.totalOrders || 0,  icon: ClipboardList,   color: '#06b6d4', bgColor: '#cffafe' },
    { title: 'Pending Orders',   value: stats?.pendingOrders || 0, icon: ClipboardList,  color: '#f59e0b', bgColor: '#fef3c7' },
    { title: 'Active Orders',    value: stats?.activeOrders || 0,  icon: TrendingUp,     color: '#ef4444', bgColor: '#fee2e2' },
    { title: 'Total Revenue',    value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#10b981', bgColor: '#d1fae5' },
  ];

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to ආලකමන්දා Hotel Restaurant Management System</p>
        </div>
        <Link to="/orders" className="btn btn-primary">
          <ClipboardList size={20} />
          View Orders
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
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

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/menu-items/add" className="action-link">➕ Add Menu Item</Link>
            <Link to="/tables/add"     className="action-link">➕ Add Table</Link>
            <Link to="/menu-items"     className="action-link">🍽 View All Menu Items</Link>
            <Link to="/tables"         className="action-link">🪑 View All Tables</Link>
            <Link to="/orders"         className="action-link">📋 View All Orders</Link>
            <Link to="/statistics"     className="action-link">📊 Statistics</Link>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Table Status</h3>
          <div className="table-status-summary">
            <div className="status-row">
              <span className="badge badge-success">Available</span>
              <span className="status-count">{stats?.availableTables || 0} tables</span>
            </div>
            <div className="status-row">
              <span className="badge badge-danger">Occupied</span>
              <span className="status-count">{stats?.occupiedTables || 0} tables</span>
            </div>
            <div className="status-row">
              <span className="badge badge-info">Total</span>
              <span className="status-count">{stats?.totalTables || 0} tables</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
