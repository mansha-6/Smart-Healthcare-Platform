import React from 'react';

const SuccessStatsWidget = () => {
    // Mock Data based on image
    const stats = [
        { label: "Anesthetics", value: 8, max: 10 },
        { label: "Gynecology", value: 9, max: 10 },
        { label: "Neurology", value: 10, max: 10 },
        { label: "Oncology", value: 8, max: 10 },
        { label: "Orthopedics", value: 9, max: 10 },
        { label: "Physiotherapy", value: 10, max: 10 },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Success Stats</h3>
                <button className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
                    May 2024
                </button>
            </div>

            <div className="space-y-6">
                {stats.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <span className="w-28 text-sm font-semibold text-gray-700">{item.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-teal-500 rounded-full" 
                                style={{ width: `${(item.value / item.max) * 100}%` }}
                            ></div>
                        </div>
                        <span className="w-6 text-right text-sm font-bold text-gray-700">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuccessStatsWidget;
