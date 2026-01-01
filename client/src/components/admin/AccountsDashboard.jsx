import React from 'react';
import { 
    MessageSquare, Video, Phone, Shield, FileText, Folder, 
    MoreHorizontal, Calendar, Search, Bell, Menu, User
} from 'lucide-react';

// --- Sub-components for Widgets ---

const ChatWidget = () => (
    <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Real-Time Chat</h3>
            <Video className="text-blue-500 bg-blue-50 p-1.5 rounded-lg w-7 h-7" />
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 mb-3">
            <div className="relative">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Dr" className="w-8 h-8 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-semibold text-gray-800 leading-tight">I'm available for a video consultation.</p>
            </div>
        </div>
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm">
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Me" className="w-full h-full object-cover" />
            </div>
            <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-12 pr-8 text-xs focus:ring-1 focus:ring-blue-200 outline-none h-10 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 bg-white p-1 rounded-full shadow-sm">
                <MessageSquare size={14} />
            </button>
        </div>
    </div>
);

const ShortcutCard = ({ icon: Icon, label, color, bg }) => (
    <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={color} size={24} />
        </div>
        <p className="text-xs font-bold text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">{label}</p>
    </div>
);

const VideoConsultationStats = () => (
    <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-bold text-gray-800 text-sm">Video Consultation</h3>
            </div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Admissions breakdown</span>
        </div>
        
        <div className="flex items-end justify-between h-20 px-1 gap-3">
            {[
                { label: 'General', val: 35, color: 'bg-cyan-500' },
                { label: 'Pediatrics', val: 38, color: 'bg-indigo-400' },
                { label: 'Surgery', val: 55, color: 'bg-pink-300' },
                { label: 'Cardiology', val: 48, color: 'bg-cyan-500' },
                { label: 'Other', val: 45, color: 'bg-teal-300' },
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-full">
                    <div className={`w-10 rounded-t-lg ${item.color} opacity-90`} style={{ height: `${item.val * 1.2}px` }}></div>
                    <span className="text-[9px] font-bold text-gray-500 truncate w-full text-center">{item.label}</span>
                </div>
            ))}
        </div>
    </div>
);

const PatientTimeline = ({ title }) => (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6">{title}</h3>
        <div className="space-y-6 relative">
             {/* Vertical Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

            <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-[3px] border-cyan-400 bg-white z-10"></div>
                <h4 className="text-sm font-bold text-gray-800">Admission to general ward</h4>
                <p className="text-xs text-blue-400 font-medium mt-0.5">Jun 8 • 08:45 PM</p>
            </div>
            <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-[3px] border-cyan-400 bg-white z-10"></div>
                <h4 className="text-sm font-bold text-gray-800">X-ray completed</h4>
                <p className="text-xs text-gray-400 mt-0.5">Jun 5 • 08:20 AM</p>
            </div>
             <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-[3px] border-pink-300 bg-white z-10"></div>
                <h4 className="text-sm font-bold text-gray-800">Discharged</h4>
                <p className="text-xs text-gray-400 mt-0.5">Jun 5 • 02:30 PM</p>
            </div>
        </div>
    </div>
);

const DoctorProfileCard = () => (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800 text-left">David Williams</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
             <img src="https://i.pravatar.cc/300?u=david_williams" className="w-20 h-20 rounded-2xl object-cover bg-gray-100" alt="Doctor" />
             <div className="text-left">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Doctor of the Month</p>
                 <div className="flex items-center gap-1">
                     <div className="w-8 h-8 rounded-lg bg-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-100">
                         <User size={16} />
                     </div>
                 </div>
             </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">DEC</span>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">FEB</span>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">MAR</span>
        </div>
    </div>
);

const BillingInsights = () => (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <h3 className="font-bold text-gray-800 mb-2">Billing Insights</h3>
        
        <div className="flex items-center justify-center py-4">
             {/* CSS Donut Chart */}
            <div className="relative w-32 h-32 rounded-full shadow-inner" 
                style={{
                    background: `conic-gradient(
                        #22D3EE 0deg 230deg, 
                        #F9A8D4 230deg 310deg,
                        #94A3B8 310deg 360deg
                    )`
                }}
            >
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-bold text-gray-800">65%</span>
                    <span className="text-[10px] text-gray-400 uppercase">Total</span>
                </div>
            </div>
        </div>

        <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs p-2 hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-400"></span> <span className="text-gray-600 font-medium">Paid</span>
                 </div>
                 <span className="font-bold text-gray-400">66%</span>
            </div>
            <div className="flex justify-between items-center text-xs p-2 hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-pink-300"></span> <span className="text-gray-600 font-medium">Pending</span>
                 </div>
                 <span className="font-bold text-gray-400">22%</span>
            </div>
             <div className="flex justify-between items-center text-xs p-2 hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-gray-400"></span> <span className="text-gray-600 font-medium">Overdue</span>
                 </div>
                 <span className="font-bold text-gray-400">13%</span>
            </div>
        </div>
    </div>
);

