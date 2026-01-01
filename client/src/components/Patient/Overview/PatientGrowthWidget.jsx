import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const growthData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 75 },
  { day: 'Thu', score: 72 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 88 },
];

const rootCauses = [
  { cause: 'Vitamin D Deficiency', type: 'Nutritional', status: 'Addressing' },
  { cause: 'Sedentary Lifestyle', type: 'Lifestyle', status: 'Improved' },
  { cause: 'Irregular Sleep', type: 'Habit', status: 'Addressing' },
];

const PatientGrowthWidget = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recovery & Growth
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Disease Recovery Status */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Current Recovery Status</h3>
                    
                    <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Viral Fever Recovery</p>
                            <p className="text-2xl font-bold text-green-700">85%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>On Track</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400">Estimated full recovery: 3 days</p>
                    </div>
                </div>

                {/* Right: Health Growth Chart */}
                <div className="h-40">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Health Score Growth</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip />
                            <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="border-t pt-4">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Root Causes Identified</h3>
                 <div className="space-y-3">
                    {rootCauses.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                {item.status === 'Improved' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-800">{item.cause}</p>
                                    <p className="text-xs text-gray-500">{item.type}</p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === 'Improved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default PatientGrowthWidget;
