import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, User, Video, MessageSquare } from 'lucide-react';
import { fetchDoctors } from '../../api/doctorApi';

import BookingModal from '../BookingModal';

const DoctorsWidget = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // ... (existing MOCK_DOCTORS and useEffect)

    return (
        <div className="bg-transparent h-full">
            {/* ... (Header) */}
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Popular Doctors</h3>
                <Link to="/doctors" className="flex items-center text-sm font-semibold text-gray-500 hover:text-teal-600 transition">
                    See All <ChevronRight size={16} />
                </Link>
            </div>

            <div className="space-y-4">
                 {doctors.map(doc => (
                     <div key={doc.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm flex flex-col gap-4 border border-gray-100 hover:shadow-md transition-shadow">
                         
                         {/* Top Row: Info & Action */}
                         <div className="flex items-start justify-between w-full">
                             <div className="flex items-center gap-4">
                                 {/* Avatar */}
                                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                                 </div>
                                 
                                 {/* Info */}
                                 <div>
                                     <h4 className="font-bold text-gray-900 text-lg leading-tight">{doc.name}</h4>
                                     <p className="text-sm text-gray-400 font-medium mb-1">{doc.role}</p>
                                     <div className="flex items-center gap-1.5">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        <span className="text-sm font-bold text-gray-700">{doc.rating}</span>
                                        <span className="text-xs text-gray-400 font-medium">({doc.reviews})</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Right Action */}
                             <button 
                                onClick={() => setSelectedDoctor({
                                    _id: doc.id,
                                    name: doc.name,
                                    fees: doc.fees,
                                    // Map other necessary fields for the modal
                                    availability: doc.availability
                                })}
                                className="px-5 py-2 bg-teal-700 text-white text-xs font-bold rounded-lg hover:bg-teal-800 transition shadow-lg shadow-teal-700/20 self-center"
                             >
                                Book Now
                             </button>
                         </div>

                         {/* ... (Rest of card content) */}
                         <div className="flex items-center gap-6 border-b border-gray-50 pb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <User size={16} className="text-gray-400" />
                                <span className="text-xs font-bold">${doc.fees.visit}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Video size={16} className="text-gray-400" />
                                <span className="text-xs font-bold">${doc.fees.video}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MessageSquare size={16} className="text-gray-400" />
                                <span className="text-xs font-bold">${doc.fees.chat}</span>
                            </div>
                         </div>

                         {doc.availability && (
                             <div className="w-full">
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 shrink-0">Available Today</p>
                                    <div className="flex gap-2 overflow-x-auto scrollbar-none">
                                        {doc.availability.map((time, idx) => (
                                            <button key={idx} className="flex-shrink-0 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-md whitespace-nowrap hover:bg-teal-600 hover:text-white transition">
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </div>
                         )}
                     </div>
                 ))}
            </div>

            {selectedDoctor && (
                <BookingModal 
                    doctor={selectedDoctor} 
                    onClose={() => setSelectedDoctor(null)} 
                    onSuccess={() => alert('Appointment Booked!')} 
                />
            )}
        </div>
    );
};

export default DoctorsWidget;
