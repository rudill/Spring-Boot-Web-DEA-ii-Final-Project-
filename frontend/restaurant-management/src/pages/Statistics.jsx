import { useEffect, useState } from 'react';
import { UtensilsCrossed, Table2, ClipboardList, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { orderService, menuItemService, tableService } from '../services/api';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [menuByCategory, setMenuByCategory] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'];

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, menuRes, tablesRes] = await Promise.all([
        orderService.getStatistics(),
        menuItemService.getAll(),
        tableService.getAll(),
      ]);

      setStats(statsRes.data.data);

      // Group menu items by category
      const items = menuRes.data.data || [];
      const catMap = {};
      items.forEach(item => {
        catMap[item.category] = (catMap[item.category] || 0) + 1;
      });
      setMenuByCategory(Object.entries(catMap).map(([cat, count]) => ({ cat, count })));

      // Group orders by status
      const ordersRes = await orderService.getAll();
      const allOrders = ordersRes.data.data || [];
      const statusMap = {};
      ORDER_STATUSES.forEach(s => { statusMap[s] = 0; });
      allOrders.forEach(o => { if (statusMap[o.status] !== undefined) statusMap[o.status]++; });
      setOrdersByStatus(Object.entries(statusMap).map(([status, count]) => ({ status, count })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  const summaryCards = [
    { label: 'Total Menu Items',    value: stats?.totalMenuItems || 0,     icon: UtensilsCrossed, color: '#b45309', bg: '#fef3c7' },
    { label: 'Available Items',     value: stats?.availableMenuItems || 0,  icon: UtensilsCrossed, color: '#10b981', bg: '#d1fae5' },
    { label: 'Total Tables',        value: stats?.totalTables || 0,         icon: Table2,          color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Available Tables',    value: stats?.availableTables || 0,     icon: Table2,          color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Occupied Tables',     value: stats?.occupiedTables || 0,      icon: AlertCircle,     color: '#ef4444', bg: '#fee2e2' },
    { label: 'Total Orders',        value: stats?.totalOrders || 0,         icon: ClipboardList,   color: '#06b6d4', bg: '#cffafe' },
    { label: 'Pending Orders',      value: stats?.pendingOrders || 0,       icon: TrendingUp,      color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Total Revenue (Rs.)', value: (stats?.totalRevenue || 0).toLocaleString(), icon: DollarSign, color: '#10b981', bg: '#d1fae5' },
  ];

  const statusColors = {
    PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PREPARING: '#8b5cf6',
    READY: '#10b981', SERVED: '#94a3b8', CANCELLED: '#ef4444',
  };

  const maxOrderCount = Math.max(...ordersByStatus.map(o => o.count), 1);
  const maxCatCount = Math.max(...menuByCategory.map(m => m.count), 1);

  return (
    <div className="statistics fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statistics</h1>
          <p className="page-subtitle">Restaurant performance overview</p>
        </div>
      </div>

      <div className="stats-grid">
        {summaryCards.map((c, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div className="stat-icon" style={{ background: c.bg, color: c.color }}>
              <c.icon size={22} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{c.label}</p>
              <h3 className="stat-value">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Orders by Status */}
        <div className="card">
          <h3 className="chart-title">Orders by Status</h3>
          <div className="bar-chart">
            {ordersByStatus.map(({ status, count }) => (
              <div key={status} className="bar-row">
                <span className="bar-label">{status}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(count / maxOrderCount) * 100}%`, background: statusColors[status] || '#94a3b8' }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu by Category */}
        <div className="card">
          <h3 className="chart-title">Menu Items by Category</h3>
          <div className="bar-chart">
            {menuByCategory.sort((a, b) => b.count - a.count).map(({ cat, count }) => (
              <div key={cat} className="bar-row">
                <span className="bar-label">{cat.replace('_', ' ')}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(count / maxCatCount) * 100}%`, background: 'var(--primary-color)' }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
