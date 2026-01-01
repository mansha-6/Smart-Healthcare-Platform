import React from 'react';
import { Phone, MessageSquare, Briefcase, Star } from 'lucide-react';

const DoctorProfileWidget = ({ doctor }) => {
    // Mock data to match the design aesthetics if real data is missing
    const stats = {
        appointments: "2.543",
        totalPatients: "3.567",
        consultations: "13.078",
        returnPatients: "2.736",
        missedCalls: 18,
        newMessages: 9
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center h-full overflow-y-auto custom-scrollbar">
            {/* 1. Doctor Image */}
            <div className="relative mb-4 mt-2">
                <div className="w-24 h-24 rounded-2xl bg-pink-400 overflow-hidden shadow-lg p-0.5">
                    <img 
                        src={doctor?.image || "/assets/doctor_illustration.png"} 
                        alt={doctor?.name}
                        className="w-full h-full object-cover rounded-xl bg-white"
                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                    />
                </div>
            </div>

            {/* 2. Name & Info */}
            <h3 className="text-lg font-bold text-gray-800 text-center">{doctor?.name || "Dr. Jackson Santos"}</h3>
            <p className="text-xs text-gray-500 font-medium mb-6 text-center">
                {doctor?.specialization || "Dermatologists"} - {doctor?.hospital || "Texas Hospital"}
            </p>

            {/* 3. Appointment Limit Progress */}
            <div className="w-full mb-8">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-xl font-bold text-purple-700 block">150 People</span>
                        <span className="text-xs text-gray-500 font-medium">Appointments Limit</span>
                    </div>
                </div>
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-purple-600 rounded-full"></div>
                </div>
                <div className="text-right mt-1">
                    <span className="text-xs font-bold text-gray-600">150/300</span>
                </div>
            </div>

            {/* 4. Stats Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 w-full mb-8">
                <div>
                    <h4 className="text-xl font-bold text-purple-700">{stats.appointments}</h4>
                    <p className="text-xs text-gray-500 font-medium">Appointments</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-purple-700">{stats.totalPatients}</h4>
                    <p className="text-xs text-gray-500 font-medium">Total Patients</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-purple-700">{stats.consultations}</h4>
                    <p className="text-xs text-gray-500 font-medium">Consultations</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-purple-700">{stats.returnPatients}</h4>
                    <p className="text-xs text-gray-500 font-medium">Return Patients</p>
                </div>
            </div>

            {/* 5. Action Buttons */}
            <div className="flex gap-4 w-full mt-auto">
                <button className="flex-1 bg-purple-600 text-white rounded-2xl py-4 px-2 flex flex-col items-center justify-center shadow-purple-200 shadow-lg hover:bg-purple-700 transition">
                    <span className="text-lg font-bold mb-1">{stats.missedCalls}</span>
                    <span className="text-[10px] font-medium opacity-90 mb-2">Missed Call</span>
                    <Phone className="w-5 h-5 text-purple-200 transform rotate-12" strokeWidth={2.5} />
                </button>

                <button className="flex-1 bg-white text-purple-700 border border-purple-200 rounded-2xl py-4 px-2 flex flex-col items-center justify-center hover:bg-purple-50 transition">
                    <span className="text-lg font-bold mb-1">{stats.newMessages}</span>
                    <span className="text-[10px] font-medium text-gray-500 mb-2">New Messages</span>
                    <MessageSquare className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                </button>
            </div>
            
            {/* 6. Extras (Visual Widgets) */}
            <div className="w-full mt-6 space-y-6">
                
                {/* Profile Circle */}
                 <div className="flex flex-col items-center">
                    <h5 className="text-xs font-bold text-gray-500 mb-2 w-full text-left">Profile Status</h5>
                    <div className="relative w-24 h-24">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="42" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                            <circle cx="48" cy="48" r="42" stroke="#8b5cf6" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 * 0.4} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-purple-600">60%</span>
                        </div>
                    </div>
                </div>

                {/* Articles Bars */}
                <div className="w-full">
                    <h5 className="text-xs font-bold text-gray-500 mb-3 text-left">Article Stats</h5>
                     <div className="flex justify-between items-end h-24 px-1 gap-2">
                         {/* Bar 1 */}
                         <div className="flex flex-col items-center gap-1 w-1/4">
                             <div className="w-full bg-purple-500 rounded-t h-16 opacity-80"></div>
                         </div>
                         {/* Bar 2 */}
                         <div className="flex flex-col items-center gap-1 w-1/4">
                             <div className="w-full bg-purple-400 rounded-t h-8 opacity-80"></div>
                         </div>
                         {/* Bar 3 */}
                         <div className="flex flex-col items-center gap-1 w-1/4">
                             <div className="w-full bg-purple-500 rounded-t h-16 opacity-80"></div>
                         </div>
                         {/* Bar 4 */}
                         <div className="flex flex-col items-center gap-1 w-1/4">
                             <div className="w-full bg-purple-400 rounded-t h-8 opacity-80"></div>
                         </div>
                     </div>
                </div>
                
                {/* Reviews Stars */}
                <div className="w-full">
                    <h5 className="text-xs font-bold text-gray-500 mb-2 text-left">Rating</h5>
                    <div className="flex gap-0.5 justify-center mb-1">
                        {[1,2,3,4,5].map(s => (
                            <Star key={s} size={20} fill={s <= 4 ? "#8b5cf6" : "#e5e7eb"} className={s <= 4 ? "text-purple-500" : "text-gray-200"} strokeWidth={0} />
                        ))}
                    </div>
                     <p className="text-center text-xs font-medium text-gray-500">
                        <span className="font-bold text-gray-800">4.5/5</span> (1563 Reviews)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileWidget;
