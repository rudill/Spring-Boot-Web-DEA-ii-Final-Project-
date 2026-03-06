import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, PlusCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HotelLogo from "../assets/Hotel_Logo.png";
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/reservations', icon: Calendar, label: 'All Reservations' },
        { path: '/reservation', icon: PlusCircle, label: 'Book Room' },
        { path: '/guests', icon: Users, label: 'Guest Directory' },
    ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={HotelLogo} alt="Hotel Logo" className="hotel-logo" />
            </div>

            <div className="user-info">
                <div className="user-avatar">
                    <User size={24} />
                </div>
                <div className="user-details">
                    <p className="user-name">{user?.username || 'Reservation Manager'}</p>
                    <p className="user-role">Administrator</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h3 className="nav-section-title">Reservation Management</h3>
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
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
                <p className="footer-text">© 2026 ආලකමන්දා Hotel</p>
                <p className="footer-subtext">Reservation System</p>
            </div>
        </div>
    );
};

export default Sidebar;
