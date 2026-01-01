import React, { useEffect, useState } from 'react';
import axios from '../../api/index';
import { Stethoscope, Users, User } from 'lucide-react';

const DoctorPatientLinks = () => {
    const [mappings, setMappings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMappings = async () => {
            try {
                const res = await axios.get('/doctor/patient-mappings');
                setMappings(res.data);
            } catch (err) {
                console.error("Error fetching mappings:", err);
                setError("Failed to load doctor-patient data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMappings();
    }, []);

    if (loading) return <div className="p-4 text-center text-gray-500 animate-pulse">Loading links...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-indigo-500" />
                    Doctor-Patient Network
                </h3>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {mappings.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">No data available.</p>
                ) : (
                    mappings.map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            {/* Doctor Header */}
                            <div className="bg-indigo-50/50 p-3 flex items-center gap-3 border-b border-indigo-50">
                                <img 
                                    src={item.doctor.image || "https://placehold.co/100x100/4F46E5/FFFFFF?text=Dr"} 
                                    alt={item.doctor.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    onError={(e) => {e.target.src='https://placehold.co/100x100/4F46E5/FFFFFF?text=Dr'}}
                                />
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{item.doctor.name}</h4>
                                    <p className="text-xs text-indigo-600 font-medium">{item.doctor.specialization}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                                    <Users className="w-3 h-3 text-indigo-500" />
                                    {item.patients.length} Patient{item.patients.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Patient List */}
                            <div className="p-2">
                                {item.patients.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {item.patients.map(p => (
                                            <div key={p._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-xs text-gray-700">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-500 shrink-0">
                                                    {p.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="truncate font-medium">{p.name || 'Unknown'}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-2">No patients linked yet.</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorPatientLinks;
