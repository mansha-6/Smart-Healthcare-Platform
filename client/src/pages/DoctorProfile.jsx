import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDoctorById } from '../api/doctorApi';
import API from '../api';
import AppointmentForm from '../components/AppointmentForm';
import BookingWidget from '../components/Doctor/BookingWidget';
import { Star, User, MapPin, Clock } from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await fetchDoctorById(id);
        setDoctor(data);

        const reviewRes = await API.get(`/reviews/${id}`);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [id]);

  if (!doctor) return <div className="text-center p-10 animate-pulse">Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Doctor Header */}
      <div className="bg-white shadow-sm rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start border border-gray-100">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-lg shrink-0">
             <img 
                src={doctor.image || (doctor.gender === 'Female' ? "/avatars/female.svg" : "/avatars/male.svg")}
                alt={doctor.name} 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
            <p className="text-xl text-teal-600 font-medium mb-4">{doctor.specialization}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-teal-500" />
                    <span>{doctor.experience} Years Exp.</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-teal-500" />
                    <span>{doctor.address || 'Medical Center'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${doctor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {doctor.isAvailable ? 'Available Now' : 'Currently Unavailable'}
                    </span>
                </div>
            </div>

        </div>
        <div className="text-right">
             <div className="text-3xl font-bold text-gray-900">${doctor.fees}</div>
             <div className="text-gray-400 text-sm">per consultation</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Reviews */}
        <div className="md:col-span-2 space-y-8">
             {/* Reviews Section */}
            <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star className="text-yellow-400" fill="currentColor" /> 
                    Patient Reviews <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>
                </h2>
                
                {reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                        <p>No reviews yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                                            {review.patientName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{review.patientName}</p>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-2 leading-relaxed bg-gray-50 p-3 rounded-lg">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Booking */}
        <div>
                <BookingWidget 
                    doctorId={doctor._id} 
                    fees={doctor.fees} 
                    bio={doctor.bio} 
                    schedule={doctor.schedule}
                />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
