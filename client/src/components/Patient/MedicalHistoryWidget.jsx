import React from 'react';
import { ChevronRight, ShieldAlert, Users, Stethoscope, Pill, Thermometer, Microscope, Dna } from 'lucide-react';

const MedicalHistoryWidget = () => {
    const records = [
        { name: "Allergies", count: 4, icon: ShieldAlert, color: "text-teal-600 bg-teal-50" },
        { name: "Family History", count: 2, icon: Users, color: "text-teal-600 bg-teal-50" },
        { name: "Diagnoses/Conditions", count: 3, icon: Stethoscope, color: "text-teal-600 bg-teal-50" },
        { name: "Medications & Supplements", count: 4, icon: Pill, color: "text-teal-600 bg-teal-50" },
        { name: "Symptoms", count: 2, icon: Thermometer, color: "text-teal-600 bg-teal-50" },
        { name: "Lab Tests", count: 4, icon: Microscope, color: "text-teal-600 bg-teal-50" },
        { name: "DNA Tests", count: 2, icon: Dna, color: "text-teal-600 bg-teal-50" },
    ];

    return (
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm min-h-[400px] border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">My Records</h3>
                <span className="text-sm text-teal-600 font-bold cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-3">
                {records.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-full ${item.color} group-hover:bg-teal-100 transition-colors`}>
                                <item.icon size={20} className="text-teal-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-400 font-medium">{item.count} records found</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-teal-600 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicalHistoryWidget;
