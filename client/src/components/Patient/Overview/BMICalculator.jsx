import React, { useState } from 'react';

const BMICalculator = () => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(72);

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    return (
        <div className="bg-gray-800 text-white p-6 rounded-3xl mb-6">
            <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-lg font-medium mb-1">BMI Calculator</h3>
                 </div>
                 <div className="border border-gray-600 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-gray-400">
                    Last Week <span className="transform rotate-180">^</span>
                 </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="bg-orange-100 text-gray-800 p-4 rounded-xl flex-1">
                    <div className="flex justify-between mb-2 text-xs text-gray-400">
                        <span>Height</span>
                        <span>{height} cm</span>
                    </div>
                     {/* Pseudo-Ruler */}
                    <div className="h-4 w-full flex justify-between items-end mb-2 px-1">
                         {[...Array(10)].map((_, i) => <div key={i} className={`w-0.5 bg-gray-400 ${i%2===0?'h-2':'h-1'}`}></div>)}
                    </div>
                    <input 
                        type="range" 
                        min="100" 
                        max="220" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)} 
                        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="bg-cyan-100 text-gray-800 p-4 rounded-xl flex-1">
                    <div className="flex justify-between mb-2 text-xs text-gray-400">
                         <span>Weight</span>
                         <span>{weight} kg</span>
                    </div>
                     <div className="h-4 w-full flex justify-between items-end mb-2 px-1">
                         {[...Array(10)].map((_, i) => <div key={i} className={`w-0.5 bg-gray-400 ${i%2===0?'h-2':'h-1'}`}></div>)}
                    </div>
                    <input 
                        type="range" 
                        min="30" 
                        max="150" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Body Mass Index (BMI)</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">You're Healthy</span>
                </div>
                <div className="text-3xl font-bold mb-4">{bmi}</div>
                
                {/* BMI Gradient Bar */}
                <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400 mb-6">
                    <div 
                        className="absolute w-3 h-3 bg-white border-2 border-red-500 rounded-full -top-0.5 shadow transition-all"
                        style={{ left: `${Math.min(Math.max((bmi - 15) * 3, 0), 100)}%` }} // Rough mapping
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
