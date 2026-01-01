import React, { useEffect, useState } from 'react';
import API from '../../api/index';
import { X, Check, UserPlus } from 'lucide-react';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        fees: '',
        phone: ''
    });
    
    const fetchDocs = async () => {
        try {
            const { data } = await API.get('/doctor/list');
            setDoctors(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this doctor?')) return;
        try {
            await API.delete(`/admin/doctor/${id}`);
            fetchDocs(); // Refresh
        } catch (error) {
            alert('Failed to delete doctor');
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/doctor', formData);
            setIsModalOpen(false);
            fetchDocs();
            setFormData({ name: '', email: '', password: '', specialization: '', experience: '', fees: '', phone: '' });
            alert('Doctor added successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add doctor');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Manage Doctors</h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                >
                    <UserPlus size={16} />
                    Add Doctor
                </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map(doc => (
                        <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img 
                                            className="h-10 w-10 rounded-full object-cover border border-gray-100" 
                                            src={doc.image || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(doc.name)}`} 
                                            alt="" 
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                        <div className="text-xs text-gray-500">{doc.experience ? `${doc.experience} years exp.` : 'Senior Doctor'}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {doc.specialization || 'General'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button onClick={() => handleDelete(doc._id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Doctor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Add New Doctor</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddDoctor} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="Dr. John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input 
                                    required
                                    type="email" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="doctor@hospital.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <input 
                                    required
                                    type="password" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. Cardiology"
                                    value={formData.specialization}
                                    onChange={e => setFormData({...formData, specialization: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. 10"
                                    value={formData.experience}
                                    onChange={e => setFormData({...formData, experience: e.target.value})}
                                />
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Consultation Fees ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. 150"
                                    value={formData.fees}
                                    onChange={e => setFormData({...formData, fees: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 pt-4">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                    <Check size={20} />
                                    Add Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;
