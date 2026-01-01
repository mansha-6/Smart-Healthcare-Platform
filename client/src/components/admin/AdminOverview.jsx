import React, { useEffect, useState } from 'react';
import API from '../../api/index';

const AdminOverview = () => {
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, reports: 0 });

    useEffect(() => {
    // Fetch stats
    const getStats = async () => {
        try {
            const { data } = await API.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };
        getStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <h4 className="text-gray-500 text-sm uppercase">Total Doctors</h4>
                <p className="text-2xl font-bold">{stats.doctors}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <h4 className="text-gray-500 text-sm uppercase">Total Patients</h4>
                <p className="text-2xl font-bold">{stats.patients}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                <h4 className="text-gray-500 text-sm uppercase">Total Appointments</h4>
                <p className="text-2xl font-bold">{stats.appointments}</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                <h4 className="text-gray-500 text-sm uppercase">Total Reports</h4>
                <p className="text-2xl font-bold">{stats.reports}</p>
            </div>
        </div>
    );
};

export default AdminOverview;
