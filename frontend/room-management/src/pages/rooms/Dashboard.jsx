import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, CheckCircle, XCircle, Wrench, LayoutGrid, TrendingUp } from 'lucide-react';
import { roomService } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [maintenanceRooms, setMaintenanceRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [countsRes, availRes, occRes, maintRes] = await Promise.all([
        roomService.getRoomCounts(),
        roomService.getAvailableRooms(),
        roomService.getOccupiedRooms(),
        roomService.getMaintenanceRooms(),
      ]);

      // GET /rooms/count → { singleRooms, doubleRooms, deluxeRooms, totalRooms }
      const c = countsRes.data?.data ?? countsRes.data;
      setCounts(c);

      const toArr = (res) => {
        const d = res.data?.data ?? res.data;
        return Array.isArray(d) ? d : [];
      };
      setAvailableRooms(toArr(availRes));
      setOccupiedRooms(toArr(occRes));
      setMaintenanceRooms(toArr(maintRes));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toNum = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'object') return val.count ?? val.total ?? 0;
    return Number(val) || 0;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const totalRooms      = toNum(counts?.totalRooms);
  const singleRooms     = toNum(counts?.singleRooms);
  const doubleRooms     = toNum(counts?.doubleRooms);
  const deluxeRooms     = toNum(counts?.deluxeRooms);

  const statCards = [
    {
      title: 'Total Rooms',
      value: totalRooms,
      icon: BedDouble,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Available Rooms',
      value: availableRooms.length,
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Occupied Rooms',
      value: occupiedRooms.length,
      icon: XCircle,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
    {
      title: 'Maintenance',
      value: maintenanceRooms.length,
      icon: Wrench,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
  ];

  const typeCards = [
    { label: 'Single Rooms',  value: singleRooms, color: '#6366f1' },
    { label: 'Deluxe Rooms',  value: deluxeRooms, color: '#8b5cf6' },
    { label: 'Double Rooms',  value: doubleRooms, color: '#ec4899' },
  ];

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome to ආලකමන්දා Hotel Room Management System</p>
        </div>
        <Link to="/rooms/add" className="btn btn-primary">
          <BedDouble size={20} />
          Add New Room
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
            <LayoutGrid size={20} />
            Room Type Breakdown
          </h3>
          <div className="financial-stats">
            {typeCards.map(({ label, value, color }) => (
              <div key={label} className="financial-item">
                <span className="financial-label">{label}</span>
                <span className="financial-value" style={{ color }}>
                  {value} rooms
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">
            <TrendingUp size={20} />
            Quick Actions
          </h3>
          <div className="quick-actions">
            <Link to="/rooms" className="action-link">View All Rooms</Link>
            <Link to="/rooms/add" className="action-link">Add New Room</Link>
            <Link to="/room-statistics" className="action-link">View Room Statistics</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
