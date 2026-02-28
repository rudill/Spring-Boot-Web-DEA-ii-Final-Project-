import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Table2, ClipboardList, BarChart3, PlusCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/menu-items', icon: UtensilsCrossed, label: 'Menu Items' },
    { path: '/menu-items/add', icon: PlusCircle, label: 'Add Menu Item' },
    { path: '/tables', icon: Table2, label: 'Tables' },
    { path: '/orders', icon: ClipboardList, label: 'Orders' },
    { path: '/statistics', icon: BarChart3, label: 'Statistics' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/Hotel_Logo.png" alt="Hotel Logo" className="hotel-logo" />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Restaurant Management</h3>
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
        <p className="footer-text">© 2026 ආලකමන්දා Hotel</p>
        <p className="footer-subtext">Restaurant Management System</p>
      </div>
    </div>
  );
};

export default Sidebar;
