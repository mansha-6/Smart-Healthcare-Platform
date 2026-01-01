import React from 'react';
import { FileText, MoreHorizontal, Download, Check } from 'lucide-react';

const HealthReportsWidget = () => {
    const reports = [
        { name: "Medical Check Up Report.pdf", size: "2 MB", type: "pdf", status: "checked" },
        { name: "Blood Count Report.doct", size: "5 MB", type: "doc", status: "download" },
        { name: "Heart ECG Report.doct", size: "10 MB", type: "doc", status: "download" },
        { name: "MRI of brain Report.png", size: "25.8 MB", type: "img", status: "download" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-500">Health Reports</h3>
                <span className="text-sm text-teal-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                <span>1-7 March 2024</span>
                <ChevronDown size={12} />
            </div>

            <ul className="space-y-4">
                {reports.map((report, i) => (
                    <li key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded bg-opacity-10 ${report.type === 'pdf' ? 'bg-red-500 text-red-500' : report.type === 'doc' ? 'bg-blue-500 text-blue-500' : 'bg-green-500 text-green-500'}`}>
                                <FileText size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{report.name}</p>
                                <p className="text-xs text-gray-400">{report.size}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {report.status === 'checked' ? <Check size={16} className="text-green-500" /> : <Download size={16} className="text-gray-400 hover:text-gray-600" />}
                            <MoreHorizontal size={16} className="text-gray-400" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Helper for simplicity
const ChevronDown = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

export default HealthReportsWidget;
