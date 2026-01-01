import React from 'react';
import VitalsWidget from '../VitalsWidget';
import BMICalculator from './BMICalculator';
import BodyMeasurements from './BodyMeasurements';
import ActivityGrowthChart from './ActivityGrowthChart';
import PatientGrowthWidget from './PatientGrowthWidget';
import { Search, Bell } from 'lucide-react';

const HealthOverview = () => {
    return (
        <div>
             {/* Header */}
             <div className="flex justify-between items-end mb-6">
                <div>
                     <h2 className="text-2xl font-bold text-gray-800">Health Overview</h2>
                     <p className="text-sm text-gray-500">August 12, 2021</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 bg-white rounded-full shadow-sm text-gray-600"><Search size={20}/></button>
                    <button className="p-2 bg-white rounded-full shadow-sm text-gray-600"><Bell size={20}/></button>
                </div>
             </div>

             <div className="space-y-6">
                 {/* Top Stats */}
                 <div className="w-full">
                    <VitalsWidget />
                 </div>

                 {/* Charts Section - Side by Side */}
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                     <ActivityGrowthChart />
                     <PatientGrowthWidget />
                 </div>

                 {/* Physical Analysis Section - Side by Side */}
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                     <BMICalculator />
                     <BodyMeasurements />
                 </div>

                 {/* Detailed Appointment Banner */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                     <div>
                         <h4 className="font-bold text-gray-800 text-lg">Upcoming Consultation</h4>
                         <p className="text-gray-500">General Checkup with Dr. James</p>
                     </div>
                     <span className="bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-lg">August 14, 2021 • 10:00 AM</span>
                 </div>
             </div>
        </div>
    );
};

export default HealthOverview;
