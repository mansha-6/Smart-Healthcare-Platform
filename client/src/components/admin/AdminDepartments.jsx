import React, { useState, useEffect } from 'react';
import API from '../../api/index';
import { Building2, Users, ArrowRight, Activity, Heart, Brain, Bone, Eye, Baby, X, Check } from 'lucide-react';

const iconMap = {
    Heart, Brain, Bone, Eye, Baby, Activity, Building2
};

const DepartmentCard = ({ name, head, staffCount, icon, color, bg }) => {
    const Icon = iconMap[icon] || Building2;
    return (
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${bg} opacity-10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150`}></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                </div>
                <div className={`p-2 rounded-full ${bg} bg-opacity-10 text-gray-400 group-hover:bg-opacity-20 transition-colors`}>
                    <ArrowRight size={20} />
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
            <p className="text-sm text-gray-500 mb-6">Head: <span className="font-semibold text-gray-700">{head?.name || 'Vacant'}</span></p>
            
            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2 text-gray-500 rounded-lg bg-gray-50 px-3 py-1.5">
                     <Users size={16} />
                     <span className="text-xs font-bold">{staffCount} Staff</span>
                 </div>
                 <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        head: '',
        icon: 'Activity',
        staffCount: 10, // Default for now
        bg: 'bg-blue-600'
    });

    const fetchDepartments = async () => {
        try {
            const { data } = await API.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const { data } = await API.get('/doctor/list');
            setDoctors(data);
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/departments', formData);
            setIsModalOpen(false);
            fetchDepartments();
            setFormData({ name: '', head: '', icon: 'Activity', staffCount: 10, bg: 'bg-blue-600' });
        } catch (error) {
            alert('Failed to create department');
        }
    };

    return (
         <div className="animate-in fade-in duration-300 relative">
             <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-2xl font-bold text-gray-800">Departments</h3>
                    <p className="text-gray-500">Manage hospital departments and heads</p>
                 </div>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-all"
                 >
                     + Add Department
                 </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {departments.map((dept) => (
                     <DepartmentCard key={dept._id} {...dept} />
                 ))}
                 
                 {departments.length === 0 && (
                     <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed hover:border-blue-300 transition-colors">
                         <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                         <p>No departments found. Add one to get started.</p>
                     </div>
                 )}
             </div>

             {/* Add Department Modal */}
             {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Add New Department</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Department Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. Cardiology"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Head of Department</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-medium text-gray-600"
                                        value={formData.head}
                                        onChange={e => setFormData({...formData, head: e.target.value})}
                                    >
                                        <option value="">Select a Doctor</option>
                                        {doctors.map(doc => (
                                            <option key={doc._id} value={doc._id}>Dr. {doc.name} - {doc.specialization}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Select the doctor who will lead this department.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.icon}
                                        onChange={e => setFormData({...formData, icon: e.target.value})}
                                    >
                                        {Object.keys(iconMap).map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Theme Color</label>
                                    <select 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.bg}
                                        onChange={e => setFormData({...formData, bg: e.target.value})}
                                    >
                                        <option value="bg-blue-600">Blue</option>
                                        <option value="bg-rose-500">Rose</option>
                                        <option value="bg-indigo-500">Indigo</option>
                                        <option value="bg-emerald-500">Emerald</option>
                                        <option value="bg-amber-500">Amber</option>
                                        <option value="bg-cyan-500">Cyan</option>
                                        <option value="bg-purple-600">Purple</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                    <Check size={20} />
                                    Create Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
             )}
         </div>
    );
};

export default AdminDepartments;
