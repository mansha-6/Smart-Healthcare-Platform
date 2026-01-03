import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api';
import { useToast } from '../ui/ToastProvider';
import { FileText, Download, Calendar } from 'lucide-react';



const PrescriptionCard = ({ prescription }) => {
    const { showToast } = useToast();

    const handleDownload = async () => {
        showToast('Processing', `Saving prescription from ${prescription.doctorName}...`, 'info');
        
        const content = `SMART HEALTHCARE PLATFORM - PRESCRIPTION
        
Doctor: ${prescription.doctorName}
Specialty: ${prescription.specialty}
Date: ${prescription.date}

MEDICINES:
${prescription.medicines.map(m => `- ${m.name}: ${m.dosage}`).join('\n')}

(This is a digital copy)
        `;
        
        try {
            // Sanitize filename: replace slashes, colons, commas, and spaces to prevent FS errors
            const safeDate = prescription.date.replace(/[\/\\:,]/g, '-').replace(/\s+/g, '_');
            const safeDocName = prescription.doctorName.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `Prescription_${safeDocName}_${safeDate}.txt`;
            const file = new File([content], filename, { type: 'text/plain' });
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', `Prescription: ${prescription.doctorName} (${prescription.date})`);

            await API.post('/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showToast('Success', 'Prescription saved to Health Reports!', 'success');
        } catch (err) {
            console.error(err);
            const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            showToast('Error', `Failed: ${serverMsg}`, 'error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">{prescription.doctorName}</h3>
                    <p className="text-sm text-gray-500">{prescription.specialty}</p>
                </div>
                <div className="flex items-center text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
                    <Calendar size={14} className="mr-1" />
                    <span>{prescription.date}</span>
                </div>
            </div>

            {prescription.notes && (
                <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h4 className="text-sm font-bold text-yellow-800 mb-1 uppercase tracking-wide">Doctor's Instructions</h4>
                    <p className="text-sm text-yellow-900 leading-relaxed italic">"{prescription.notes}"</p>
                </div>
            )}

            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Medicine List</h4>
                <div className="space-y-3">
                    {prescription.medicines.map((med, index) => (
                        <div key={index} className="flex justify-between items-center bg-teal-50 p-3 rounded-lg border border-teal-100">
                            <span className="font-medium text-teal-900">{med.name}</span>
                            <span className="text-sm text-teal-700">{med.dosage}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleDownload}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
                <Download size={18} />
                Save to Reports
            </button>
        </div>
    );
};

const PatientPrescriptions = () => {
    const { showToast } = useToast();
    const location = useLocation();
    const [prescriptions, setPrescriptions] = useState([]);
    
    console.log('[DEBUG] PatientPrescriptions MOUNTED. Location:', location.pathname);
    const [loading, setLoading] = useState(true);
    const highlightId = location.state?.highlightId;

    // Scroll to highlighted item
    useEffect(() => {
        if (highlightId && !loading && prescriptions.length > 0) {
            const el = document.getElementById(`presc-${highlightId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-2', 'ring-teal-500', 'ring-offset-2');
                setTimeout(() => el.classList.remove('ring-2', 'ring-teal-500', 'ring-offset-2'), 3000);
            }
        }
    }, [highlightId, loading, prescriptions]);

    const fetchPrescriptions = async () => {
        try {
            const { data } = await API.get('/prescriptions/my-prescriptions');
            setPrescriptions(data);
        } catch (error) {
            console.error("Failed to fetch prescriptions", error);
            showToast('Error', 'Failed to load prescriptions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    // Also keep the mock ones if no real ones exist for demo? 
    // Or just clean switch. Let's do clean switch but handle empty state.

    if (loading) return <div className="p-8 text-center animate-pulse">Loading prescriptions...</div>;

    return (
        <div className="p-2 animate-fadeIn">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-teal-600" />
                    My Prescriptions
                </h1>
                <p className="text-gray-500">View and download your digital prescriptions</p>
            </div>

            {prescriptions.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-500">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4"/>
                    <p>No prescriptions found.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prescriptions.map((prescription) => (
                        <div id={`presc-${prescription._id}`} key={prescription._id} className="transition-all duration-500">
                             <PrescriptionCard prescription={{
                                ...prescription,
                                // Ensure date is formatted or object
                                date: new Date(prescription.date).toLocaleDateString(),
                                // Ensure doctorName exists
                                doctorName: prescription.doctorId?.name || 'Doctor', 
                                specialty: prescription.doctorId?.specialty || 'General' 
                            }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientPrescriptions;
