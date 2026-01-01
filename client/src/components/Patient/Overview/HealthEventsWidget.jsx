import React from 'react';
import { Calendar, Users, Clock, Video } from 'lucide-react';

const HealthEventsWidget = () => {
    const events = [
        {
            title: "Simple Ways to Live a Healthy Lifestyle",
            date: "13 May 2022, 10.00 AM",
            topics: 4,
            duration: "1 Hour 30 Min",
            speaker: 1,
            capacity: 56,
            image: "https://images.unsplash.com/photo-1544367563-12123d8959bd?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            title: "The Ultimate Diet Plan for Beginner",
            date: "15 May 2022, 01.00 PM",
            topics: 12,
            duration: "2 Hour 45 Min",
            speaker: 2,
            capacity: 90,
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200&h=200"
        }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Today's Events</h2>
                    <p className="text-sm text-gray-500">17 events on all activities</p>
                </div>
                <button className="text-sm font-semibold text-green-500 hover:text-green-600">See All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event, index) => (
                    <div key={index} className="p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2 min-h-[56px]">{event.title}</h3>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-4">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{event.date}</span>
                        </div>

                        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-6">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <div className="p-1 bg-gray-100 rounded-full"><Users size={12}/></div>
                                <span>{event.topics} Topics</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <div className="p-1 bg-gray-100 rounded-full"><Clock size={12}/></div>
                                <span>{event.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <div className="p-1 bg-gray-100 rounded-full"><Video size={12}/></div>
                                <span>{event.speaker} Speaker</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <div className="p-1 bg-gray-100 rounded-full"><Users size={12}/></div>
                                <span>{event.capacity} Capacity</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-2 rounded-lg border border-green-500 text-green-500 font-medium text-sm hover:bg-green-50 transition-colors">
                                Detail
                            </button>
                            <button className="flex-1 py-2 rounded-lg bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors shadow-sm shadow-green-200">
                                Join Event
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HealthEventsWidget;
