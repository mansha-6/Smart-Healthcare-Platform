import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [apiStatus, setApiStatus] = useState('unknown');
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(`${BASE}/health`, { method: 'GET' });
        if (!cancelled) setApiStatus(res.ok ? 'online' : 'offline');
      } catch (err) {
        if (!cancelled) setApiStatus('offline');
      }
    };
    check();
    const id = setInterval(check, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, [BASE]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (['/dashboard', '/doctor-dashboard', '/admin-dashboard'].some(path => location.pathname.startsWith(path))) {
    return null; 
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-14 w-12 object-contain" />
              <span className="text-2xl">MediSync</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* System Status Indicator Removed */}
            
            {/* Logic: Hide all if on Login/Register OR Home (/). Just show logo on these pages. */
             ['/login', '/register', '/'].includes(location.pathname) ? null :
             token ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <NotificationPanel />
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
                    <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md">Get Started</Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
