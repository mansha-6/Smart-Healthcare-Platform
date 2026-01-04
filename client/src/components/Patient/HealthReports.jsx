import React, { useEffect, useState } from 'react';
import API, { BASE_URL } from '../../api';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/ToastProvider';
import { FileText, Download, Eye, Upload, Calendar, X, Trash2 } from 'lucide-react';

const HealthReports = () => {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    
    // Upload State
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchReports = async () => {
        try {
            const { data } = await API.get('/reports/my-reports');
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
            showToast('Error', 'Failed to load reports', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return showToast('Error', 'Please select a file', 'error');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        setUploading(true);
        try {
            await API.post('/reports/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });
            showToast('Success', 'Report uploaded successfully!', 'success');
            setFile(null);
            setTitle('');
            setShowUpload(false);
            fetchReports();
        } catch (error) {
            console.error(error);
            showToast('Error', 'Upload Failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const getFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // Ensure no double slashes if BASE_URL ends with /
        const cleanBase = BASE_URL.replace(/\/$/, '');
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        return `${cleanBase}/${cleanUrl}`;
    };

    const handleView = (url) => {
        window.open(getFileUrl(url), '_blank');
    };

    const handleDownload = async (url, filename) => {
        const fileUrl = getFileUrl(url);
        console.log(`Attempting to download from: ${fileUrl}`);
        showToast('Downloading', 'Your download has started...', 'success');
        
        try {
            const response = await axios.get(fileUrl, { 
                responseType: 'blob' 
            });
            const blob = new Blob([response.data]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename || 'report';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
            showToast('Success', 'Report downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download failed', error);
            showToast('Error', 'Download failed. Opening in new tab.', 'error');
            // Fallback to direct link
            window.open(fileUrl, '_blank');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        try {
            await API.delete(`/reports/${id}`);
            setReports(reports.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete report');
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading reports...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Medical Reports</h2>
                    <p className="text-gray-500 text-sm">Manage and access your health records</p>
                </div>
                <button 
                    onClick={() => setShowUpload(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition"
                >
                    <Upload size={18} /> Upload Report
                </button>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
                        <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Upload New Report</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Blood Test Results" 
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required
                                    />
                                    <Upload className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">{file ? file.name : 'Click to select PDF or Image'}</p>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload Report'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {reports.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center border border-dashed border-gray-300">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
                    <p className="text-gray-500 mb-6">Upload your medical records to keep them safe and handy.</p>
                    <button onClick={() => setShowUpload(true)} className="text-teal-600 font-semibold hover:underline">Upload your first report</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-teal-50 rounded-lg">
                                    <FileText className="text-teal-600" size={24} />
                                </div>
                                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                    {report.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-gray-900 mb-1 truncate" title={report.title}>{report.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                <Calendar size={12} />
                                <span>{new Date(report.date).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-gray-50">
                                <button 
                                    onClick={() => handleView(report.fileUrl)}
                                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-gray-50 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
                                >
                                    <Eye size={16} /> View
                                </button>
                                <button 
                                    onClick={() => handleDownload(report.fileUrl, report.title)}
                                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-teal-50 text-teal-700 py-2 rounded hover:bg-teal-100 transition"
                                >
                                    <Download size={16} /> Download
                                </button>
                                <button 
                                    onClick={() => handleDelete(report._id)}
                                    className="flex items-center justify-center gap-1 text-sm bg-red-50 text-red-600 py-2 px-3 rounded hover:bg-red-100 transition"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HealthReports;
