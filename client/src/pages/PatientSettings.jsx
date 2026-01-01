import React, { useState } from 'react';
import { User, Bell, Lock, Moon, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PatientSettings = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    
    // Mock State for Settings
    const [profile, setProfile] = useState({
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Wellness Ave, Healthy City'
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: true,
        promotions: false
    });

    return (
        <div className="p-2 space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 text-sm">Manage your account preferences and configurations.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col md:flex-row">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 border-r border-gray-100 p-4">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <User className="w-5 h-5" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Bell className="w-5 h-5" />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Lock className="w-5 h-5" />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === 'appearance' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Moon className="w-5 h-5" />
                            Appearance
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                    {activeTab === 'profile' && (
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={profile.name} 
                                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <input 
                                            type="text" 
                                            value={profile.phone}
                                             onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={profile.email}
                                         onChange={(e) => setProfile({...profile, email: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <textarea 
                                        value={profile.address}
                                         onChange={(e) => setProfile({...profile, address: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none h-24"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive updates about your appointments via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">SMS Notifications</p>
                                        <p className="text-sm text-gray-500">Receive instant alerts on your phone.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({...notifications, sms: e.target.checked})} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'security' && (
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800">Security Settings</h2>
                            <div className="space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                                    <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">New Password</label>
                                    <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                    <Save className="w-4 h-4" />
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
                            <p className="text-gray-500 text-sm">Customize how the application looks on your device.</p>
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm border border-yellow-100">
                                Dark mode support is coming soon! Currently, only the Light theme is available.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientSettings;
