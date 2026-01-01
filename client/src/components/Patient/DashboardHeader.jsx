import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from '../NotificationPanel';

const DashboardHeader = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/doctors?search=${searchQuery}`);
        }
    };

    return (
        <header className="bg-white p-4 shadow-sm flex justify-between items-center rounded-lg mb-6 relative">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search doctor, specialization..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="relative cursor-pointer">
                    <NotificationPanel />
                </div>
                
                <div className="flex items-center gap-3 cursor-pointer">
                    <img 
                        src={user?.gender?.toLowerCase() === 'female' 
                            ? "/avatars/female.svg" 
                            : "/avatars/male.svg"}  
                        alt="Profile" 
                        className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
                    />
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Patient'}</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
