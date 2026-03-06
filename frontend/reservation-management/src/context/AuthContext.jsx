import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Hardcoded admin credentials (consistent with Kitchen Management)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('reservation_token');
        const storedUser = localStorage.getItem('reservation_user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem('reservation_token');
                localStorage.removeItem('reservation_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const userData = {
                username: ADMIN_USERNAME,
                fullName: 'Reservation Admin',
                role: 'ADMIN',
            };
            const fakeToken = 'reservation-admin-token-' + Date.now();

            localStorage.setItem('reservation_token', fakeToken);
            localStorage.setItem('reservation_user', JSON.stringify(userData));
            setToken(fakeToken);
            setUser(userData);
            navigate('/');
            return { success: true };
        }
        return { success: false, message: 'Invalid username or password' };
    };

    const logout = () => {
        localStorage.removeItem('reservation_token');
        localStorage.removeItem('reservation_user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
