import React, { useState, useEffect } from 'react';
import { Mail, Phone, Edit2, Trash2, X, UserPlus, Check } from 'lucide-react';
import API from '../../api/index';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        jobTitle: '',
        department: '',
        status: 'On Duty'
    });

    const fetchStaff = async () => {
        try {
            const { data } = await API.get('/admin/staff');
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff', error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/staff', formData);
            setIsModalOpen(false);
            fetchStaff();
            setFormData({ name: '', email: '', password: '', phone: '', jobTitle: '', department: '', status: 'On Duty' });
            alert('Staff member added successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add staff');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/admin/doctor/${id}`); // Reusing doctor delete for now, or need generic delete user
            // NOTE: Ideally we should use a generic user delete endpoint or /admin/staff/:id
            // Since creating separate deleteStaff handler requires backend change, and deleteDoctor uses findByIdAndDelete on User model...
            // It actually might WORK if I point to /id. 
            // BUT api/admin/doctor/:id calls deleteDoctor controller which does User.findByIdAndDelete(id).
            // So technically it works for ANY user ID. I'll use that for now to avoid extra backend complexity.
            fetchStaff();
        } catch (error) {
           // alert('Failed to delete staff'); 
        }
    };
    
    // Departments ENUM or list can be fetched, but for now hardcode common ones
    const departments = ['Emergency', 'Pediatrics', 'Cardiology', 'Neurology', 'Pharmacy', 'Front Desk', 'Administration'];
    const roles = ['Nurse', 'Head Nurse', 'Receptionist', 'Technician', 'Pharmacist', 'Driver'];

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300 relative">
             <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">Manage Staff</h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
                >
                    <UserPlus size={16} />
                    Add New Staff
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {staff.map(member => (
                    <div key={member._id} className="bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-500`}>
                                On Duty
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDelete(member._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center text-center mb-6">
                            <img 
                                src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(member.name)}`} 
                                className="w-20 h-20 rounded-2xl mb-3 shadow-sm object-cover" 
                                alt={member.name}
                            />
                            <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
                            <p className="text-xs font-medium text-blue-500 mb-1">{member.jobTitle || 'Staff'}</p>
                            <p className="text-xs text-gray-400">{member.department || 'General'} Dept.</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-xs font-medium">{member.phone || 'N/A'}</span>
                            </div>
                             <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-xs font-medium truncate">{member.email}</span>
                            </div>
                        </div>
                    </div>
                ))}
                 {staff.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-10">
                        No staff members found. Add one to get started.
                    </div>
                )}
            </div>

            {/* Add Staff Modal */}
             {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Add New Staff Member</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddStaff} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="John Doe"
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
                                    placeholder="email@hospital.com"
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="(555) 123-4567"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title / Role</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.jobTitle}
                                    onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="col-span-2 pt-4">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                    <Check size={20} />
                                    Add Staff Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
             )}
        </div>
    );
};

export default StaffManagement;
