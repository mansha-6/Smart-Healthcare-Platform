import React from 'react';
import { Eye, Stethoscope, User, ArrowRight, BedDouble, Users, Calendar, Activity } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, subLabel, color }) => (
    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
                <Icon size={24} className="text-current" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
            <p className="text-gray-500 font-medium text-sm">{label}</p>
        </div>
        {subLabel && (
            <div className="self-end mb-1">
                 <span className="text-xs font-bold text-orange-400 bg-orange-50 px-2 py-1 rounded-full">{subLabel}</span>
            </div>
        )}
    </div>
);

const SmallStatCard = ({ icon: Icon, value, label, color }) => (
     <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${color} text-white`}>
            <Icon size={18} />
        </div>
        <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
        <h4 className="text-xl font-bold text-blue-600">{value}</h4>
    </div>
);


const HospitalDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-xl shadow-blue-200">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-blue-100 text-lg mb-2">Good Morning,</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Dr. Patrick Kim</h1>
                    <p className="text-blue-100 mb-8 opacity-90">Your schedule today.</p>

                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 min-w-[140px]">
                            <div className="bg-cyan-400 p-2 rounded-lg">
                                <Eye size={20} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">9</h4>
                                <p className="text-xs text-blue-100">Patients</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 min-w-[140px]">
                            <div className="bg-emerald-500 p-2 rounded-lg">
                                <Stethoscope size={20} className="text-white" />
                            </div>
                             <div>
                                <h4 className="text-2xl font-bold">3</h4>
                                <p className="text-xs text-blue-100">Surgeries</p>
                            </div>
                        </div>
                         <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 min-w-[140px]">
                            <div className="bg-orange-400 p-2 rounded-lg">
                                <User size={20} className="text-white" />
                            </div>
                             <div>
                                <h4 className="text-2xl font-bold">2</h4>
                                <p className="text-xs text-blue-100">Discharges</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Illustration - Right Side */}
                <div className="absolute right-0 bottom-0 md:h-[120%] h-64 w-1/2 flex items-end justify-end pointer-events-none">
                     <img 
                        src="/assets/admin_hero_illustration.png" 
                        alt="Medical Team"
                        className="object-contain h-full object-bottom opacity-100" 
                     />
                </div>
                
                {/* Decorative Background Elements */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute left-1/2 bottom-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={User} 
                    value="890" 
                    label="New Patients" 
                    subLabel="+40%" 
                    color="bg-green-50 text-green-500"
                />
                <StatCard 
                    icon={Stethoscope} 
                    value="360" 
                    label="OPD Patients" 
                    subLabel="+30%" 
                     color="bg-blue-50 text-blue-500"
                />
                 <StatCard 
                    icon={Activity} 
                    value="980" 
                    label="Lab tests" 
                    subLabel="+60%" 
                     color="bg-red-50 text-red-500"
                />
                 <StatCard 
                    icon={ArrowRight} // Dollar icon typically
                    value="$98000" 
                    label="Total Earnings" 
                    subLabel="+20%" 
                     color="bg-amber-50 text-amber-500"
                />
            </div>

             {/* Secondary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <SmallStatCard icon={Calendar} value="639" label="Appointments" color="bg-blue-500" />
                <SmallStatCard icon={Stethoscope} value="83" label="Doctors" color="bg-blue-600" />
                <SmallStatCard icon={Users} value="296" label="Staff" color="bg-blue-500" />
                 <SmallStatCard icon={Activity} value="49" label="Operations" color="bg-blue-600" />
                 <SmallStatCard icon={BedDouble} value="372" label="Admitted" color="bg-blue-500" />
                  <SmallStatCard icon={User} value="253" label="Discharged" color="bg-blue-600" />
            </div>
        </div>
    );
};

export default HospitalDashboard;
