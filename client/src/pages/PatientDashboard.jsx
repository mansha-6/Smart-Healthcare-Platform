import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';

// Components
import Sidebar from '../components/Patient/Sidebar';
import DashboardHeader from '../components/Patient/DashboardHeader';
import DashboardHome from '../components/Patient/DashboardHome';
import PatientAppointments from '../components/Patient/PatientAppointments';
import HealthOverview from '../components/Patient/Overview/HealthOverview';
import MyHealthRecords from '../components/Patient/MyHealthRecords';
import PatientHistory from '../components/Patient/PatientHistory';
import PatientFeedback from '../components/Patient/PatientFeedback';
import PatientProfile from '../components/Patient/PatientProfile';
import PatientPrescriptions from '../components/Patient/PatientPrescriptions';
import PatientSettings from './PatientSettings';
import ChatInterface from '../components/Chat/ChatInterface'; // Correct placement

const PatientDashboard = () => {
  const location = window.location;
  console.log('[DEBUG] PatientDashboard Location:', location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
        <DashboardHeader />
        
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="overview" element={<HealthOverview />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="reports" element={<MyHealthRecords />} />
            <Route path="history" element={<PatientHistory />} />
            <Route path="feedback" element={<PatientFeedback />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="settings" element={<PatientSettings />} />
            <Route path="messages" element={<ChatInterface role="patient" />} />
            <Route path="*" element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default PatientDashboard;
