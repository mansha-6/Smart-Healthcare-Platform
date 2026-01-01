import React, { useState } from 'react';
import { Search, Bell, Calendar as CalendarIcon, Clock } from 'lucide-react';

const PatientAppointmentsWidget = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    // Mock Data based on the design (Patient viewing their Doctors)
    const appointments = {
        upcoming: [
            {
                id: 1,
                doctor: "Dr. Andrea H.",
                specialty: "MD, DNB( Endo)",
                date: "Today, 02 Oct, 2023",
                time: "09:00 - 10:00 AM",
                status: "Scheduled",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                header: "Today"
            },
            {
                id: 2,
                doctor: "Dr. Amira Yuasha",
                specialty: "Diploma (Cardiac EP)",
                date: "Today, 02 Oct, 2023",
                time: "09:00 - 10:00 AM",
                status: "Scheduled",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                header: "Today"
            },
            {
                id: 3,
                doctor: "Dr. Eion Morgan",
                specialty: "MDS, FDS RCPS",
                date: "Today, 02 Oct, 2023",
                time: "09:00 - 10:00 AM",
                status: "Scheduled",
                avatar: "https://randomuser.me/api/portraits/men/22.jpg",
                header: "Today"
            },
            {
                id: 4,
                doctor: "Dr. Jerry Jones",
                specialty: "MBBS, MD (Neurology)",
                date: "Tomorrow, 03 Oct, 2023",
                time: "09:00 - 10:00 AM",
                status: "Scheduled",
                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                header: "Tomorrow"
            },
            {
                id: 5,
                doctor: "Dr. Eion Morgan",
                specialty: "MD, MNAMS",
                date: "Tomorrow, 03 Oct, 2023",
                time: "09:00 - 10:00 AM",
                status: "Scheduled",
                avatar: "https://randomuser.me/api/portraits/men/22.jpg",
                header: "Tomorrow"
            }
        ],
        past: [],
        cancelled: []
    };

    const getFilteredAppointments = () => {
        return appointments[activeTab] || [];
    };

    const groupedAppointments = getFilteredAppointments().reduce((acc, app) => {
        const key = app.header;
        if (!acc[key]) acc[key] = [];
        acc[key].push(app);
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                </div>
                 <div className="flex gap-2">
                    <button className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Search size={20} />
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-teal-50/50 p-1.5 rounded-full flex items-center justify-between mb-8">
                {['Past', 'Upcoming', 'Cancelled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex-1 ${
                            activeTab === tab.toLowerCase() 
                            ? 'bg-teal-700 text-white shadow-md' 
                            : 'text-teal-700 hover:bg-teal-100/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Appointment Lists */}
            <div className="space-y-6">
                {Object.keys(groupedAppointments).length > 0 ? (
                    Object.entries(groupedAppointments).map(([header, apps]) => (
                        <div key={header}>
                            {/* Section Header */}
                            <div className="flex justify-between items-center mb-4 px-1">
                                <h3 className="font-bold text-gray-800 text-lg">{header}</h3>
                                <span className="text-xs font-bold text-teal-600">
                                    {apps[0]?.date.split(', ')[1]} {/* Extract date part */}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="space-y-4">
                                {apps.map((app) => (
                                    <div key={app.id} className="flex gap-4 p-4 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="shrink-0 relative">
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src={app.avatar} alt={app.doctor} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{app.doctor}</h4>
                                            <p className="text-xs text-gray-400 font-medium mb-3">{app.specialty}</p>
                                            
                                            <div className="inline-flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg">
                                                <span className={`text-[10px] font-bold uppercase tracking-wide ${app.status === 'Scheduled' ? 'text-teal-600' : 'text-gray-500'}`}>
                                                    {app.status}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-[10px] font-bold text-gray-600">
                                                    {app.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        No {activeTab} appointments found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientAppointmentsWidget;
