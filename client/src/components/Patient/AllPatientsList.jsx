import React, { useEffect, useState } from 'react';
import axios from '../../api/index';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

const AllPatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get('/patient/all');
                setPatients(res.data);
            } catch (err) {
                console.error("Error fetching patients:", err);
                setError("Failed to load patient directory.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) return <div className="p-4 text-center text-gray-500 animate-pulse">Loading directory...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    All Registered Patients
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs ml-2">
                        {patients.length}
                    </span>
                </h3>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {patients.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">No registered patients found.</p>
                ) : (
                    patients.map(patient => (
                        <div key={patient._id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                                {patient.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 truncate">{patient.name || 'Unknown'}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" /> 
                                        {patient.age ? `${patient.age} yrs` : 'Age N/A'} • {patient.gender || 'N/A'}
                                    </div>
                                    {patient.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {patient.phone}
                                        </div>
                                    )}
                                    {patient.address && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate max-w-[150px]">{patient.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="bg-gray-100 px-2 py-1 rounded-md">ID: ...{patient._id.slice(-4)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllPatientsList;
