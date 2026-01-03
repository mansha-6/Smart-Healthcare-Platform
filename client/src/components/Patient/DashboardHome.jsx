import React from 'react';
import VitalsWidget from './VitalsWidget';
import HealthEventsWidget from './Overview/HealthEventsWidget';
import BloodPressureWidget from './Overview/BloodPressureWidget';
import LatestPrescriptionWidget from './Overview/LatestPrescriptionWidget';
import HealthSidebar from './Overview/HealthSidebar';

const DashboardHome = () => {
    return (
        <div className="p-2">
            {/* Header / Date */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Health Overview</h1>
                <p className="text-gray-500 text-sm">August 12, 2021</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Left Column (2/3) */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Today's Events */}
                    <HealthEventsWidget />

                    {/* Blood Pressure History */}
                    <BloodPressureWidget />

                    {/* Latest Prescription */}
                    <LatestPrescriptionWidget />
                </div>

                {/* Right Column (1/3) - Sidebar */}
                <div className="xl:col-span-1 h-full">
                    <HealthSidebar />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;


