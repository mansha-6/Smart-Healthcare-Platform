import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DoctorAnalytics from '../components/doctor/DoctorAnalytics';
import DoctorOverview from '../components/doctor/DoctorOverview';
import DoctorAppointments from '../components/doctor/DoctorAppointments';
import DoctorProfileWidget from '../components/doctor/DoctorProfileWidget'; // New Widget
import PatientRecords from '../components/doctor/PatientRecords';
import AllPatientsList from '../components/Patient/AllPatientsList'; // Reuse patient list

import DoctorProfileEditor from '../components/doctor/DoctorProfileEditor';
import DoctorBiography from '../components/doctor/DoctorBiography';
import DoctorPrescriptions from '../components/doctor/DoctorPrescriptions';
import ChatInterface from '../components/Chat/ChatInterface';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    // Basic auth check
    const { user, logout } = useAuth ? useAuth() : { user: JSON.parse(localStorage.getItem('user')), logout: () => {} }; 
    // Ideally useAuth from context. I'll check AuthContext in a moment.

    const [activeTab, setActiveTab] = useState('overview');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const navigate = useNavigate();

    // If no user or not doctor, redirect (handled by protected route too, but safe here)
    if (!user || user.role !== 'doctor') {
        return (
            <div className="p-10 text-center">
                <p>Access Denied. Doctors Only.</p>
                <button onClick={() => navigate('/login')} className="text-blue-600 underline">Login</button>
            </div>
        );
    }

    const [chatTarget, setChatTarget] = useState(null);

    const handleMessageClick = (patient) => {
        // Normalize patient data for ChatInterface if needed
        const contact = {
            id: patient._id || patient.id,
            name: patient.name,
            avatar: patient.image,
            specialty: 'Patient' // or whatever context
        };
        setChatTarget(contact);
        setActiveTab('messages');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DoctorOverview />;
            case 'appointments': return <DoctorAppointments onMessageClick={handleMessageClick} />;
            case 'records': return <PatientRecords />;
            case 'directory': return (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">All Registered Patients</h2>
                    <AllPatientsList />
                </div>
            );
            case 'prescriptions': return <DoctorPrescriptions />;
            case 'profile': return <DoctorProfileEditor doctor={user} />;
            case 'biography': return <DoctorBiography doctor={user} onEdit={() => setActiveTab('profile')} />;
            case 'messages': return <div className="p-8"><ChatInterface role="doctor" initialContact={chatTarget} /></div>; // New Route
            default: return <DoctorAnalytics />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white shadow-md z-10 flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">Dr. Panel</h2>
                    <p className="text-sm text-gray-500">Welcome, {user.name}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'overview' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('appointments')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'appointments' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Appointments
                    </button>
                    <button 
                        onClick={() => setActiveTab('records')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'records' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Patient Records
                    </button>
                    <button 
                        onClick={() => setActiveTab('directory')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'directory' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Patient Directory
                    </button>
                    <button 
                        onClick={() => setActiveTab('prescriptions')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'prescriptions' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Prescriptions
                    </button>
                    <button 
                        onClick={() => setActiveTab('messages')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'messages' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Messages
                    </button>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'profile' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        My Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('biography')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeTab === 'biography' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                        Biography & Qual.
                    </button>
                </nav>
                
                {/* Logout Button moved to bottom of sidebar */}
                <div className="p-4 border-t">
                    <button 
                        onClick={() => { logout?.(); navigate('/login'); }} 
                        className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-50 transition font-medium flex items-center gap-2"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {renderContent()}
            </main>

            {/* Right Sidebar (Profile Widget) - Only visible on Overview tab */}
            {activeTab === 'overview' && (
                <aside className="w-full xl:w-80 bg-gray-50 p-4 border-l hidden lg:block overflow-y-auto animate-in slide-in-from-right-10 duration-500">
                    <DoctorProfileWidget doctor={user} />
                </aside>
            )}
        </div>
    );
};

export default DoctorDashboard;
