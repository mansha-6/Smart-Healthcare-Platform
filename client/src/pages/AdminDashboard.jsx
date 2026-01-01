import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../components/admin/AdminSidebar';
import HospitalDashboard from '../components/admin/HospitalDashboard';
import MedicalDashboard from '../components/admin/MedicalDashboard'; // Import
import AccountsDashboard from '../components/admin/AccountsDashboard';
import DoctorManagement from '../components/admin/DoctorManagement';
import PatientManagement from '../components/admin/PatientManagement';
import StaffManagement from '../components/admin/StaffManagement';
import AdminAppointments from '../components/admin/AdminAppointments';
import AdminDepartments from '../components/admin/AdminDepartments';
import ReportsPanel from '../components/admin/ReportsPanel';
import { Home } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('hospital_dashboard');

  const renderContent = () => {
      switch (activeTab) {
          case 'hospital_dashboard': return <HospitalDashboard />;
          case 'medical_dashboard': return <MedicalDashboard />; // New Route
          case 'accounts': return <AccountsDashboard />; // Accounts Route
          case 'doctors': return <DoctorManagement />;
          case 'patients': return <PatientManagement />;
          case 'staff': return <StaffManagement />;
          case 'appointments': return <AdminAppointments />;
          case 'departments': return <AdminDepartments />;
          case 'reports': return <ReportsPanel />;
          default: return <HospitalDashboard />;
      }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-gray-50 to-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 p-8 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Home size={16} />
                <span>Home</span>
                <span>›</span>
                <span className="text-blue-500 font-medium">Dashboard</span>
            </div>

            <div className="flex items-center gap-4 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                <div className="flex">
                    {['Today', '7d', '2w', '1m', '3m', '6m', '1y'].map((range) => (
                        <button 
                            key={range}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                range === 'Today' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <button onClick={logout} className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-md text-xs font-bold transition-colors">
                    Logout
                </button>
            </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
