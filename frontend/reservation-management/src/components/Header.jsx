import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HotelLogo from "../assets/Hotel_Logo.png";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/reservations', label: 'Reservations' },
        { path: '/guests', label: 'Guests' },
    ];

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-white px-10 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/')}>
                <img src={HotelLogo} alt="Hotel Logo" className="h-10 w-auto object-contain" />
                <h2 className="text-slate-900 text-lg font-bold">Reservation Management</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                <nav className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`${location.pathname === item.path
                                    ? 'text-primary text-sm font-bold border-b-2 border-primary pb-1'
                                    : 'text-slate-600 hover:text-primary text-sm font-medium transition-colors'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}

                    {user && (
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-900">{user.fullName}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">logout</span>
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
