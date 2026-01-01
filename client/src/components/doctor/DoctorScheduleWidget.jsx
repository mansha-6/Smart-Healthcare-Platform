import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

const DoctorScheduleWidget = () => {
    const [selectedDate, setSelectedDate] = useState(12);

    // Mock Calendar Data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDates = [
        [26, 27, 28, 29, 30, 31, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 29],
        [30, 31, 1, 2, 3, 4, 5]
    ];

    const appointments = [
        {
            id: 1,
            title: "Morning Staff Meeting",
            time: "08:00 AM - 09:00 AM",
            type: "meeting",
            bg: "bg-teal-100",
            text: "text-teal-900"
        },
        {
            id: 2,
            time: "09:00 AM - 10:00 AM",
            type: "empty",
        },
        {
            id: 3,
            title: "Patient Consultation - General Medicine",
            time: "10:00 AM - 12:00 PM",
            type: "consultation",
            bg: "bg-teal-50",
            text: "text-teal-900"
        },
        {
            id: 4,
            time: "12:00 PM - 01:00 PM",
            type: "empty",
        }
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">July 2028</h3>
                <div className="flex gap-4">
                    <button className="text-gray-400 hover:text-gray-600"><ChevronLeft size={20} /></button>
                    <button className="text-gray-400 hover:text-gray-600"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-8">
                <div className="grid grid-cols-7 mb-4">
                    {days.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-gray-400 mb-2">
                            {day}
                        </div>
                    ))}
                    {calendarDates.flat().map((date, index) => {
                         const isCurrentMonth = (index >= 6 && index <= 36); // Simple mock logic for opacity
                         const isSelected = date === 12 && isCurrentMonth;
                         
                         return (
                            <div key={index} className="flex justify-center mb-2">
                                <button 
                                    onClick={() => isCurrentMonth && setSelectedDate(date)}
                                    className={`
                                        w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition
                                        ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-600'}
                                        ${isSelected ? 'bg-slate-800 text-white shadow-lg' : 'hover:bg-gray-100'}
                                    `}
                                >
                                    {date}
                                </button>
                            </div>
                         );
                    })}
                </div>
            </div>

            {/* Agenda Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h4 className="text-gray-500 font-bold mb-1">Wednesday, 12 July</h4>
                </div>
                <button className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-700 transition">
                    <Plus className="text-white" size={20} />
                </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
                {appointments.map(apt => (
                    <div key={apt.id} className="flex gap-4 group">
                        <div className="w-12 text-right pt-2">
                            <span className="text-xs text-gray-400 font-medium">{apt.time.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1">
                            {apt.type !== 'empty' ? (
                                <div className={`p-4 rounded-xl ${apt.bg} border-l-4 border-teal-400 transition hover:shadow-md cursor-pointer`}>
                                    <h5 className={`font-bold text-sm mb-1 ${apt.text}`}>{apt.title}</h5>
                                    <p className="text-xs text-gray-500 font-medium flex items-center opacity-80">
                                        <Clock size={12} className="mr-1" /> {apt.time}
                                    </p>
                                </div>
                            ) : (
                                <div className="h-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorScheduleWidget;
