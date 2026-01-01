import React from 'react';
import { Users, Stethoscope, UserCheck, Calendar, Phone, MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';

const TopCard = ({ icon, value, label, color }) => (
    <div className="bg-white p-6 rounded-[24px] flex flex-col items-center justify-center text-center shadow-sm border border-gray-50 hover:shadow-md transition-all">
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4 overflow-hidden`}>
            {/* Display generated illustration if available, else fallback */}
            <img src={icon} alt={label} className="w-10 h-10 object-contain" />
        </div>
        <p className="text-gray-400 font-medium text-sm mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
);

const AppointmentItem = ({ name, type, time, fee, image, color }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
        <div className="flex items-center gap-3">
            <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
            <div>
                <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
                <p className="text-xs text-gray-500 font-medium">{type}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs text-gray-400">{time}</p>
                <p className="text-sm font-bold text-gray-800">${fee}</p>
            </div>
             <button className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white`}>
                <Phone size={14} />
            </button>
             <button className="text-gray-300">
                <MoreHorizontal size={16} />
            </button>
        </div>
    </div>
);


const MedicalDashboard = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
            {/* Left Column (Main Stats) */}
            <div className="flex-1 space-y-6">
                {/* Top Row Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <TopCard icon="/assets/icon_patients.png" value="1,548" label="Total Patients" color="bg-cyan-100" />
                    <TopCard icon="/assets/icon_consultation.png" value="448" label="Consulation" color="bg-pink-100" />
                    <TopCard icon="/assets/icon_staff.png" value="848" label="Staff" color="bg-orange-100" />
                    <TopCard icon="/assets/icon_room.png" value="3,100" label="Total Rooms" color="bg-cyan-100" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Report */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Daily Revenue Report</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mb-6">
                            <h2 className="text-3xl font-bold text-teal-400">$32,485</h2>
                            <span className="text-gray-400 text-sm">$12,458</span>
                        </div>
                        {/* CSS Bar Chart */}
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                             {[
                                 [60, 40], [70, 50], [90, 60], [80, 55], [75, 58], [95, 60], [85, 65]
                             ].map((pair, i) => (
                                 <div key={i} className="flex gap-1 items-end h-full w-full justify-center">
                                      <div className="w-2 bg-cyan-400 rounded-t-full" style={{ height: `${pair[0]}%` }}></div>
                                      <div className="w-2 bg-blue-600 rounded-t-full" style={{ height: `${pair[1]}%` }}></div>
                                 </div>
                             ))}
                        </div>
                        <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-gray-400">
                             <div className="flex items-center gap-2">
                                 <span className="w-2 h-2 bg-cyan-400 rounded-full"></span> Income
                             </div>
                              <div className="flex items-center gap-2">
                                 <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Expense
                             </div>
                        </div>
                    </div>

                    {/* Payments History */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Payments history</h3>
                         <div className="space-y-6">
                            {[
                                { title: "Kidney function test", doctor: "Dr. Johen Doe", price: "25.15", date: "Sunday, 16 May" },
                                { title: "Emergency appointment", doctor: "Dr. Michael Doe", price: "99.15", date: "Sunday, 16 May" },
                                { title: "Complementation test", doctor: "Dr. Bertie Maxwell", price: "40.45", date: "Sunday, 16 May" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="flex gap-4">
                                        <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                            <Stethoscope size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">{item.doctor}</p>
                                            <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">$ {item.price}</p>
                                        <MoreHorizontal className="ml-auto mt-2 text-gray-300" size={16} />
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Doctor List */}
                   <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-lg font-bold text-gray-800">Doctor List</h3>
                             <span className="text-sm text-gray-400">Today</span>
                        </div>
                        <div className="space-y-4">
                             {[
                                { name: "Dr. Jaylon Stanton", role: "Dentist", img: "https://ui-avatars.com/api/?background=random&name=Dr+Jaylon" },
                                { name: "Dr. Carla Schleifer", role: "Oculist", img: "https://ui-avatars.com/api/?background=random&name=Dr+Carla" },
                                { name: "Dr. Hanna Geidt", role: "Surgeon", img: "https://ui-avatars.com/api/?background=random&name=Dr+Hanna" },
                             ].map((doc, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                     <img src={doc.img} className="w-10 h-10 rounded-xl bg-gray-100" />
                                     <div>
                                         <h4 className="font-bold text-gray-800 text-sm">{doc.name}</h4>
                                         <p className="text-xs text-gray-500">{doc.role}</p>
                                     </div>
                                     <MoreHorizontal className="ml-auto text-blue-300" size={16} />
                                 </div>
                             ))}
                        </div>
                   </div>

                    {/* Balance */}
                   <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                       <h3 className="text-lg font-bold text-gray-800 mb-6">Balance</h3>
                       <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500">
                                         <ArrowUp size={20} />
                                     </div>
                                     <div>
                                         <p className="text-xs text-gray-400">Income</p>
                                         <h4 className="text-xl font-bold text-gray-800">$142K</h4>
                                     </div>
                                </div>
                                <div className="h-10 w-24">
                                     {/* Simple Sparkline SVG */}
                                     <svg viewBox="0 0 100 40" className="w-full h-full">
                                         <path d="M0 40 Q 25 10, 50 30 T 100 20 L 100 40 L 0 40 Z" fill="#CFFAFE" />
                                         <path d="M0 40 Q 25 10, 50 30 T 100 20" fill="none" stroke="#22D3EE" strokeWidth="2" />
                                     </svg>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                                         <ArrowDown size={20} />
                                     </div>
                                     <div>
                                         <p className="text-xs text-gray-400">Outcome</p>
                                         <h4 className="text-xl font-bold text-gray-800">$43K</h4>
                                     </div>
                                </div>
                                <div className="h-10 w-24">
                                    <svg viewBox="0 0 100 40" className="w-full h-full">
                                         <path d="M0 40 Q 25 5, 50 20 T 100 35 L 100 40 L 0 40 Z" fill="#FCE7F3" />
                                         <path d="M0 40 Q 25 5, 50 20 T 100 35" fill="none" stroke="#F472B6" strokeWidth="2" />
                                     </svg>
                                </div>
                            </div>
                       </div>
                   </div>
                </div>

            </div>

             {/* Right Column (Sidebar-ish) */}
             <div className="w-full lg:w-80 space-y-6">
                 {/* Upcoming Appointments */}
                 <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                     <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Appointments</h3>
                     
                     {/* Calendar Widget Placeholder */}
                     <div className="bg-teal-400 rounded-2xl p-4 text-white mb-6 flex justify-between items-center shadow-lg shadow-teal-100">
                         <div className="text-center">
                            <span className="text-xs opacity-80 block">Mon</span>
                            <span className="font-bold">2nd</span>
                         </div>
                         <div className="text-center">
                            <span className="text-xs opacity-80 block">Tue</span>
                            <span className="font-bold">3rd</span>
                         </div>
                         <div className="bg-white/20 p-2 rounded-xl text-center px-4 backdrop-blur-sm border border-white/30">
                            <span className="text-xs font-bold block">Wednesday</span>
                            <span className="text-sm font-bold block">May 4th 2022</span>
                         </div>
                         <div className="text-center">
                            <span className="text-xs opacity-80 block">Thu</span>
                            <span className="font-bold">5th</span>
                         </div>
                     </div>

                     <div className="space-y-1">
                        <AppointmentItem 
                             name="Shawn Hampton" 
                             type="Emergency appointment" 
                             time="10:00" foo="$ 30"
                             image="https://ui-avatars.com/api/?background=cffafe&color=0891b2&name=Shawn+Hampton" 
                             color="bg-cyan-400"
                             fee="30"
                        />
                        <AppointmentItem 
                             name="Polly Paul" 
                             type="USG + Consultation" 
                             time="10:30" 
                             image="https://ui-avatars.com/api/?background=fce7f3&color=be185d&name=Polly+Paul" 
                             color="bg-cyan-400"
                             fee="50"
                        />
                         <AppointmentItem 
                             name="Johen Doe" 
                             type="Laboratory screening" 
                             time="11:00" 
                             image="https://ui-avatars.com/api/?background=e0e7ff&color=4338ca&name=Johen+Doe" 
                             color="bg-cyan-400"
                             fee="70"
                        />
                     </div>
                 </div>
                 
                 {/* Appointments Overview (Pie Chart) */}
                 <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-6">Appointments Overview</h3>
                      <div className="flex flex-col items-center">
                          {/* Simple CSS Pie Chart */}
                          <div className="w-40 h-40 rounded-full relative overflow-hidden" 
                             style={{
                                 background: `conic-gradient(
                                    #3B82F6 0deg 90deg, 
                                    #EF4444 90deg 180deg,
                                    #06B6D4 180deg 270deg,
                                    #EAB308 270deg 360deg
                                 )`
                             }}
                          >
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-6 w-full text-xs font-medium text-gray-500">
                               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Male</div>
                               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Female</div>
                               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Child</div>
                               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Other</div>
                          </div>
                      </div>
                 </div>
             </div>
        </div>
    );
};

export default MedicalDashboard;
