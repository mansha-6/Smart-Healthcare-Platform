import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useToast } from '../ui/ToastProvider';
import { Plus, Trash2, FileText, User, Save, Clock } from 'lucide-react';

const DoctorPrescriptions = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('issue'); // 'issue' or 'upload'
    
    // Issue Prescription State
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '' }]);
    const [notes, setNotes] = useState('');

    // Upload Report State
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadPatientId, setUploadPatientId] = useState('');
    const [uploadedReports, setUploadedReports] = useState([]);
    const [allPatients, setAllPatients] = useState([]);

    // Fetch Lists
    useEffect(() => {
        const init = async () => {
            try {
                const [presRes, patRes] = await Promise.all([
                    API.get('/prescriptions/doctor-prescriptions'),
                    import('../../api/index').then(mod => mod.default.get('/patient/all'))
                ]);
                setPrescriptions(presRes.data);
                setAllPatients(patRes.data);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Search/Upload Handlers
    const handleUploadSearch = async (e) => {
        e?.preventDefault();
        if (!uploadPatientId) return;
        try {
            const { data } = await import('../../api/reportApi').then(mod => mod.fetchPatientReports(uploadPatientId));
            setUploadedReports(data);
        } catch (error) {
            console.error(error);
            showToast('Error', 'Failed to fetch records', 'error');
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!uploadFile || !uploadPatientId) return;
        
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('patientId', uploadPatientId);
        formData.append('title', 'Medical Report / Prescription');

        try {
            await import('../../api/reportApi').then(mod => mod.uploadPrescription(formData));
            showToast('Success', 'File uploaded successfully', 'success');
            handleUploadSearch();
            setUploadFile(null);
        } catch (error) {
            console.error(error);
            showToast('Error', 'Upload failed', 'error');
        }
    };

    // ... (Existing Issue Handlers: handleAddMedicine, etc.)
    const handleAddMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '' }]);
    const handleRemoveMedicine = (i) => { const m = [...medicines]; m.splice(i, 1); setMedicines(m); };
    const handleMedicineChange = (i, f, v) => { const m = [...medicines]; m[i][f] = v; setMedicines(m); };

    const handleIssueSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/prescriptions', {
                patientName,
                patientId: patientId || undefined,
                medicines,
                notes
            });
            showToast(data.isLinked ? 'Success' : 'Warning', data.isLinked ? 'Prescription sent!' : 'Saved (No Patient Linked)', data.isLinked ? 'success' : 'warning');
            
            setPatientName(''); setPatientId(''); setMedicines([{ name: '', dosage: '', frequency: '' }]); setNotes('');
            const { data: newData } = await API.get('/prescriptions/doctor-prescriptions');
            setPrescriptions(newData);
        } catch (error) {
            console.error(error);
            showToast('Error', 'Failed to issue prescription', 'error');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-teal-600" /> Prescription Center
            </h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button 
                    onClick={() => setActiveTab('issue')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'issue' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Issue Digital Prescription
                </button>
                <button 
                    onClick={() => setActiveTab('upload')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'upload' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Upload Physical Report
                </button>
            </div>

            {activeTab === 'issue' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                    {/* Issue Form - Same as before */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">New Prescription</h3>
                        <form onSubmit={handleIssueSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full border p-2 rounded-lg" required placeholder="Name"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID (Automated)</label>
                                <input 
                                    list="pat-list-issue" 
                                    type="text" 
                                    value={patientId} 
                                    onChange={(e) => {
                                        setPatientId(e.target.value);
                                        const p = allPatients.find(p => p._id === e.target.value);
                                        if(p) setPatientName(p.name);
                                    }} 
                                    className="w-full border p-2 rounded-lg" 
                                    placeholder="Search or Enter ID"
                                />
                                <datalist id="pat-list-issue">
                                    {allPatients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </datalist>
                            </div>
                            {/* Medicine Inputs */}
                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                                <div className="space-y-3">
                                    {medicines.map((med, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg relative">
                                            <button type="button" onClick={() => handleRemoveMedicine(index)} className="absolute top-1 right-1 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            <div className="space-y-2">
                                                <input type="text" placeholder="Medicine Name" className="w-full border p-1 rounded text-sm" value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} required />
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="Dosage" className="w-1/2 border p-1 rounded text-sm" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} required />
                                                    <input type="text" placeholder="Freq" className="w-1/2 border p-1 rounded text-sm" value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={handleAddMedicine} className="mt-2 text-sm text-teal-600 font-semibold flex items-center gap-1 hover:underline"><Plus size={16} /> Add Medicine</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border p-2 rounded-lg" rows="2"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition">Issue Prescription</button>
                        </form>
                    </div>

                    {/* History List */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-4">Digital History</h3>
                        {prescriptions.length === 0 ? <div className="text-gray-500">No history found.</div> : (
                            <div className="space-y-4">
                                {prescriptions.map(p => (
                                    <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                        <div><h4 className="font-bold text-gray-800">{p.patientName}</h4><p className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</p></div>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Issued</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                     <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Upload File</h3>
                        <form onSubmit={handleUploadSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                                <input 
                                    list="pat-list-upload"
                                    type="text" 
                                    placeholder="Search by Name or Enter ID" 
                                    value={uploadPatientId}
                                    onChange={(e) => setUploadPatientId(e.target.value)}
                                    className="w-full border p-2 rounded-lg"
                                />
                                <datalist id="pat-list-upload">
                                    {allPatients.map(p => <option key={p._id} value={p._id}>{p.name} (ID: {p._id})</option>)}
                                </datalist>
                                <button type="button" onClick={handleUploadSearch} className="mt-2 text-sm text-blue-600 hover:underline">Fetch Existing Records</button>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                                <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="mx-auto h-12 w-12 text-gray-400 mb-2"><FileText size={48} /></div>
                                    <span className="text-sm text-gray-500">{uploadFile ? uploadFile.name : "Click to select file"}</span>
                                </label>
                            </div>

                            <button type="submit" disabled={!uploadFile} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-300">
                                Upload & Save
                            </button>
                        </form>
                     </div>

                     <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-4">Patient's File History</h3>
                        {uploadedReports.length === 0 ? <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl">Select a patient to view their records.</div> : (
                             <ul className="space-y-2">
                                {uploadedReports.map((rep) => (
                                    <li key={rep._id} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                                        <span className="font-medium text-gray-700">{rep.title} <span className="text-xs text-gray-400 font-normal">({new Date(rep.date).toLocaleDateString()})</span></span>
                                        <a href={rep.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">View File</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                     </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPrescriptions;
