import React, { useEffect, useState } from 'react';
import { FileText, ArrowRight, Pill, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api'; // Assuming generic API export or use dedicated hook if available

const LatestPrescriptionWidget = () => {
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                // Fetch all prescriptions and take the first one (assuming backend sorts by date desc, or we sort here)
                const { data } = await API.get('/prescriptions/my-prescriptions');
                if (data && data.length > 0) {
                    // Sort by date descending just in case
                    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setPrescription(sorted[0]);
                }
            } catch (error) {
                console.error("Failed to load prescription widget", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) return null; // Or a skeleton

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Latest Prescription</h3>
                        <p className="text-xs text-gray-500">From your recent visit</p>
                    </div>
                </div>
                {prescription && (
                    <button 
                        onClick={() => navigate('/dashboard/prescriptions')}
                        className="text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition"
                    >
                        <ArrowRight size={20} />
                    </button>
                )}
            </div>

            {prescription ? (
                <div>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-bold text-gray-900">{prescription.doctorId?.name || 'Dr. Unknown'}</p>
                            <p className="text-xs text-gray-500">{new Date(prescription.date).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            {prescription.medicines?.length || 0} Meds
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        {prescription.medicines?.slice(0, 2).map((med, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Pill size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-sm font-bold text-gray-700">{med.name}</p>
                                    <p className="text-xs text-gray-500">{med.dosage} • {med.frequency}</p>
                                </div>
                            </div>
                        ))}
                        {(prescription.medicines?.length > 2) && (
                            <p className="text-xs text-center text-gray-400">+{prescription.medicines.length - 2} more medicines</p>
                        )}
                    </div>

                    <button 
                        onClick={() => navigate('/dashboard/prescriptions', { state: { highlightId: prescription._id } })}
                        className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
                    >
                        View Full Prescription
                    </button>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-4">No active prescriptions</p>
                    <button 
                        onClick={() => navigate('/doctors')}
                        className="text-teal-600 font-bold text-sm hover:underline"
                    >
                        Consult a Doctor
                    </button>
                </div>
            )}
        </div>
    );
};

export default LatestPrescriptionWidget;
