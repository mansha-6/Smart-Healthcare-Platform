import React from 'react';
import { LayoutDashboard, Stethoscope, Activity, Users, Calendar, Settings, CreditCard, Building2, Phone } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'hospital_dashboard', label: 'Hospital Dashboard', icon: LayoutDashboard },
        { id: 'medical_dashboard', label: 'Medical Dashboard', icon: Activity },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'staff', label: 'Staff', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'accounts', label: 'Accounts', icon: CreditCard },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20">
            {/* Profile Section */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-50">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                     <img 
                        src="https://avatar.iran.liara.run/public/girl" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                     />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800">Lulla Devi</h3>
                    <p className="text-xs text-gray-500">Dept Admin</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                                <span>{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Emergency Button */}
            <div className="p-4 mt-auto">
                <button className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white p-4 rounded-xl flex items-center gap-3 shadow-lg shadow-green-200 transition-transform active:scale-95">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Phone size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-medium text-green-100">Emergency Contact</p>
                        <p className="text-sm font-bold">0987654321</p>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
