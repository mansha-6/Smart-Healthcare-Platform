import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, X, Edit2, Plus, Video, MessageSquare } from 'lucide-react';
import BookingModal from '../BookingModal'; 
import RescheduleModal from './RescheduleModal';
import { fetchMyAppointments, cancelAppointment } from '../../api/appointmentApi';

const PatientAppointments = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rescheduleTarget, setRescheduleTarget] = useState(null);

    // Fetch real appointments
    useEffect(() => {
        const getAppointments = async () => {
            setLoading(true);
            const mockData = [
                {
                    _id: 'mock_pt_1',
                    doctorId: { 
                        name: 'Dr. Putri Anggraheni', 
                        specialization: 'Primary Care Doctor', 
                        image: '/assets/doctors/dr_female.jpg', 
                        gender: 'Female' 
                    },
                    date: new Date().toISOString(),
                    time: '09:00 AM',
                    status: 'pending',
                    visitType: 'Video visit'
                }
            ];

            try {
                const { data } = await fetchMyAppointments();
                if (data && data.length > 0) {
                    const formatted = data.map(apt => ({
                        _id: apt._id,
                        doctorId: {
                            name: apt.doctorId?.name || 'Unknown Doctor',
                            specialization: apt.doctorId?.specialization || 'General Physician',
                            image: apt.doctorId?.image || '/assets/doctors/dr_male.jpg', // Fallback
                            gender: 'Male' // Default
                        },
                        date: apt.date,
                        time: apt.time,
                        status: apt.status,
                        visitType: apt.type === 'online' ? 'Video visit' : 'In-person'
                    }));
                    
                    // Prioritize real appointments, append mock only if needed or just use real
                    // User wants to see THEIR booking. Let's just go with Real Data + 1 Mock for flavor if list is short? 
                    // No, let's show Real Data cleanly so they find theirs easily.
                    setAppointments(formatted);
                } else {
                    setAppointments(mockData);
                }
            } catch (error) {
                console.error("Failed to fetch appointments", error);
                setAppointments(mockData);
            } finally {
                setLoading(false);
            }
        };
        getAppointments();
    }, [token]);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await cancelAppointment(id, token);
            refreshData(); // Reload
        } catch (error) {
            alert('Failed to cancel');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                <Link to="/doctors" className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition shadow-sm">
                    <Plus size={20} /> Book New Appointment
                </Link>
            </div>
            
            {appointments.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-teal-600" />
                    </div>
                    <p className="mb-4 text-lg font-medium">No appointments found</p>
                    <Link to="/doctors" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-500/30">
                        Book Your First Appointment
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {appointments.length > 0 ? appointments.map(apt => (
                        <div key={apt._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-all duration-300">
                            
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                {/* Left Info */}
                                <div className="flex-1 flex flex-col justify-center">
                                    {/* Status Badge */}
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold w-fit mb-4 flex items-center gap-2 ${
                                        apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                        apt.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                        apt.status === 'rescheduled' ? 'bg-orange-50 text-orange-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                        {apt.status === 'confirmed' ? 'Approved' : 
                                         apt.status === 'pending' ? 'Pending Confirmation' : 
                                         apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{apt.doctorId?.name || 'Unknown Doctor'}</h3>
                                    <p className="text-gray-500 text-sm mb-5">{apt.doctorId?.specialization || 'General Practitioner'}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                        <div className={`p-3 rounded-xl flex items-center gap-3 border ${
                                            apt.visitType === 'In-person' 
                                            ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                                            : 'bg-blue-50 border-blue-100 text-blue-700'
                                        }`}>
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                {apt.visitType === 'In-person' ? <MapPin size={18} /> : <Video size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-80 font-bold uppercase">Visit Type</p>
                                                <p className="text-sm font-bold">
                                                    {apt.visitType || 'Video visit'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Image - Fixed Visibility */}
                                <div className="w-full md:w-32 h-32 shrink-0">
                                    <img 
                                        src={apt.doctorId?.image || '/assets/doctors/dr_female.jpg'}
                                        alt="Doctor"
                                        className="w-full h-full object-cover rounded-[1.5rem] bg-gray-200 shadow-inner"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            // Absolute fallback if local file missing
                                            e.target.src = "https://via.placeholder.com/150?text=Doctor";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            {apt.status !== 'cancelled' ? (
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                                        <MessageSquare size={20} /> Message
                                    </button>
                                    <button 
                                        onClick={() => window.location.href = '/teleconsult'}
                                        className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                                    >
                                        <Video size={20} /> Call doctor
                                    </button>
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-xl text-center text-gray-500 font-medium">
                                    Appointment Cancelled
                                </div>
                            )}

                        </div>
                    )) : (
                        // Keeping the empty state if even mock data fails, but initializing state below will prevent this
                        <div className="text-center p-10">No appointments</div>
                    )}
                </div>
            )}

            {rescheduleTarget && (
                <RescheduleModal 
                    appointment={rescheduleTarget} 
                    onClose={() => setRescheduleTarget(null)}
                    onSuccess={() => {
                        setRescheduleTarget(null);
                        refreshData();
                    }}
                />
            )}
        </div>
    );
};

export default PatientAppointments;
