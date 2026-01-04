import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Activity, Calendar, FileText, Settings, Video, Search, LogOut, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Find Doctors', path: '/doctors', icon: Search },
        { name: 'Overview', path: '/dashboard/overview', icon: Activity },
        { name: 'Appointment', path: '/dashboard/appointments', icon: Calendar },
        { name: 'History', path: '/dashboard/history', icon: Clock },
        { name: 'Feedback', path: '/dashboard/feedback', icon: MessageSquare },
        { name: 'Teleconsultation', path: '/teleconsult', icon: Video },
        { name: 'Health Reports', path: '/dashboard/reports', icon: FileText },
        { name: 'Prescriptions', path: '/dashboard/prescriptions', icon: FileText },
        { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare }, // New Link
        { name: 'Profile', path: '/dashboard/profile', icon: User },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-white h-screen shadow-md flex-col fixed left-0 top-0 z-10 hidden md:flex">
            <div className="p-6">
                <div className="bg-white text-teal-700 rounded-md p-4 flex items-center justify-center gap-1 mb-8 shadow-sm border border-gray-100">
                   <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
                   <span className="font-bold text-2xl tracking-tight">MediSync</span>
                </div>
                
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive(item.path) || (item.path === '/dashboard' && location.pathname === '/dashboard')
                                    ? 'text-teal-600 bg-teal-50 font-semibold border-l-4 border-teal-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            
            <div className="mt-auto p-6 space-y-2">
                <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700">
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
