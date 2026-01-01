import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useToast } from '../ui/ToastProvider';
import { FileText, Download, Calendar, Activity, Eye } from 'lucide-react';

const RecordCard = ({ record }) => {
    const { showToast } = useToast();

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{record.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Activity size={12} className="text-teal-500" />
                        {record.type || 'Medical Report'}
                    </p>
                </div>
                <div className="flex items-center text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="mb-6 h-24 bg-teal-50 rounded-lg flex items-center justify-center border border-teal-100 overflow-hidden relative group">
                {/* Preview or Icon */}
                <FileText size={40} className="text-teal-300" />
                <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-bold text-teal-800 bg-white px-2 py-1 rounded shadow">Preview</span>
                </div>
            </div>

            <div className="flex gap-2">
                <a 
                    href={record.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium text-sm"
                >
                    <Eye size={16} /> View
                </a>
                <a 
                    href={record.fileUrl} 
                    download
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
                >
                    <Download size={16} /> Download
                </a>
            </div>
        </div>
    );
};

const MyHealthRecords = () => {
    const { showToast } = useToast();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        try {
            const { data } = await API.get('/reports/my-reports');
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
            // showToast('Error', 'Failed to load records', 'error'); // Optional silent fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse text-gray-500">Loading health records...</div>;

    return (
        <div className="p-2 animate-fadeIn">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-teal-600" />
                    My Health Records
                </h1>
                <p className="text-gray-500">Access your medical history, lab reports, and uploaded documents</p>
            </div>

            {records.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-500">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4"/>
                    <p>No health records found.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records.map((record) => (
                        <RecordCard key={record._id} record={record} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyHealthRecords;
