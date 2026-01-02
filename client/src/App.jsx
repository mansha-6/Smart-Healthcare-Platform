import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DoctorList from './pages/DoctorList';
import DoctorProfile from './pages/DoctorProfile.jsx';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Login from './pages/Login'; // Will need to implement
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register'; // Will need to implement

// Quick placeholders for Login/Register if not explicitly asked yet, 
// but sticking to user's "Complete Feature List" implies these should exist.
// For now, I'll use placeholders to ensure the build doesn't fail if I haven't made them yet.
// However, I should make them if I want a "Full Project".
// Let's create simple versions in the same step if possible, or just stub them.
// I'll stick to stubs in this file, but separate files for real implementation.

const LoginPlaceholder = () => <div className="p-10 text-center">Login Page (Coming Soon)</div>;
const RegisterPlaceholder = () => <div className="p-10 text-center">Register Page (Coming Soon)</div>;

import ToastProvider from './components/ui/ToastProvider';

import Teleconsult from './pages/Teleconsult';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/dashboard/*" element={<PatientDashboard />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Shared Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor']} />}>
              <Route path="/teleconsult" element={<Teleconsult />} />
            </Route>
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
