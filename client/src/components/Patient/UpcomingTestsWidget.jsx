import React from 'react';
import { Activity, Droplet, FilePlus, FlaskConical } from 'lucide-react';

const UpcomingTestsWidget = () => {
    const tests = [
        { name: "ECG Test", freq: "Every month", date: "20/04/24", icon: Activity, color: "text-green-500 bg-green-100" },
        { name: "Blood Test", freq: "Every Month", date: "20/04/24", icon: Droplet, color: "text-red-500 bg-red-100" },
        { name: "Diagnosis Test", freq: "Every Month", date: "20/04/24", icon: FilePlus, color: "text-green-500 bg-green-100" },
        { name: "Urine Test", freq: "Every month", date: "20/04/24", icon: FlaskConical, color: "text-orange-500 bg-orange-100" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex-1">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-500">Upcoming Test</h3>
                <span className="text-sm text-teal-600 font-semibold cursor-pointer">View All</span>
            </div>

            <ul className="space-y-4">
                {tests.map((test, i) => (
                    <li key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${test.color}`}>
                                <test.icon size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{test.name}</p>
                                <p className="text-xs text-gray-400">{test.freq}</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{test.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingTestsWidget;
