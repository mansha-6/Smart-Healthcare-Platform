import React, { useState } from 'react';

const HealthSidebar = () => {
    const days = ['27', '28', '1', '2', '3', '4', '5'];
    const days2 = ['6', '7', '8', '9', '10', '11', '12'];
    const days3 = ['13', '14', '15', '16', '17', '18', '19'];
    
    return (
        <div className="bg-white p-6 rounded-[32px] h-full shadow-sm border border-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Upcoming appointment</h3>
            </div>

            {/* Calendar Widget */}
            <div className="mb-6">
                 <div className="flex justify-between items-center mb-4">
                     <span className="font-bold text-gray-800">May 2022</span>
                     <div className="flex gap-2">
                         <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400">{'<'}</button>
                         <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400">{'>'}</button>
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-gray-400 uppercase font-medium">
                     <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                 </div>
                 
                 {/* Calendar Grid - Static Mock */}
                 <div className="space-y-3 font-medium text-sm text-center text-gray-600">
                     <div className="grid grid-cols-7 gap-2">
                         {days.map((d, i) => <div key={i} className="py-1 text-gray-400">{d}</div>)}
                     </div>
                     <div className="grid grid-cols-7 gap-2">
                         {days2.map((d, i) => (
                             <div key={i} className={`py-1 rounded-full relative flex items-center justify-center
                                 ${d === '10' ? 'bg-green-500 text-white shadow-lg shadow-green-200 w-8 h-8 mx-auto' : ''}
                             `}>
                                 {d}
                             </div>
                         ))}
                     </div>
                     <div className="grid grid-cols-7 gap-2">
                         {days3.map((d, i) => <div key={i} className="py-1">{d}</div>)}
                     </div>
                 </div>
            </div>

            {/* Appointment List */}
            <div className="space-y-6 mb-8 relative">
                 {/* Vertical Line */}
                 <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-100 rounded-full"></div>

                 <div className="pl-4 relative">
                     <div className="absolute left-0 top-1.5 w-0.5 h-8 bg-red-400 rounded-l-full -ml-[2px] z-10"></div>
                     <p className="text-xs font-semibold text-gray-400 mb-1">10:20 - 11:00 AM</p>
                     <h4 className="font-bold text-gray-800 text-sm">Medical Checkup</h4>
                     <p className="text-xs text-gray-500">Dr Darlene Robertson</p>
                 </div>

                 <div className="pl-4 relative">
                     <div className="absolute left-0 top-1.5 w-0.5 h-8 bg-blue-500 rounded-l-full -ml-[2px] z-10"></div>
                     <p className="text-xs font-semibold text-gray-400 mb-1">15:20 - 14:00 AM</p>
                     <h4 className="font-bold text-gray-800 text-sm">Improve Stress Management</h4>
                     <p className="text-xs text-gray-500">Dr Esther Howard</p>
                 </div>
            </div>

            {/* Linked Devices */}
            <div className="bg-gray-50 rounded-2xl p-4 mt-auto">
                 <h3 className="font-bold text-gray-800 mb-4">Linked Device</h3>
                 <div className="space-y-4">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
                             <img src="https://cdn-icons-png.flaticon.com/512/3004/3004458.png" alt="watch" className="w-full h-full object-contain" />
                         </div>
                         <div>
                             <p className="font-bold text-sm text-gray-800">Smart Watch</p>
                             <p className="text-xs text-gray-500">Amazfit Kratos</p>
                         </div>
                         <div className="ml-auto w-8 h-4 bg-green-500 rounded-full flex items-center justify-end px-0.5">
                             <div className="w-3 h-3 bg-white rounded-full"></div>
                         </div>
                     </div>
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
                             <img src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png" alt="stethoscope" className="w-full h-full object-contain" />
                         </div>
                         <div>
                             <p className="font-bold text-sm text-gray-800">Stethoscope</p>
                             <p className="text-xs text-gray-500">Classic-S</p>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default HealthSidebar;
