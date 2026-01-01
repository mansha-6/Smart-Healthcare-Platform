import React from 'react';
import { Activity, Droplet, Heart, Thermometer } from 'lucide-react';

const VitalCard = ({ icon: Icon, title, value, unit, status, color, graphColor, graphPath, index }) => {
    const gradientId = `vital-grad-${index}`;
    // Map tailwind classes to hex for gradient:
    // Orange: #F97316, Red: #EF4444, Cyan: #06B6D4
    let stopColor = "#9CA3AF"; 
    if (graphColor.includes("orange")) stopColor = "#F97316";
    if (graphColor.includes("red")) stopColor = "#EF4444";
    if (graphColor.includes("cyan")) stopColor = "#06B6D4";

    return (
        <div className="bg-white p-6 rounded-[24px] shadow-sm flex flex-col h-full border border-gray-50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl w-14 h-14 flex items-center justify-center ${color}`}>
                    <Icon size={24} className="currentColor" />
                </div>
                <div className="text-right">
                    <h4 className="text-gray-400 font-medium text-sm mb-1">{title}</h4>
                    <div className="bg-[#FFF4E6] text-[#FF8C36] text-[10px] font-bold px-2 py-1 rounded inline-block">
                        {status}
                    </div>
                </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-800">{value}</span>
                <span className="text-sm text-gray-400 font-medium">{unit}</span>
            </div>
            
            {/* Smooth Sparkline */}
            <div className="h-16 w-full mt-auto">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={stopColor} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={stopColor} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d={graphPath} 
                        fill="none" 
                        stroke={stopColor} 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    <path 
                         d={`${graphPath} V 50 H 0 Z`} 
                         fill={`url(#${gradientId})`} 
                    />
                </svg>
            </div>
        </div>
    );
};

const VitalsWidget = () => {
    const vitals = [
        {
            icon: Droplet,
            title: "Blood Sugar",
            value: "80",
            unit: "mg / dL",
            status: "Normal",
            color: "bg-orange-100 text-orange-600",
            graphColor: "text-orange-500",
            // Smooth wave
            graphPath: "M0 20 C 20 20, 30 10, 40 15 S 60 25, 70 15 S 90 5, 100 15"
        },
        {
            icon: Heart,
            title: "Heart Rate",
            value: "98",
            unit: "bpm",
            status: "Normal",
            color: "bg-red-100 text-red-600",
            graphColor: "text-red-500",
            // Heartbeat-like wave
            graphPath: "M0 20 C 10 20, 20 25, 30 20 S 40 5, 50 15 S 70 25, 80 10 S 90 15, 100 20"
        },
        {
            icon: Activity,
            title: "Blood Pressure",
            value: "102",
            unit: "/ 72 mmhg",
            status: "Normal",
            color: "bg-cyan-100 text-cyan-600",
            graphColor: "text-cyan-500",
            // Steady wave
            graphPath: "M0 15 C 20 15, 30 20, 40 18 S 60 10, 70 12 S 90 15, 100 10"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vitals.map((v, i) => <VitalCard key={i} index={i} {...v} />)}
        </div>
    );
};

export default VitalsWidget;
