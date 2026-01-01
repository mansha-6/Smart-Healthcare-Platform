import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User, Star, Check } from 'lucide-react';

const PatientHistory = () => {
    const { token } = useAuth(); // Not needed for call? API interceptor handles it, but good to have if needed
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Feedback Modal State
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await API.get('/appointments/history'); // Uses existing endpoint
                // Filter for past/completed
                const past = data.filter(app => {
                    const appDate = new Date(app.date);
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    return appDate < today || app.status === 'completed' || app.status === 'cancelled';
                });
                setHistory(past);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const submitFeedback = async (e) => {
        e.preventDefault();
        
        if (!selectedAppt?.doctorId?._id) {
            alert("Cannot leave feedback for this appointment (Doctor account may have been deleted).");
            return;
        }

        setSubmitting(true);
        try {
            await API.post('/reviews', {
                doctorId: selectedAppt.doctorId._id,
                rating,
                comment
            });
            alert('Feedback Submitted! Thank you.');
            setSelectedAppt(null); // Close modal
            setRating(5);
            setComment('');
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading history...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="text-teal-600" /> Appointment History
            </h2>

            {history.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500">No past appointments found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(app => (
                        <div key={app._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                                    <img 
                                        src={app.doctorId?.image || (app.doctorId?.gender === 'Female' ? "/avatars/female.svg" : "/avatars/male.svg")}
                                        alt="Doctor" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{app.doctorId?.name || 'Unknown Doctor'}</h3>
                                    <p className="text-sm text-gray-500">{app.doctorId?.specialization || 'N/A'}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(app.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock size={12}/> {app.time}</span>
                                        <span className={`px-2 py-0.5 rounded-full ${app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} capitalize`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {app.status !== 'cancelled' && (
                                <button 
                                    onClick={() => setSelectedAppt(app)}
                                    className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-100 transition flex items-center gap-2"
                                >
                                    <Star size={16} /> Leave Feedback
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Feedback Modal */}
            {selectedAppt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
                         <h3 className="text-lg font-bold mb-4">Rate Dr. {selectedAppt?.doctorId?.name || 'Unknown'}</h3>
                         <form onSubmit={submitFeedback} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(star => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                <textarea 
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none"
                                    placeholder="Write your experience..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedAppt(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                         </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientHistory;
