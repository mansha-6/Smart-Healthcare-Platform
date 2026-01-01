import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, Edit2, X, MapPin } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RescheduleModal from './RescheduleModal';

const UpcomingAppointment = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rescheduleTarget, setRescheduleTarget] = useState(null);

    useEffect(() => {
        const fetchNextAppointment = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter for upcoming confirm/rescheduled appointments
                const upcoming = data
                    .filter(app => (app.status === 'confirmed' || app.status === 'rescheduled') && new Date(app.date) >= new Date().setHours(0,0,0,0))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                
                if (upcoming.length > 0) {
                    const nextApp = upcoming[0];
                    // Ensure robust data display
                    setAppointment({
                        ...nextApp,
                        doctorId: {
                            ...nextApp.doctorId,
                            image: nextApp.doctorId?.image || (nextApp.doctorId?.gender === 'Female' ? '/assets/doctors/dr_female.jpg' : '/assets/doctors/dr_male.jpg'),
                            specialization: nextApp.doctorId?.specialization || 'General Physician'
                        },
                        visitType: nextApp.type === 'online' ? 'Video visit' : 'In-person'
                    });
                } else {
                    setAppointment(null);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNextAppointment();
    }, [token]);

    const cancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/appointments/cancel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload(); 
        } catch (error) {
            alert('Failed to cancel');
        }
    };

    if (loading) return <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />;
    
    if (!appointment) {
        return (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-3 text-teal-600">
                    <Calendar size={24} />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">No Upcoming Appointments</h3>
                <button 
                    onClick={() => navigate('/doctors')} 
                    className="mt-3 text-teal-600 font-bold text-sm hover:underline"
                >
                    Book Now
                </button>
            </div>
        );
    }
    
    const displayAppointment = appointment;

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative hover:shadow-md transition-all duration-300">
             <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-[2rem]">
                UPCOMING
            </div>

            <div className="flex justify-between items-start gap-4 mb-4 mt-2">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{displayAppointment.doctorId?.name || 'Doctor Name'}</h3>
                    <p className="text-gray-500 text-sm mb-3">{displayAppointment.doctorId?.specialization || 'Specialist'}</p>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{new Date(displayAppointment.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} • {displayAppointment.time}</span>
                        </div>
                        <div className={`flex items-center gap-2 font-bold text-sm ${displayAppointment.visitType === 'In-person' ? 'text-indigo-500' : 'text-blue-500'}`}>
                            {displayAppointment.visitType === 'In-person' ? <MapPin size={16} /> : <Video size={16} />}
                            <span>{displayAppointment.visitType || 'Video visit'}</span>
                        </div>
                    </div>
                </div>

                <div className="w-20 h-20 shrink-0">
                    <img 
                        src={displayAppointment.doctorId?.image || `/assets/doctors/dr_female.jpg`}
                        alt="Doctor"
                        className="w-full h-full object-cover rounded-2xl bg-gray-100"
                        onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = "https://via.placeholder.com/150?text=Doctor";
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                 <button 
                    onClick={() => navigate('/teleconsult')}
                    className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                    <Video size={18} /> Join Call
                </button>
                <button 
                    onClick={() => setRescheduleTarget(displayAppointment)}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    title="Reschedule"
                >
                    <Edit2 size={18} />
                </button>
            </div>

            {rescheduleTarget && (
                <RescheduleModal 
                    appointment={rescheduleTarget} 
                    onClose={() => setRescheduleTarget(null)}
                    onSuccess={() => {
                        setRescheduleTarget(null);
                        window.location.reload(); 
                    }}
                />
            )}
        </div>
    );
};

export default UpcomingAppointment;
