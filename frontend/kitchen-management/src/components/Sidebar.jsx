import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ClipboardList, PlusCircle, ShoppingCart } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/menu', icon: UtensilsCrossed, label: 'Menu Items' },
    { path: '/menu/add', icon: PlusCircle, label: 'Add Menu Item' },
    { path: '/orders', icon: ClipboardList, label: 'All Orders' },
    { path: '/orders/create', icon: ShoppingCart, label: 'Create Order' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/Hotel_Logo.png" alt="Hotel Logo" className="hotel-logo" />
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Kitchen Management</h3>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <p className="footer-text">© 2026 ආලකමන්දා Hotel</p>
        <p className="footer-subtext">Kitchen Management System</p>
      </div>
    </div>
  );
};

export default Sidebar;
