import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Star, User, Clock, CheckCircle } from 'lucide-react';

const PatientFeedback = () => {
    const [history, setHistory] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Feedback Modal
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0); // For interactive hover effect
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [historyRes, reviewsRes] = await Promise.all([
                API.get('/appointments/history'),
                API.get('/reviews/my-reviews')
            ]);

            // Filter for unique completed appointments/doctors that haven't been reviewed recently?
            // Simpler: Just show completed appointments.
            const completed = historyRes.data.filter(app => app.status === 'completed' || new Date(app.date) < new Date());
            setHistory(completed);
            setMyReviews(reviewsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const submitFeedback = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post('/reviews', {
                doctorId: selectedDoctor._id || selectedDoctor, // Handle populated object or string ID
                rating,
                comment
            });
            alert('Feedback Submitted!');
            setSelectedDoctor(null);
            setRating(5);
            setHoverRating(0);
            setComment('');
            fetchData(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading feedback...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <MessageSquare className="text-teal-600" /> My Feedback & Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 1: Rate Recent Doctors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Rate Your Recent Visits</h3>
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-sm">No completed appointments to rate yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {history.slice(0, 5).map(app => (
                                <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border">
                                            <img 
                                                src={app.doctorId?.image || (app.doctorId?.gender === 'Female' ? "/avatars/female.svg" : "/avatars/male.svg")}
                                                alt="Doctor" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{app.doctorId?.name || 'Unknown Doctor'}</p>
                                            <p className="text-xs text-gray-500">{new Date(app.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedDoctor(app.doctorId)}
                                        className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition"
                                    >
                                        Rate Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 2: My Submitted Reviews */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">My Review History</h3>
                    {myReviews.length === 0 ? (
                        <div className="text-center py-8">
                             <p className="text-gray-400 text-sm">You haven't submitted any reviews yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {myReviews.map(review => (
                                <div key={review._id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-gray-400" />
                                            <span className="font-semibold text-sm text-gray-800">
                                                {review.doctorId?.name || 'Doctor'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

             {/* Feedback Modal */}
             {selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
                         <h3 className="text-lg font-bold mb-4">Rate Dr. {selectedDoctor.name || 'Doctor'}</h3>
                         <form onSubmit={submitFeedback} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Rating</label>
                                <div className="flex gap-2 justify-center">
                                    {[1,2,3,4,5].map(star => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className={`text-3xl transition transform hover:scale-110 duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-1">
                                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea 
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-28 resize-none text-sm"
                                    placeholder="Share your experience with this doctor..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedDoctor(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </div>
                         </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientFeedback;
