import React from 'react';

const BodyMeasurements = () => {
    return (
        <div className="bg-gray-800 text-white p-6 rounded-3xl flex-1">
             <div className="mb-6">
                <h3 className="text-lg font-medium mb-1">Body Measurements</h3>
                <p className="text-xs text-gray-400">Last checked 2 Days Ago</p>
                <div className="mt-4 bg-gray-700 w-max px-3 py-1 rounded-full text-xs text-gray-300">
                    Inverted Triangle Body Shape
                </div>
             </div>

             <div className="flex relative">
                 {/* Stats Column */}
                 <div className="space-y-6 z-10">
                     <div className="bg-white text-gray-900 p-3 rounded-xl shadow-lg w-28">
                         <span className="text-xs text-gray-500 block mb-1">Chest (in)</span>
                         <div className="flex items-end gap-1">
                             <span className="text-xl font-bold">44.5</span>
                             <span className="text-red-500 text-sm">↑</span>
                         </div>
                     </div>

                     <div className="bg-white text-gray-900 p-3 rounded-xl shadow-lg w-28">
                         <span className="text-xs text-gray-500 block mb-1">Waist (in)</span>
                         <div className="flex items-end gap-1">
                             <span className="text-xl font-bold">34</span>
                             <span className="text-green-500 text-sm">↓</span>
                         </div>
                     </div>

                     <div className="bg-white text-gray-900 p-3 rounded-xl shadow-lg w-28">
                         <span className="text-xs text-gray-500 block mb-1">Hip (in)</span>
                         <div className="flex items-end gap-1">
                             <span className="text-xl font-bold">42.5</span>
                             <span className="text-green-500 text-sm">↓</span>
                         </div>
                     </div>
                 </div>

                 {/* Body Image Placeholder */}
                 <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center p-2">
                     <img 
                        src="/assets/medical_body_model.png" 
                        alt="Realistic Body Analysis" 
                        className="w-full h-full object-contain drop-shadow-xl opacity-90"
                     />

                     {/* Interactive Pulse Points - Re-positioned relative to image */}
                     {/* Chest Point */}
                     <div className="absolute top-[25%] left-[50%] -translate-x-1/2 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 shadow-sm border border-white"></span>
                     </div>
                     {/* Waist Point */}
                     <div className="absolute top-[38%] left-[50%] -translate-x-1/2 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500 shadow-sm border border-white"></span>
                     </div>
                     {/* Hip Point */}
                     <div className="absolute top-[48%] left-[50%] -translate-x-1/2 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500 shadow-sm border border-white"></span>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export default BodyMeasurements;
