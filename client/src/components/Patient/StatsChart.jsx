import React from 'react';

const StatsChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex-[2]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-500">Statistics</h3>
                <div className="border px-3 py-1 rounded text-xs text-gray-500">Jan 2024 - 5 Day interval V</div>
            </div>

            {/* Mock Chart Area */}
            <div className="relative h-48 w-full">
                {/* Y-axis labels skipped for simplicity, just visual graph */}
                <svg viewBox="0 0 400 150" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#f0f0f0" strokeWidth="1" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#f0f0f0" strokeWidth="1" />
                    <line x1="0" y1="90" x2="400" y2="90" stroke="#f0f0f0" strokeWidth="1" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#f0f0f0" strokeWidth="1" />

                    {/* Cyan Line (Calories?) */}
                    <path 
                        d="M0 120 C 50 120, 100 80, 150 100 S 250 120, 300 80 S 350 100, 400 90" 
                        fill="none" 
                        stroke="#0ea5e9" 
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Area under Cyan */}
                     <path 
                        d="M0 120 C 50 120, 100 80, 150 100 S 250 120, 300 80 S 350 100, 400 90 V 150 H 0 Z" 
                        fill="url(#cyanGradient)" 
                        opacity="0.1"
                    />

                    {/* Green Line (Carbs?) */}
                    <path 
                        d="M0 60 Q 100 80, 200 60 T 400 40" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3"
                         strokeLinecap="round"
                    />
                     {/* Points */}
                     <circle cx="150" cy="100" r="4" fill="#0ea5e9" />
                     <circle cx="280" cy="95" r="4" fill="#0ea5e9" />
                     <circle cx="340" cy="88" r="4" fill="#0ea5e9" />

                     <circle cx="100" cy="68" r="4" fill="#10b981" />
                     <circle cx="200" cy="60" r="4" fill="#10b981" />
                     <circle cx="300" cy="50" r="4" fill="#10b981" />
                    
                    <defs>
                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            
            <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm text-gray-600">Calories</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-sm text-gray-600">Carbohydrate</span>
                </div>
            </div>
        </div>
    );
};

export default StatsChart;
