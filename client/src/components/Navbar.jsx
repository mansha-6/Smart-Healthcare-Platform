import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

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
            <Link to="/" className="text-2xl font-bold text-primary"></Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* System Status Indicator Removed */}
            
            {token ? (
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
             // Links removed as per user request to rely on in-page auth navigation
             null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
