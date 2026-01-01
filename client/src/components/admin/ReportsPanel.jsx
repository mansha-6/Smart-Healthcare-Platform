import React from 'react';
import API from '../../api/index';

const ReportsPanel = () => {
    const handleDownload = async () => {
        try {
            const response = await API.get('/admin/report', { responseType: 'blob' });
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'system-report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to download report');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">System Reports</h3>
            <p className="text-gray-600 mb-6">Generate a detailed PDF report of system statistics, user counts, and appointment metrics.</p>
            <button 
                onClick={handleDownload}
                className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 flex items-center gap-2"
            >
                <span>Download System Report (PDF)</span>
            </button>
        </div>
    );
};

export default ReportsPanel;
