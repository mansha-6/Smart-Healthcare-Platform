import React, { useEffect, useState } from 'react';
import { fetchDoctorAppointments, updateAppointmentStatus } from '../../api/appointmentApi';
import { Calendar, Clock, Video, Check, X, CheckSquare, MessageSquare, Search, Filter } from 'lucide-react';

const DoctorAppointments = ({ onMessageClick }) => {
    // 1. Initialize with Mock Data for immediate visibility
    const [appointments, setAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        // Force mock data
        const mockData = [
            {
                _id: 'mock1',
                patientId: { name: 'Alex Johnson', image: 'https://randomuser.me/api/portraits/men/32.jpg', gender: 'Male', medicalHistory: 'Hypertension' },
                date: new Date().toISOString(),
                time: '09:00 AM',
                status: 'confirmed',
                reason: 'Regular Checkup'
            },
            {
                _id: 'mock2',
                patientId: { name: 'Sarah Williams', image: 'https://randomuser.me/api/portraits/women/44.jpg', gender: 'Female', medicalHistory: 'Migraine' },
                date: new Date(Date.now() + 86400000).toISOString(),
                time: '10:30 AM',
                status: 'pending',
                reason: 'Neurology Consult'
            },
            {
                _id: 'mock3',
                patientId: { name: 'Michael Brown', image: 'https://randomuser.me/api/portraits/men/85.jpg', gender: 'Male', medicalHistory: 'Diabetes' },
                date: new Date(Date.now() + 172800000).toISOString(),
                time: '02:00 PM',
                status: 'cancelled',
                reason: 'Follow up'
            }
        ];
        setAppointments(mockData);
    }, []);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadAppointments();
    }, []);

    useEffect(() => {
        // Initialize filtered with initial state (mock)
        setFilteredAppointments(appointments);
    }, []); // Run once on mount to set initial mock data

    useEffect(() => {
        let result = appointments;
        
        // Search Filter
        if (searchTerm) {
            result = result.filter(apt => 
                apt.patientId?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status Filter
        if (filterStatus !== 'all') {
            result = result.filter(apt => apt.status === filterStatus);
        }

        setFilteredAppointments(result);
    }, [searchTerm, filterStatus, appointments]);

    const loadAppointments = async () => {
        try {
            const { data } = await fetchDoctorAppointments();
            if (data && data.length > 0) {
                setAppointments(data);
                setFilteredAppointments(data);
            }
            // If empty, we keep the mock data for demo purposes
        } catch (error) {
            console.error("Failed to load real appointments, using mock:", error);
        }
    };

    const handleStatusChange = async (id, status) => {
        // Optimistic update for mock/real
        setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status } : apt));
        
        if (!id.toString().startsWith('mock')) {
            try {
                await updateAppointmentStatus(id, status);
            } catch (error) {
                alert('Failed to update status');
                loadAppointments(); // Revert on error
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                    <h3 className="text-2xl font-bold text-gray-800">Appointments</h3>
                    <p className="text-gray-500 text-sm">Manage your patient schedule</p>
                 </div>

                 <div className="flex gap-3 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search appointment..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <button className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
                         <Filter size={20} />
                     </button>
                 </div>
            </div>

            {filteredAppointments.length === 0 ? (
                 <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                        {searchTerm ? 'No matching appointments found.' : 'No appointments scheduled.'}
                    </p>
                 </div>
            ) : (
                <div className="grid gap-5">
                    {filteredAppointments.map((apt) => {
                        const isPending = apt.status === 'pending';
                        const isConfirmed = apt.status === 'confirmed';
                        const isCancelled = apt.status === 'cancelled';
                        
                        return (
                        <div key={apt._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all duration-300">
                             
                             {/* Left Content */}
                             <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                      {/* Status Badge */}
                                      <div className={`w-fit px-4 py-1.5 rounded-full text-xs font-bold mb-4 flex items-center gap-2 ${
                                            isConfirmed ? 'bg-emerald-50 text-emerald-600' :
                                            isPending ? 'bg-orange-50 text-orange-600' :
                                            isCancelled ? 'bg-red-50 text-red-600' :
                                            'bg-blue-50 text-blue-600'
                                      }`}>
                                           {isConfirmed ? 'Approved' : isPending ? 'Pending Confirmation' : apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                      </div>

                                      <h4 className="text-xl font-bold text-gray-900 mb-1">{apt.patientId?.name || 'Unknown Name'}</h4>
                                      <p className="text-gray-500 text-sm mb-5 font-medium">Patient • {apt.reason || 'General Checkup'}</p>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                           <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                                                <div className="bg-white p-2 rounded-lg text-teal-600 shadow-sm">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Date & Time</p>
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {apt.time}
                                                    </p>
                                                </div>
                                           </div>

                                            <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-3 border border-blue-100 text-blue-700">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <Video size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-80 font-bold uppercase">Visit Type</p>
                                                    <p className="text-sm font-bold">Video visit</p>
                                                </div>
                                           </div>
                                      </div>
                                  </div>

                                  {/* Action Buttons Row */}
                                  <div className="flex w-full gap-3">
                                       <button 
                                           onClick={() => onMessageClick && onMessageClick(apt.patientId)}
                                           className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                                       >
                                            <MessageSquare size={18} /> Message
                                       </button>
                                       
                                       {isPending && (
                                           <>
                                            <button onClick={() => handleStatusChange(apt._id, 'confirmed')} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center justify-center gap-2 transition">
                                                <Check size={18} /> Accept
                                            </button>
                                            <button onClick={() => handleStatusChange(apt._id, 'cancelled')} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center gap-2 transition">
                                                <X size={18} /> Reject
                                            </button>
                                           </>
                                       )}

                                       {isConfirmed && (
                                           <button 
                                                onClick={() => window.location.href = `/teleconsult?room=${apt._id}`}
                                                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                                           >
                                                <Video size={18} /> Call Patient
                                           </button>
                                       )}
                                       
                                       {!isPending && !isConfirmed && !isCancelled && (
                                             <button onClick={() => handleStatusChange(apt._id, 'completed')} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition">
                                                <CheckSquare size={18} /> Mark Complete
                                             </button>
                                       )}
                                  </div>
                             </div>

                             {/* Right Side - Avatar */}
                             <div className="md:w-32 flex flex-col items-center justify-start pt-2">
                                 <div className="w-24 h-24 rounded-[1.5rem] bg-gray-100 overflow-hidden shadow-sm border border-gray-100">
                                      <img 
                                        src={apt.patientId?.image || (apt.patientId?.gender === 'Female' ? "/avatars/female.svg" : "/avatars/male.svg")}
                                        alt="Patient"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            // Fallback to professional vector avatars based on gender if connection fails
                                            e.target.src = apt.patientId?.gender === 'Female' 
                                                ? "https://avatar.iran.liara.run/public/girl" 
                                                : "https://avatar.iran.liara.run/public/boy";
                                        }}
                                      />
                                 </div>
                             </div>

                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
