import React, { useState } from 'react';
import { Calendar, Video, MessageSquare, Check, X, CheckSquare, Search, Filter, Clock } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const AdminAppointments = ({ onMessageClick }) => {
    const navigate = useNavigate();
    // Mock Data (Reusing the structure from DoctorAppointments as requested)
    const [appointments, setAppointments] = useState([
        {
            _id: '1',
            patient: { _id: 'p1', name: 'Alex Johnson', image: 'https://randomuser.me/api/portraits/men/32.jpg', gender: 'Male' },
            doctor: { name: 'Dr. Sarah Jones', spec: 'Neurology' },
            date: new Date().toISOString(),
            time: '09:00 AM',
            status: 'confirmed',
            reason: 'Regular Checkup',
            type: 'Video visit'
        },
        {
            _id: '2',
            patient: { _id: 'p2', name: 'Sarah Williams', image: 'https://randomuser.me/api/portraits/women/44.jpg', gender: 'Female' },
            doctor: { name: 'Dr. John Smith', spec: 'Cardiology' },
            date: new Date(Date.now() + 86400000).toISOString(),
            time: '10:30 AM',
            status: 'pending',
            reason: 'Heart Consultation',
            type: 'Physical Visit'
        },
        {
            _id: '3',
            patient: { _id: 'p3', name: 'Michael Brown', image: 'https://randomuser.me/api/portraits/men/85.jpg', gender: 'Male' },
            doctor: { name: 'Dr. Emily Brown', spec: 'Orthopedics' },
            date: new Date(Date.now() + 172800000).toISOString(),
            time: '02:00 PM',
            status: 'cancelled',
            reason: 'Knee Pain',
            type: 'Video visit'
        }
    ]);

    const handleStatusChange = (id, newStatus) => {
        setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                 <div>
                    <h3 className="text-xl font-bold text-gray-800">Appointments Management</h3>
                    <p className="text-gray-500 text-sm">Oversee all hospital appointments</p>
                 </div>

                 <div className="flex gap-3 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                        />
                     </div>
                     <button className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white text-gray-600">
                         <Filter size={20} />
                     </button>
                 </div>
            </div>

            <div className="grid gap-5">
                {appointments.map((apt) => {
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
                                        {isConfirmed ? 'Confirmed' : isPending ? 'Pending Approval' : apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">{apt.patient.name}</h4>
                                            <p className="text-gray-500 text-sm font-medium">Patient • {apt.reason}</p>
                                        </div>
                                        <div className="text-right">
                                             <h4 className="text-sm font-bold text-gray-800">{apt.doctor.name}</h4>
                                             <p className="text-xs text-blue-500">{apt.doctor.spec}</p>
                                        </div>
                                    </div>

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
                                                <p className="text-sm font-bold">{apt.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Row */}
                                <div className="flex w-full gap-3">
                                    <button 
                                        onClick={() => onMessageClick && onMessageClick(apt.patient)}
                                        className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                                    >
                                        <MessageSquare size={18} /> Chat
                                    </button>
                                    
                                    {isPending && (
                                        <>
                                        <button onClick={() => handleStatusChange(apt._id, 'confirmed')} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center justify-center gap-2 transition">
                                            <Check size={18} /> Approve
                                        </button>
                                        <button onClick={() => handleStatusChange(apt._id, 'cancelled')} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center gap-2 transition">
                                            <X size={18} /> Reject
                                        </button>
                                        </>
                                    )}

                                    {isConfirmed && (
                                        <button 
                                            onClick={() => navigate('/teleconsult')}
                                            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                                        >
                                            <Video size={18} /> Join Call
                                        </button>
                                    )}
                                    
                                    {isCancelled && (
                                           <button onClick={() => handleStatusChange(apt._id, 'pending')} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition">
                                            <Clock size={18} /> Restore
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - Patient Avatar */}
                            <div className="md:w-32 flex flex-col items-center justify-start pt-2">
                                <div className="w-24 h-24 rounded-[1.5rem] bg-gray-100 overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
                                    <img 
                                    src={apt.patient.image}
                                    alt="Patient"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">Patient ID</p>
                                <p className="text-xs font-bold text-gray-700">#PAT-{apt._id}23</p>
                            </div>

                    </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminAppointments;
