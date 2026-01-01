import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Droplets, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

const data = [
  { day: 'Sunday', value: 72 },
  { day: 'Monday', value: 75 },
  { day: 'Tuesday', value: 82 },
  { day: 'Wednesday', value: 90 }, // Peak
  { day: 'Thursday', value: 85 },
  { day: 'Friday', value: 86 },
  { day: 'Saturday', value: 95 },
];

const BloodPressureWidget = () => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <div>
                     <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Blood Pressure History
                        <ChevronDown size={20} className="text-gray-400 cursor-pointer" />
                    </h2>
                     <p className="text-sm text-gray-500 mt-1">12 - 19 May 2022</p>
                </div>
            </div>

            <div className="h-64 my-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 12 }} 
                            dy={10}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            dot={false}
                            activeDot={{ r: 6, fill: '#10b981', stroke: '#ecfdf5', strokeWidth: 4 }}
                        />
                        {/* Custom Dot for Peak Point (Wed) */}
                        {/* This is hard to replicate exactly in recharts without custom content, sticking to Line props */}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                        <Droplets size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">80/120</p>
                        <p className="text-xs text-gray-500">Recent Blood Pressure</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-full text-green-500">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">94/128</p>
                        <p className="text-xs text-gray-500">Highest Blood Pressure</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-full text-green-500">
                        <TrendingDown size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">64/104</p>
                        <p className="text-xs text-gray-500">Lowest Blood Pressure</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BloodPressureWidget;
