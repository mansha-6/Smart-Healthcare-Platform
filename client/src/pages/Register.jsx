import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { User, Stethoscope, Shield, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', 
    role: 'patient',
    phone: '',
    gender: '', // New Field
    age: '',    // New Field
    specialization: '', 
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const setRole = (role) => setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration Failed';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[650px]">
        
        {/* Left Panel - Doctor & Stats (Identical to Login) */}
         <div className="hidden lg:flex w-5/12 bg-blue-50 relative flex-col justify-end p-8 overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg')] opacity-10 bg-cover"></div>
             
             {/* Text Content */}
             <div className="absolute top-12 left-12 z-10">
                 <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                     Protect Yourself and Your Family — <br/>
                     Easy Online Appointments.
                 </h2>
                 <div className="text-blue-500 text-4xl absolute -top-4 -right-12">✲</div>
                 <div className="text-blue-500 text-2xl absolute bottom-0 left-0">✲</div>
             </div>

             {/* Doctor Image Container */}
             <div className="relative z-0 mt-auto flex justify-center">
                 <img 
                    src="https://img.freepik.com/free-photo/doctor-offering-medical-advice_23-2148816153.jpg?w=740" 
                    alt="Doctor" 
                    className="h-[400px] object-cover object-top drop-shadow-2xl z-10 masked-image"
                    style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                    onError={(e) => {e.target.src='https://placehold.co/400x500/1976D2/FFFFFF?text=Doctor+Image'}}
                 />
                 
                 <div className="absolute left-0 bottom-32 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 z-20 animate-bounce-slow">
                     <div className="bg-blue-100 p-2 rounded-full text-blue-600">💉</div>
                     <div>
                         <p className="text-xs text-gray-500 font-medium">Vaccines Administered</p>
                         <p className="text-sm font-bold text-gray-900">5.7 Million+</p>
                     </div>
                 </div>

                 <div className="absolute right-0 bottom-12 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 z-20">
                     <div className="bg-green-100 p-2 rounded-full text-green-600">🛡️</div>
                     <div>
                         <p className="text-xs text-gray-500 font-medium">Recovery Rate</p>
                         <p className="text-sm font-bold text-gray-900">98%</p>
                     </div>
                 </div>
             </div>
             
             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-3/5 bg-blue-500 rounded-t-full opacity-100 z-[-1]"></div>
        </div>


        {/* Right Panel - Form */}
        <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            
            {/* Logo Area */}
             <div className="mb-4 font-bold text-2xl flex items-center gap-2 text-blue-600">
                <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center">✚</div>
                MyHHub
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 max-w-md mx-auto w-full">
                <button 
                     className="flex-1 py-2 text-sm font-bold text-blue-600 bg-white shadow-sm rounded-lg transition-all capitalize"
                >
                    New {formData.role}
                </button>
                <button 
                     onClick={() => navigate('/login')}
                     className="flex-1 py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900 transition-colors capitalize"
                >
                    Existing {formData.role}
                </button>
            </div>

            <div className="max-w-md mx-auto w-full">
                
                {/* Role Tabs (Secondary) */}
                <div className="flex justify-center gap-2 mb-6">
                    {['patient', 'doctor', 'admin'].map((r) => (
                        <button 
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${formData.role === r ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join as a {formData.role} to get started</p>
                </div>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                            placeholder="Full Name"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                            placeholder="Email Address"
                            onChange={handleChange}
                        />
                    </div>
                    
                    {formData.role === 'patient' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <input
                                name="phone"
                                type="tel"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                placeholder="Phone"
                                onChange={handleChange}
                              />
                        </div>
                         <div>
                             <input
                                name="age"
                                type="number"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                placeholder="Age"
                                onChange={handleChange}
                              />
                        </div>
                    </div>
                    )}
                    
                    {formData.role === 'patient' && (
                        <div>
                             <select
                                name="gender"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-500"
                                onChange={handleChange}
                                defaultValue=""
                              >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                        </div>
                    )}

                    <div>
                         <div className="relative">
                             <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                     <div>
                         <div className="relative">
                             <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                    <Button type="submit" className="w-full py-4 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all mt-4">
                        Register
                    </Button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
