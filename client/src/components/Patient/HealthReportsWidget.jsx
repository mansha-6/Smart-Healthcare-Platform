import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import { FileText, MoreHorizontal, Download, Check } from 'lucide-react';

const HealthReportsWidget = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await API.get('/reports/my-reports');
                setReports(data);
            } catch (error) {
                console.error("Failed to load reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    // Helper to determine icon/color based on file type or extension
    const getFileStyles = (filename = '', type = '') => {
        const ext = filename.split('.').pop().toLowerCase();
        if (type.includes('pdf') || ext === 'pdf') return { bg: 'bg-red-500', text: 'text-red-500', label: 'PDF' };
        if (type.includes('image') || ['jpg', 'png', 'jpeg'].includes(ext)) return { bg: 'bg-indigo-500', text: 'text-indigo-500', label: 'IMG' };
        return { bg: 'bg-blue-500', text: 'text-blue-500', label: 'DOC' };
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex-1 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Health Reports</h3>
                <Link to="/dashboard/reports" className="text-sm text-teal-600 font-semibold cursor-pointer hover:underline">View All</Link>
            </div>
            
            {loading ? (
                <div className="text-center py-4 text-gray-400 text-xs">Loading reports...</div>
            ) : reports.length === 0 ? (
                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm">No reports found.</p>
                </div>
            ) : (
                <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {reports.slice(0, 5).map((report, i) => {
                        const styles = getFileStyles(report.fileUrl, report.type);
                        const isRx = report.title.toLowerCase().includes('prescription');
                        return (
                            <li key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded transition border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-2.5 rounded-lg bg-opacity-10 ${styles.bg} ${styles.text}`}>
                                        <FileText size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-700 truncate block max-w-[140px]">{report.title}</p>
                                        <p className="text-xs text-gray-400">{new Date(report.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isRx && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-bold">Rx</span>}
                                    <a 
                                        href={report.fileUrl.startsWith('http') ? report.fileUrl : `http://localhost:5000/${report.fileUrl}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition"
                                        title="Download/View"
                                    >
                                        <Download size={16} />
                                    </a>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

// Helper for simplicity
const ChevronDown = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

export default HealthReportsWidget;
