import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, X, Edit2, Plus, Video, MessageSquare, FileText } from 'lucide-react';
import BookingModal from '../BookingModal'; 
import RescheduleModal from './RescheduleModal';
import { fetchMyAppointments, cancelAppointment } from '../../api/appointmentApi';

const PatientAppointments = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rescheduleTarget, setRescheduleTarget] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    // Filter appointments based on Active Tab
    const filteredAppointments = appointments.filter(apt => {
        const isPast = new Date(apt.date) < new Date() && apt.status !== 'pending'; // Simple past check
        const isCompleted = apt.status === 'completed' || apt.status === 'cancelled';
        
        if (activeTab === 'history') {
            return isPast || isCompleted;
        }
        return !isPast && !isCompleted;
    });

    const handleViewPrescription = (prescriptionId) => {
        navigate('/dashboard/prescriptions', { 
            state: { highlightId: prescriptionId }
        });
    };

    const handleMessage = (doctor) => {
        navigate('/dashboard/messages', { 
            state: { 
                contact: {
                    id: doctor._id || doctor.id,
                    name: doctor.name,
                    avatar: doctor.image,
                    specialty: doctor.specialization
                } 
            } 
        });
    };

    // Fetch real appointments
    useEffect(() => {
        const getAppointments = async () => {
            setLoading(true);

            // Mock History Data (Always visible for demo purposes)
            const mockHistory = [
                {
                    _id: 'mock_past_1',
                    doctorId: { 
                        _id: 'mock_doc_2',
                        name: 'Dr. Wanapa Aris', 
                        specialization: 'Cardiologist', 
                        image: '/assets/doctors/dr_male.jpg', 
                        gender: 'Male' 
                    },
                    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    time: '10:00 AM',
                    status: 'completed',
                    visitType: 'In-person',
                    hasPrescription: true, // Demo prescription button
                    prescriptionId: 'mock_rx_1'
                },
                {
                    _id: 'mock_past_2',
                    doctorId: { 
                        _id: 'mock_doc_3',
                        name: 'Dr. Sarah Smith', 
                        specialization: 'Dermatologist', 
                        image: '/assets/doctors/dr_female.jpg', 
                        gender: 'Female' 
                    },
                    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    time: '02:30 PM',
                    status: 'cancelled',
                    visitType: 'Video visit'
                },
                 {
                    _id: 'mock_past_3',
                    doctorId: { 
                        _id: 'mock_doc_4',
                        name: 'Dr. James Wilson', 
                        specialization: 'Neurologist', 
                        image: '/assets/doctors/dr_male.jpg', 
                        gender: 'Male' 
                    },
                    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                    time: '11:15 AM',
                    status: 'completed',
                    visitType: 'In-person'
                }
            ];

            try {
                const { data } = await fetchMyAppointments();
                console.log("Fetched appointments:", data);
                
                let combined = [];

                if (data && data.length > 0) {
                    const realAppointments = data.map(apt => ({
                        _id: apt._id,
                        doctorId: {
                            _id: apt.doctorId?._id,
                            name: apt.doctorId?.name || 'Unknown Doctor',
                            specialization: apt.doctorId?.specialization || 'General Physician',
                            image: apt.doctorId?.image || '/assets/doctors/dr_male.jpg', 
                            gender: 'Male' 
                        },
                        date: apt.date,
                        time: apt.time,
                        status: apt.status,
                        visitType: apt.type === 'online' ? 'Video visit' : 'In-person',
                        hasPrescription: apt.hasPrescription,
                        prescriptionId: apt.prescriptionId
                    }));
                    combined = [...realAppointments];
                }

                // ALWAYS append mock history so the user sees "fake datas" as requested
                combined = [...combined, ...mockHistory];
                
                // If absolutely empty (no real data and we want a mock upcoming too)
                if (combined.length === mockHistory.length) {
                     combined.unshift({
                        _id: 'mock_upcoming_1',
                        doctorId: { 
                            _id: 'mock_doc_1',
                            name: 'Dr. Putri Anggraheni', 
                            specialization: 'Primary Care Doctor', 
                            image: '/assets/doctors/dr_female.jpg', 
                            gender: 'Female' 
                        },
                        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                        time: '09:00 AM',
                        status: 'pending',
                        visitType: 'Video visit'
                    });
                }

                setAppointments(combined);

            } catch (error) {
                console.error("Failed to fetch appointments, using full mock data", error);
                // Fallback: Mock Upcoming + Mock History
                setAppointments([
                    {
                        _id: 'mock_upcoming_fallback',
                        doctorId: { _id: 'mock_doc_1', name: 'Dr. Mockithy', specialization: 'General', image: '/assets/doctors/dr_female.jpg' },
                        date: new Date(Date.now() + 86400000).toISOString(),
                        time: '09:00 AM',
                        status: 'pending',
                        visitType: 'Video visit'
                    },
                    ...mockHistory
                ]);
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
            
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Upcoming
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    History
                </button>
            </div>
            
            {filteredAppointments.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-teal-600" />
                    </div>
                    <p className="mb-4 text-lg font-medium">No {activeTab} appointments found</p>
                    {activeTab === 'upcoming' && (
                        <Link to="/doctors" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-500/30">
                            Book Your First Appointment
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map(apt => (
                        activeTab === 'history' ? (
                            // HISTORY LAYOUT (Compact Row)
                            <div key={apt._id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-all">
                                {/* Left: Doctor Info */}
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                        <img 
                                            src={apt.doctorId?.image || '/assets/doctors/dr_male.jpg'} 
                                            alt="Dr" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Dr"} 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-gray-900 text-sm">{apt.doctorId?.name || 'Unknown Doctor'}</h4>
                                        <p className="text-xs text-gray-400">{apt.doctorId?.specialization || 'General'}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 md:hidden">
                                             <span className="flex items-center gap-1"><Calendar size={10}/> {new Date(apt.date).toLocaleDateString()}</span>
                                             <span className="flex items-center gap-1"><Clock size={10}/> {apt.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center: Details (Hidden on mobile, shown on md) */}
                                <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400"/>
                                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-gray-400"/>
                                        <span>{apt.time}</span>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                        apt.status === 'confirmed' || apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>

                                {/* Right: Action */}
                                <div className="w-full md:w-auto flex justify-end">
                                    <button 
                                        onClick={() => navigate('/dashboard/feedback', { state: { selectedDoctorId: apt.doctorId._id } })}
                                        className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-yellow-100 transition border border-yellow-100"
                                    >
                                        <span className="text-lg pb-1">☆</span> Leave Feedback
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // UPCOMING LAYOUT (Detailed Card)
                            <div key={apt._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-all duration-300">
                                
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                    <div className="flex-1 flex flex-col justify-center">
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

                                    <div className="w-full md:w-32 h-32 shrink-0">
                                        <img 
                                            src={apt.doctorId?.image || '/assets/doctors/dr_female.jpg'}
                                            alt="Doctor"
                                            className="w-full h-full object-cover rounded-[1.5rem] bg-gray-200 shadow-inner"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/150?text=Doctor";
                                            }}
                                        />
                                    </div>
                                </div>

                                {apt.status !== 'cancelled' ? (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleMessage(apt.doctorId)}
                                            className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                                        >
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

                                {apt.hasPrescription && (
                                    <button 
                                        onClick={() => handleViewPrescription(apt.prescriptionId)}
                                        className="w-full mt-4 py-3 bg-teal-50 text-teal-700 font-bold rounded-xl border border-teal-100 hover:bg-teal-100 transition flex items-center justify-center gap-2"
                                    >
                                        <FileText size={18} /> View Prescription
                                    </button>
                                )}
                            </div>
                        )
                    ))}
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
