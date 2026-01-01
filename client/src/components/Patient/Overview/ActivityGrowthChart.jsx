import React, { useState } from 'react';

const ActivityGrowthChart = () => {
    // Mock Data for Stacked Bar Chart (18 Days)
    // Structure: [Aerobics (Red), Yoga (Teal), Meditation (Orange)]
    const data = [
        [20, 30, 10], [10, 45, 0], [35, 10, 0], [25, 15, 10], [0, 25, 20], 
        [15, 25, 0], [40, 20, 15], [20, 30, 10], [12, 30, 20], [10, 15, 25],
        [30, 10, 15], [30, 15, 25], [35, 10, 20], [20, 10, 15], [40, 20, 10],
        [20, 10, 5], [30, 25, 10]
    ];
    
    // Config
    const days = Array.from({length: 17}, (_, i) => `Jan ${i + 1}`);
    const maxHeight = 200;
    const barWidth = 6;
    const gap = 24;
    const chartWidth = data.length * (barWidth + gap);
    
    const [tooltipParams, setTooltipParams] = useState({ show: false, x: 0, y: 0, day: '', values: [] });

    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm mb-6 border border-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-gray-800">Activity Growth</h3>
                <div className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-500 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                    Jan 2021 <span className="transform rotate-90 text-xs">›</span>
                </div>
            </div>

            <div className="relative h-[250px] w-full overflow-x-auto overflow-y-hidden hide-scrollbar">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-[10px] text-gray-400 font-medium z-10 bg-white bg-opacity-90">
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                </div>

                {/* Bars Area */}
                <div className="ml-10 h-full relative" style={{ minWidth: '600px' }}>
                     {/* Horizontal Grid Lines */}
                     <div className="absolute inset-0 flex flex-col justify-between mb-8 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-full h-px bg-gray-50 border-t border-dashed border-gray-100"></div>
                        ))}
                    </div>

                    <div className="flex items-end h-full pb-8 gap-4 px-2">
                        {data.map((dayData, index) => {
                            const [aerobics, yoga, meditation] = dayData;
                            // Scale factor: assuming max total is around 80-90, and we map to % of container height.
                            // Let's settle on max scale = 80 units.
                            const scale = 1.2; // Multiplier to fill height better if needed
                            
                            const h1 = aerobics * scale; 
                            const h2 = yoga * scale; 
                            const h3 = meditation * scale;

                            return (
                                <div 
                                    key={index} 
                                    className="relative group flex flex-col items-center flex-1 min-w-[20px] cursor-pointer h-full justify-end"
                                    onMouseEnter={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setTooltipParams({
                                            show: true,
                                            x: rect.left + rect.width / 2,
                                            y: rect.top,
                                            day: days[index],
                                            values: dayData
                                        });
                                    }}
                                    onMouseLeave={() => setTooltipParams({...tooltipParams, show: false})}
                                >
                                    {/* Bar Stack */}
                                    <div className="w-2 relative flex flex-col-reverse justify-start items-center h-full">
                                         {/* Aerobics (Bottom) */}
                                         <div 
                                            className="w-full bg-[#EF4444] rounded-full mb-1 transition-all group-hover:opacity-80" 
                                            style={{ height: `${h1}%` }}
                                         ></div>
                                         
                                         {/* Yoga (Middle) */}
                                         <div 
                                            className="w-full bg-[#0D9488] rounded-full mb-1 transition-all group-hover:opacity-80" 
                                            style={{ height: `${h2}%` }}
                                         ></div>

                                         {/* Meditation (Top) */}
                                         <div 
                                            className="w-full bg-[#D97706] rounded-full transition-all group-hover:opacity-80" 
                                            style={{ height: `${h3}%` }}
                                         ></div>
                                    </div>
                                    
                                    {/* X-Axis Label */}
                                    <span className="text-[9px] text-gray-400 rotate-[-30deg] origin-top-left md:rotate-0 whitespace-nowrap mt-2 absolute top-full left-1/2 -translate-x-1/2">{days[index]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tooltip */}
                {tooltipParams.show && (
                    <div 
                        className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg py-1 px-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-8px]"
                        style={{ left: tooltipParams.x, top: tooltipParams.y }}
                    >
                        <div className="font-bold mb-1 border-b border-gray-700 pb-1">{tooltipParams.day}</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></div> Aerobics: {tooltipParams.values[0]}%</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></div> Yoga: {tooltipParams.values[1]}%</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></div> Meditation: {tooltipParams.values[2]}%</div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-2 justify-start ml-10 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Aerobics
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D9488]"></span> Yoga
                </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Meditation
                </div>
            </div>
        </div>
    );
};

export default ActivityGrowthChart;
