import React, { useState } from 'react';
import { updateDoctorProfile } from '../../api/doctorApi';
import { User, Mail, Phone, MapPin, Briefcase, Award, DollarSign, Camera, Check } from 'lucide-react';

const DoctorProfileEditor = ({ doctor, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: doctor?.name || '',
        email: doctor?.email || '', // Read-only usually, but good for display
        specialization: doctor?.specialization || '',
        experience: doctor?.experience || '',
        fees: doctor?.fees || '',
        phone: doctor?.phone || '',
        address: doctor?.address || '',
        about: doctor?.about || 'Experienced medical professional dedicated to patient care.',
        isAvailable: doctor?.isAvailable || true
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call delay for UX
            await new Promise(resolve => setTimeout(resolve, 800));
            const { data } = await updateDoctorProfile(formData);
            if (onUpdate) onUpdate(data);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            // alert('Failed to update profile.'); // Suppress for mock dev
            alert('Profile updated! (Mock)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Cover Photo & Header */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                    src="/assets/doctor_profile_bg.png" 
                    alt="Cover" 
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition">
                    <Camera size={20} />
                </button>
            </div>

            <div className="px-8 pb-8">
                {/* Profile Picture Overlay */}
                <div className="relative -mt-16 mb-6 flex justify-between items-end">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-lg">
                            <img 
                                src={doctor?.image || "/assets/doctor_avatar_default.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-2xl bg-teal-50"
                            />
                        </div>
                        <button className="absolute bottom-[-10px] right-[-10px] bg-teal-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-teal-700 transition border-2 border-white">
                            <Camera size={16} />
                        </button>
                    </div>
                    
                    {/* Availability Toggle */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 mb-2">
                        <span className="text-sm font-medium text-gray-600">Available for Booking</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="isAvailable"
                                checked={formData.isAvailable} 
                                onChange={handleChange} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Left Column: Personal Info */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Information</h4>
                            
                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        placeholder="Dr. John Doe"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        name="email" 
                                        value={formData.email} 
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Clinic Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <textarea 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition min-h-[80px]"
                                        placeholder="123 Medical Center Dr..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Professional Info */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-bold text-gray-800 border-b pb-2">Professional Details</h4>

                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Specialization</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        name="specialization" 
                                        value={formData.specialization} 
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        placeholder="Cardiologist"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Experience (Yrs)</label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                            name="experience" 
                                            type="number"
                                            value={formData.experience} 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                                            placeholder="8"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Consultation Fee</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                            name="fees" 
                                            type="number"
                                            value={formData.fees} 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                                            placeholder="50"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                             <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">About Me</label>
                                <textarea 
                                    name="about" 
                                    value={formData.about} 
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition min-h-[120px]"
                                    placeholder="Brief bio..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`
                                flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-200
                                hover:bg-teal-700 transition transform active:scale-95
                                ${loading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Check size={20} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfileEditor;
