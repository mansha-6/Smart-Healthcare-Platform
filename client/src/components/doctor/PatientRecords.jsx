import React from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Utensils, Moon, Briefcase, FileText, Pill, Clock } from 'lucide-react';
import VitalsWidget from '../Patient/VitalsWidget'; // Re-use the nice vitals
import MedicalHistoryWidget from '../Patient/MedicalHistoryWidget';

const PatientRecords = () => {
    // Mock Data for Lifestyle & Consumption
    const activities = [
        { type: 'Resting', hours: '8h 30m', icon: Moon, color: 'bg-indigo-100 text-indigo-600', desc: 'Avg Sleep' },
        { type: 'Working', hours: '9h 15m', icon: Briefcase, color: 'bg-orange-100 text-orange-600', desc: 'Avg Work / Day' },
        { type: 'Physical', hours: '1h 20m', icon: Activity, color: 'bg-green-100 text-green-600', desc: 'Exercise' },
    ];

    const consumption = [
        { item: 'Calories', val: '2200 kcal', target: '2500', icon: Utensils, color: 'text-orange-500' },
        { item: 'Water', val: '1.8 L', target: '3.0 L', icon: Activity, color: 'text-blue-500' }, // Using Activity as droplet alternative if needed, but Vitals has Droplet
    ];

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-teal-600" /> Patient Health Monitoring
                </h2>
                <p className="text-gray-500 mt-1">Detailed breakdown of patient lifestyle, vitals, and medical history.</p>
            </div>

            {/* 1. Vital Signs (Reused from Patient Dashboard for consistency) */}
            <VitalsWidget />

            {/* 2. Lifestyle & Daily Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-purple-500"/> Daily Lifestyle Activity
                    </h3>
                    <div className="space-y-6">
                        {activities.map((act, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${act.color}`}>
                                    <act.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-gray-700">{act.type}</span>
                                        <span className="font-bold text-gray-800">{act.hours}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${act.type === 'Resting' ? 'bg-indigo-500' : (act.type === 'Working' ? 'bg-orange-500' : 'bg-green-500')}`} 
                                            style={{ width: '70%' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{act.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Nutrition & Reports Summary */}
                <div className="space-y-6">
                    {/* Consumption Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <Utensils size={20} className="text-orange-500"/> Consumption Log
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {consumption.map((c, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                    <c.icon size={24} className={`mx-auto mb-2 ${c.color}`} />
                                    <div className="text-2xl font-bold text-gray-800">{c.val}</div>
                                    <div className="text-xs text-gray-500">Target: {c.target}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medications Snippet */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Pill size={20} className="text-teal-600"/> Current Medications
                            </h3>
                            <span className="text-xs text-teal-600 font-bold cursor-pointer">View All</span>
                         </div>
                         <div className="space-y-3">
                             {['Amoxicillin - 500mg', 'Paracetamol - 650mg', 'Vitamin D3'].map((med, i) => (
                                 <div key={i} className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                                     <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                                     <span className="text-sm font-medium text-gray-700">{med}</span>
                                     <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded border">Active</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            {/* 4. Detailed History Widget (Reused) */}
            <div className="grid grid-cols-1">
                 {/* Passing a prop or wrapping it to change title if needed, but default is "My Records" which is fine */}
                 <div className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100">
                     <div className="px-6 pt-6 mb-[-20px]">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FileText size={20} className="text-blue-500"/> Full Medical History
                        </h3>
                     </div>
                     <MedicalHistoryWidget />
                 </div>
            </div>
        </div>
    );
};

export default PatientRecords;
