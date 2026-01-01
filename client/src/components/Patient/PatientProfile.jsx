import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight, ShieldAlert, Users, Stethoscope, Pill, Thermometer, Microscope, Dna, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const records = [
        { name: "Allergies", count: 4, icon: ShieldAlert, color: "text-teal-600 bg-teal-50" },
        { name: "Family History", count: 2, icon: Users, color: "text-teal-600 bg-teal-50" },
        { name: "Diagnoses/Conditions", count: 3, icon: Stethoscope, color: "text-teal-600 bg-teal-50" },
        { name: "Medications & Supplements", count: 4, icon: Pill, color: "text-teal-600 bg-teal-50" },
        { name: "Symptoms", count: 2, icon: Thermometer, color: "text-teal-600 bg-teal-50" },
        { name: "Lab Tests", count: 4, icon: Microscope, color: "text-teal-600 bg-teal-50" },
        { name: "DNA Tests", count: 2, icon: Dna, color: "text-teal-600 bg-teal-50" },
    ];

    return (
        <div className="max-w-2xl mx-auto py-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex-1 text-center pr-10"> {/* Padding right to balance back button */}
                    <h1 className="text-2xl font-bold text-teal-700">My health record</h1>
                </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="bg-white rounded-[2rem] shadow-sm p-8 mb-8 text-center border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-teal-50 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4 flex items-center justify-center">
                        <img 
                            src={user?.gender?.toLowerCase() === 'female' ? "/avatars/female.svg" : "/avatars/male.svg"} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.name || 'Moshiur'}</h2>
                    <p className="text-sm font-semibold text-teal-600 bg-teal-50 inline-block px-3 py-1 rounded-full">
                        ID: {user?._id?.slice(-6).toUpperCase() || '000000'}
                    </p>
                </div>
            </div>

            {/* Records List Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold text-gray-700">All records</h3>
            </div>

            {/* Records List */}
            <div className="space-y-3">
                {records.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-teal-100 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className={`p-3 rounded-full ${item.color} group-hover:bg-teal-600 group-hover:text-white transition-colors`}>
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-base mb-0.5">{item.name}</h4>
                                <p className="text-xs text-gray-400 font-medium">{item.count} records found</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-full group-hover:bg-teal-50 transition-colors">
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-teal-600" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientProfile;
