import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, User, Video, MessageSquare } from 'lucide-react';

export default function DoctorCard({ doctor, onBook }) {
  const { _id, name, specialization, experience, fees, isAvailable, bio, image, rating } = doctor;

  // Mock availability if real schedule is not complex enough for this view
  const availability = ["10:00 AM", "2:00 PM", "4:30 PM"]; 
  
  // Calculate mock fee breakdown
  const baseFee = fees || 50;
  const feesObj = {
      visit: baseFee,
      video: Math.round(baseFee * 0.6),
      chat: Math.round(baseFee * 0.3)
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border-2 border-white shadow-sm shrink-0">
             <img 
                src={image || (doctor.gender === 'Female' ? "https://randomuser.me/api/portraits/women/60.jpg" : "https://randomuser.me/api/portraits/men/33.jpg")}
                alt={name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
        </div>
        
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-lg text-gray-900 truncate leading-snug">{name}</h3>
                <p className="text-teal-600 font-medium text-sm mb-1">{specialization || 'General Physician'}</p>
             </div>
             <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-xs font-bold text-yellow-700">{rating || 4.8}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
             <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{experience || 5} Years</span>
             </div>
             <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>New York</span>
             </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
         <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {bio || "Experienced specialist dedicated to providing comprehensive care and personalized treatment plans for all patients."}
         </p>
      </div>
      
      {/* Fees Features Grid */}
      <div className="flex items-center gap-6 border-b border-gray-50 pb-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
            <User size={16} className="text-gray-400" />
            <span className="text-xs font-bold">${feesObj.visit}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
            <Video size={16} className="text-gray-400" />
            <span className="text-xs font-bold">${feesObj.video}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
            <MessageSquare size={16} className="text-gray-400" />
            <span className="text-xs font-bold">${feesObj.chat}</span>
        </div>
      </div>

      {/* Schedule / Availability */}
      {isAvailable && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Today</p>
            <div className="flex gap-2">
                {availability.map((time, i) => (
                    <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-100">
                        {time}
                    </span>
                ))}
            </div>
          </div>
      )}

      {/* Action Button - Full Width */}
      <div className="mt-5 pt-4 border-t border-gray-100">
          {onBook ? (
              <button 
                  onClick={onBook}
                  className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md active:scale-95 transform duration-200"
              >
                  Book Appointment
              </button>
          ) : (
              <Link to={`/doctor/${_id}`} className="block w-full text-center bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md active:scale-95 transform duration-200">
                  Book Appointment
              </Link>
          )}
      </div>
    </div>
  );
}
