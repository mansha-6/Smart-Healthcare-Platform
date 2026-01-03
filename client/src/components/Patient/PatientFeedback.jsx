import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Star, User, Clock, CheckCircle } from 'lucide-react';

const PatientFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [allDoctors, setAllDoctors] = useState([]);
    
    const [history, setHistory] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false); // New state for reviewing anyone

    const fetchData = async () => {
        // Define Robust Mock Data
        const extraMockDoctors = [
            { _id: 'mock_doc_1', name: 'Dr. Mockithy', specialization: 'General Physician', image: '/assets/doctors/dr_female.jpg' },
            { _id: 'mock_doc_2', name: 'Dr. Wanapa Aris', specialization: 'Cardiologist', image: '/assets/doctors/dr_male.jpg' },
            { _id: 'mock_doc_3', name: 'Dr. Sarah Smith', specialization: 'Dermatologist', image: '/assets/doctors/dr_female.jpg' },
            { _id: 'mock_doc_4', name: 'Dr. James Wilson', specialization: 'Neurologist', image: '/assets/doctors/dr_male.jpg' },
            { _id: 'mock_doc_5', name: 'Dr. Emily Blunt', specialization: 'Pediatrician', image: '/assets/doctors/dr_female.jpg' },
            { _id: 'mock_doc_6', name: 'Dr. Michael Chang', specialization: 'Orthopedic Surgeon', image: '/assets/doctors/dr_male.jpg' },
            { _id: 'mock_doc_7', name: 'Dr. Laura Croft', specialization: 'Psychologist', image: '/assets/doctors/dr_female.jpg' },
            { _id: 'mock_doc_8', name: 'Dr. Alan Grant', specialization: 'Dentist', image: '/assets/doctors/dr_male.jpg' }
        ];

        const extraMockHistory = [
             {
                _id: 'mock_h_1',
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                status: 'completed',
                doctorId: extraMockDoctors[0]
            },
            {
                _id: 'mock_h_2',
                date: new Date(Date.now() - 172800000).toISOString(),
                status: 'completed',
                doctorId: extraMockDoctors[1]
            },
             {
                _id: 'mock_h_3',
                date: new Date(Date.now() - 400000000).toISOString(),
                status: 'completed',
                doctorId: extraMockDoctors[2]
            },
             {
                _id: 'mock_h_4',
                date: new Date(Date.now() - 800000000).toISOString(),
                status: 'completed',
                doctorId: extraMockDoctors[3]
            }
        ];

        try {
            const [historyRes, reviewsRes, doctorsRes] = await Promise.all([
                API.get('/appointments/history'),
                API.get('/reviews/my-reviews'),
                API.get('/doctor/list') 
            ]);

            const completed = historyRes.data.filter(app => app.status === 'completed' || new Date(app.date) < new Date());
            
            // Merge Real + Mock
            setHistory([...completed, ...extraMockHistory]); 
            setMyReviews(reviewsRes.data);
            setAllDoctors([...doctorsRes.data, ...extraMockDoctors]);

        } catch (error) {
            console.error("Failed to fetch data", error);
            // Fallback: Full Mock
            setHistory(extraMockHistory);
            setAllDoctors(extraMockDoctors);
            // Mock reviews if failed
            setMyReviews([]); 
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    // Check for incoming navigation state to auto-open modal
    useEffect(() => {
        if (allDoctors.length > 0) {
            const targetId = location.state?.selectedDoctorId;
            // Only proceed if there is actually a targetId to handle
            if (!targetId) return;

            let targetDoc = allDoctors.find(d => d._id === targetId);

            // Fallback: If specific doctor not found (e.g. mock data), pick random for testing
            if (!targetDoc) {
                // Check if we have any doctors to pick from
                if (allDoctors.length > 0) {
                     const randomDoc = allDoctors[Math.floor(Math.random() * allDoctors.length)];
                     console.warn("Target doctor not found, selecting random:", randomDoc?.name);
                     targetDoc = randomDoc;
                }
            }

            if (targetDoc) {
                setSelectedDoctor(targetDoc);
                // Clear the state so this doesn't re-run on next render/update
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.state, allDoctors, navigate, location.pathname]);

    const handleSuccess = () => {
        setSelectedDoctor(null);
        setShowGenericModal(false);
        setRating(0);
        setComment('');
        setSubmitting(false);
        // Force clear navigation state to prevent re-opening
        navigate(location.pathname, { replace: true, state: {} });
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) return;

        setSubmitting(true);

        // Handle Mock Doctors (Client-sides simulation)
        if (selectedDoctor._id && selectedDoctor._id.toString().startsWith('mock')) {
            console.log("Simulating review for mock doctor...");
            setTimeout(() => {
                const newMockReview = {
                    _id: 'mock_review_' + Date.now(),
                    doctorId: selectedDoctor,
                    rating,
                    comment,
                    date: new Date().toISOString()
                };
                setMyReviews([newMockReview, ...myReviews]);
                handleSuccess();
                // alert('Review submitted successfully (Simulated)!');
            }, 1000);
            return;
        }

        // Handle Real Doctors
        try {
            await API.post('/reviews', {
                doctorId: selectedDoctor._id,
                rating,
                comment
            });
            // Refresh data
            await fetchData();
            handleSuccess();
        } catch (error) {
            console.error("Failed to submit review", error);
            alert("Failed to submit review. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="text-teal-600" /> My Feedback & Reviews
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 1: Rate Recent Visits (Restored) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-bold text-gray-900 border-l-4 border-teal-500 pl-3">Rate Recent Visits</h3>
                         <button 
                            onClick={() => { setSelectedDoctor(null); setShowGenericModal(true); }}
                            className="text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg transition"
                         >
                            Rate Other
                         </button>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                             <p>No recent appointments to rate.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.slice(0, 8).map(app => (
                                <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200">
                                           <img src={app.doctorId?.image || "/assets/doctors/dr_male.jpg"} alt="Doc" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{app.doctorId?.name || 'Unknown Doctor'}</p>
                                            <p className="text-xs text-gray-500">{new Date(app.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedDoctor(app.doctorId)}
                                        className="text-xs font-bold text-teal-700 bg-white border border-teal-100 px-4 py-2 rounded-lg hover:bg-teal-600 hover:text-white transition shadow-sm"
                                    >
                                        Rate
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 2: My Submitted Reviews */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-teal-500 pl-3">History</h3>
                    </div>
                    {myReviews.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                             <p>You haven't submitted any reviews yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {myReviews.map(review => (
                                <div key={review._id} className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition bg-white group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs">
                                                {review.doctorId?.name?.[0] || 'D'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">
                                                    {review.doctorId?.name || 'Doctor'}
                                                </p>
                                                <p className="text-xs text-gray-400">{review.doctorId?.specialization || 'General'}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <p className="text-gray-600 text-sm italic pl-4 border-l-2 border-gray-200 group-hover:border-teal-300 transition-colors">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

             {/* Feedback Modal (Specific or Generic) */}
             {(selectedDoctor || showGenericModal) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
                         <h3 className="text-lg font-bold mb-4">
                            {selectedDoctor ? `Rate Dr. ${selectedDoctor.name}` : 'Write a Review'}
                         </h3>
                         
                         <form onSubmit={submitFeedback} className="space-y-4">
                            {/* Dropdown for Generic Mode */}
                            {(!selectedDoctor && showGenericModal) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                                    <select 
                                        className="w-full border p-2 rounded-lg"
                                        onChange={(e) => {
                                            const docId = e.target.value;
                                            const doc = allDoctors.find(d => d._id === docId);
                                            setSelectedDoctor(doc); // Set logic
                                        }}
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>Choose a doctor...</option>
                                        {allDoctors.map(doc => (
                                            <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.specialization}) - {doc.address || 'Location N/A'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

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
                                    onClick={() => { setSelectedDoctor(null); setShowGenericModal(false); }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting || (!selectedDoctor && !showGenericModal)} // Require selection
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