const DoctorDirectory = () => (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
            Doctor Directory
            <button className="text-blue-500 text-xs font-bold hover:underline">View All</button>
        </h3>
        <div className="space-y-4">
            {[
                { name: 'Dr. Sarah Jones', spec: 'Neurology', phone: '(555) 1234', img: 'https://ui-avatars.com/api/?name=Sarah+Jones&background=random' },
                { name: 'Dr. John Smith', spec: 'Cardiology', phone: '(555) 2345', img: 'https://ui-avatars.com/api/?name=John+Smith&background=random' },
                { name: 'Dr. Emily Brown', spec: 'Orthopedics', phone: '(535) 3458', img: 'https://ui-avatars.com/api/?name=Emily+Brown&background=random' },
            ].map((doc, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                        <img src={doc.img} alt={doc.name} className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                        <div>
                            <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                            <p className="text-[10px] text-gray-400">{doc.spec}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">{doc.phone}</span>
                </div>
            ))}
        </div>
    </div>
);

const MoneyTransfer = () => (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
         <h3 className="font-bold text-gray-800 mb-4 text-sm">Quick Transfer</h3>
         <div className="flex items-center gap-4 mb-4">
             <div className="flex -space-x-2 overflow-hidden">
                 {[1,2,3].map(i => (
                     <img key={i} src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt=""/>
                 ))}
                 <button className="h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-gray-500 text-xs font-bold">+</button>
             </div>
             <div className="flex-1 text-right">
                 <span className="text-[10px] text-gray-400 font-bold uppercase block">Balance</span>
                 <span className="text-sm font-bold text-gray-800">$14,250</span>
             </div>
         </div>
         
         <div className="flex gap-2">
             <div className="relative flex-1">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                 <input type="number" className="w-full bg-gray-50 rounded-xl py-2 pl-6 pr-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-200" placeholder="0.00" />
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue-200">
                 Send
             </button>
         </div>
    </div>
);

const AccountsDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Column 1 */}
            <div className="space-y-6">
                <ChatWidget />
                
                <div className="grid grid-cols-2 gap-4">
                    <ShortcutCard icon={Bell} label="Emergency Assistance" bg="bg-red-50" color="text-red-400" />
                    <ShortcutCard icon={Shield} label="Personal Vault" bg="bg-cyan-50" color="text-cyan-500" />
                    <ShortcutCard icon={Folder} label="Patient Directory" bg="bg-amber-50" color="text-amber-400" />
                    <ShortcutCard icon={FileText} label="Prescription Manager" bg="bg-indigo-50" color="text-indigo-400" />
                </div>

                <PatientTimeline title="Recent Activity" />
            </div>


            {/* Column 2 */}
            <div className="space-y-6">
                <VideoConsultationStats />
                <DoctorDirectory />
                <MoneyTransfer />
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
                <DoctorProfileCard />
                <BillingInsights />
                <PatientTimeline title="Patient History Timeline" />
            </div>
        </div>
    );
};

export default AccountsDashboard;
