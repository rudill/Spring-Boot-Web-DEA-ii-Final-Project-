import { Link, useLocation } from 'react-router-dom';
import { Home, BedDouble, PlusSquare, BarChart3, LogOut, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/rooms', icon: BedDouble, label: 'All Rooms' },
    { path: '/rooms/add', icon: PlusSquare, label: 'Add Room' },
    { path: '/room-statistics', icon: BarChart3, label: 'Statistics' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/rooms') return location.pathname === '/rooms';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/Hotel_Logo.png" alt="Hotel Logo" className="hotel-logo" />
      </div>

      {user && (
        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div className="user-details">
            <p className="user-name">{user.fullName}</p>
            <p className="user-role">{user.role}</p>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Room Management</h3>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <p className="footer-text">© 2026 ආලකමන්දා Hotel</p>
        <p className="footer-subtext">Room Management System</p>
      </div>
    </div>
  );
};

export default Sidebar;
