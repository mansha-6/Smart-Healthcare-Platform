import React, { useEffect, useState } from 'react';
import { Users, Stethoscope, Briefcase, Star, TrendingUp, Calendar as CalIcon, MessageSquare, Phone, MoreHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchDoctorStats } from '../../api/doctorApi';

const DoctorOverview = () => {
    const { user } = useAuth ? useAuth() : { user: { name: 'David' } };
    const [stats, setStats] = useState({
        totalPatients: 1540,
        consultations: '12K',
        experience: '42', // Mimicking "Staff" visual (e.g., 42 successful surgeries)
        reviews: '4.8',
    });

    // Mock Data mimicking the screenshot structure
    const upcomingAppointments = [
        { name: 'Dr. Eion Morgan', role: 'MBBS, MD (Neurology)', time: '09:00 - 10:00 AM', img: '/assets/doctor_avatar_default.png' },
        { name: 'Dr. Sarah Smith', role: 'BDS, MDS (Dentist)', time: '11:00 - 12:00 PM', img: '/assets/doctor_avatar_default.png' },
        { name: 'Dr. Mike Ross', role: 'Cardiologist', time: '02:00 - 03:00 PM', img: '/assets/doctor_avatar_default.png' },
    ];

    const successStats = [
        { label: 'Anesthetics', val: 8, color: 'bg-teal-400' },
        { label: 'Gynecology', val: 9, color: 'bg-teal-400' },
        { label: 'Neurology', val: 10, color: 'bg-teal-400' },
        { label: 'Oncology', val: 8, color: 'bg-teal-400' },
        { label: 'Orthopedics', val: 9, color: 'bg-teal-400' },
        { label: 'Physiotherapy', val: 10, color: 'bg-teal-400' },
    ];

    const renderCalendar = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dates = Array.from({length: 31}, (_, i) => i + 1);
        const startDayOffset = 2; // Starts on Tuesday mimicking random month

        return (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">July 2025</h3>
                    <div className="flex gap-2 text-gray-400">
                        <ChevronLeft size={16} className="cursor-pointer hover:text-gray-600"/>
                        <ChevronRight size={16} className="cursor-pointer hover:text-gray-600"/>
                    </div>
                </div>
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-2">
                    {days.map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 text-center text-sm font-medium gap-y-3">
                     {Array(startDayOffset).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
                     {dates.map(d => (
                         <div key={d} className={`
                            w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer
                            ${d === 12 ? 'bg-navy-900 text-white bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}
                         `}>
                             {d}
                         </div>
                     ))}
                </div>
            </div>
        );
    };

    const renderGrowthChart = () => (
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full justify-between group">
             <div>
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-500">
                    <TrendingUp size={24} />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">Growth Analysis</h3>
                <p className="text-gray-400 text-sm">Your practice has grown by <span className="text-teal-500 font-bold">12%</span></p>
             </div>
             
             {/* Simple Curve SVG mimicking screenshot */}
             <div className="h-40 w-full mt-4">
                 <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                     <path 
                        d="M0 50 C 60 50, 80 10, 200 5" 
                        fill="none" 
                        stroke="#2dd4bf" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                    />
                    <circle cx="200" cy="5" r="6" fill="#2dd4bf" className="group-hover:r-8 transition-all"/>
                 </svg>
             </div>
         </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* 1. Top Section: Appointments / Cards Row (Mimicking Top Row of Screenshot) */}
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {upcomingAppointments.map((app, i) => (
                    <div key={i} className="min-w-[300px] bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <img src={app.img} alt="Doc" className="w-14 h-14 rounded-full object-cover bg-gray-200" />
                        <div>
                            <h4 className="font-bold text-gray-800">{app.name}</h4>
                            <p className="text-xs text-gray-400 mb-2">{app.role}</p>
                            <span className="bg-teal-50 text-teal-600 text-[10px] font-bold px-2 py-1 rounded">
                                SCHEDULED • {app.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Stats Grid (4 Cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Patients</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-800">{stats.totalPatients}</h3>
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2 font-bold flex items-center gap-1">
                        <TrendingUp size={12}/> +12% from last month
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                     <p className="text-gray-500 text-sm font-medium mb-1">Total Consultation</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-800">{stats.consultations}</h3>
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                            <Stethoscope size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2 font-bold flex items-center gap-1">
                        <TrendingUp size={12}/> +85 new today
                    </p>
                </div>

                 {/* Card 3 (Staff -> Experience/Other) */}
                 <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                     <p className="text-gray-500 text-sm font-medium mb-1">Surgeries/Procedures</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-800">{stats.experience}</h3>
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                            <Briefcase size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2 font-bold flex items-center gap-1">
                        <TrendingUp size={12}/> +2 this week
                    </p>
                </div>

                {/* Card 4 (Room -> Rating/Other) */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                     <p className="text-gray-500 text-sm font-medium mb-1">Avg Rating</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-bold text-gray-800">{stats.reviews}</h3>
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                            <Star size={20} fill="currentColor" />
                        </div>
                    </div>
                    <p className="text-xs text-green-500 mt-2 font-bold flex items-center gap-1">
                         <TrendingUp size={12}/> 3 new reviews
                    </p>
                </div>
            </div>

            {/* 3. Bottom Grid: Major Widgets (Balanced Layout) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Growth Analysis (Wide) */}
                <div className="xl:col-span-2">
                    {renderGrowthChart()}
                </div>

                {/* Success Stats (Side) */}
                <div className="xl:col-span-1 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 overflow-y-auto max-h-[320px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Top Diagnoses</h3>
                        <span className="text-xs bg-teal-50 text-teal-600 font-bold px-2 py-1 rounded">May 2024</span>
                    </div>
                    <div className="space-y-5">
                        {successStats.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm font-bold text-gray-700 mb-1.5">
                                    <span>{item.label}</span>
                                    <span>{item.val}</span>
                                </div>
                                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.val / 10) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar */}
                <div className="xl:col-span-1 h-full">
                    {renderCalendar()}
                </div>

                {/* Notifications (Wide area for 2 cards side-by-side) */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-purple-600 rounded-[2rem] p-6 text-white shadow-xl shadow-purple-200 flex flex-col justify-between transition hover:scale-[1.01] min-h-[240px]">
                         <div className="flex justify-between items-start">
                             <div>
                                 <p className="font-medium text-purple-200 mb-1">Incoming</p>
                                 <h3 className="text-4xl font-bold">18</h3>
                                 <p className="text-sm font-medium mt-1">Missed Calls</p>
                             </div>
                             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                 <Phone size={24} />
                             </div>
                         </div>
                         <button className="w-full py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition text-sm">Return Calls</button>
                     </div>

                     <div className="bg-white rounded-[2rem] p-6 text-gray-800 shadow-sm border border-gray-100 flex flex-col justify-between transition hover:scale-[1.01] min-h-[240px]">
                         <div className="flex justify-between items-start">
                             <div>
                                 <p className="font-medium text-gray-400 mb-1">Inbox</p>
                                 <h3 className="text-4xl font-bold text-purple-600">9</h3>
                                 <p className="text-sm font-medium text-gray-500 mt-1">New Messages</p>
                             </div>
                             <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
                                 <MessageSquare size={24} />
                             </div>
                         </div>
                         <button className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition text-sm">View Inbox</button>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorOverview;
