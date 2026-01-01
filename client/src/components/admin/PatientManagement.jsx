import React, { useState } from 'react';

const PatientManagement = () => {
    // Mock Data
    const [patients, setPatients] = useState([
        { id: 1, name: 'Alice Williams', age: 32, gender: 'Female', lastVisit: '2023-10-15', status: 'Active' },
        { id: 2, name: 'Robert Fox', age: 45, gender: 'Male', lastVisit: '2023-10-12', status: 'Active' },
        { id: 3, name: 'Jane Doe', age: 28, gender: 'Female', lastVisit: '2023-09-28', status: 'Blocked' },
        { id: 4, name: 'John Smith', age: 52, gender: 'Male', lastVisit: '2023-10-10', status: 'Active' },
    ]);

    const handleBlock = (id) => {
        setPatients(patients.map(p => 
            p.id === id ? { ...p, status: p.status === 'Active' ? 'Blocked' : 'Active' } : p
        ));
    };

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">Manage Patients</h3>
                <div className="flex gap-2">
                     <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Total: {patients.length}</span>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Demographics</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Last Visit</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {patients.map(patient => (
                        <tr key={patient.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-8 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img 
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" 
                                            src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(patient.name)}`} 
                                            alt="" 
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-bold text-gray-800">{patient.name}</div>
                                        <div className="text-xs text-gray-400">ID: #PT-{patient.id}00</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-600">{patient.age} yrs, {patient.gender}</span>
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{patient.lastVisit}</td>
                            <td className="px-8 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                    patient.status === 'Active' ? 'bg-green-50 text-green-500 ring-1 ring-green-100' : 'bg-red-50 text-red-500 ring-1 ring-red-100'
                                }`}>
                                    {patient.status}
                                </span>
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                    onClick={() => handleBlock(patient.id)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                        patient.status === 'Active' 
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:shadow-red-100' 
                                        : 'bg-green-50 text-green-500 hover:bg-green-100 hover:shadow-green-100'
                                    }`}
                                >
                                    {patient.status === 'Active' ? 'Block' : 'Unblock'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientManagement;
