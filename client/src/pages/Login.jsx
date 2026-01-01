import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // Visual only for Login
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      login(data.user, data.token);
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Login Invalid. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/50 flex items-center justify-center p-4 font-sans">
       <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[650px]">
        
        {/* Left Panel - Doctor & Stats */}
        <div className="hidden lg:flex w-5/12 bg-blue-50 relative flex-col justify-end p-8 overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg')] opacity-10 bg-cover"></div>
             
             {/* Text Content */}
             <div className="absolute top-12 left-12 z-10">
                 <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                     Protect Yourself and Your Family — <br/>
                     Easy Online Appointments.
                 </h2>
                 {/* Decorative Stars */}
                 <div className="text-blue-500 text-4xl absolute -top-4 -right-12">✲</div>
                 <div className="text-blue-500 text-2xl absolute bottom-0 left-0">✲</div>
             </div>

             {/* Doctor Image Container */}
             <div className="relative z-0 mt-auto flex justify-center">
                 {/* Placeholder for Doctor Image - Using a professional cut out style if possible, or a nice image */}
                 <img 
                    src="https://img.freepik.com/free-photo/doctor-offering-medical-advice_23-2148816153.jpg?w=740&t=st=1708450000~exp=1708450600~hmac=example" 
                    alt="Doctor" 
                    className="h-[400px] object-cover object-top drop-shadow-2xl z-10 masked-image"
                    style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                    onError={(e) => {e.target.src='https://placehold.co/400x500/1976D2/FFFFFF?text=Doctor+Image'}}
                 />
                 
                 {/* Floating Stats Cards */}
                 <div className="absolute left-0 bottom-32 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 z-20 animate-bounce-slow">
                     <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                         💉
                     </div>
                     <div>
                         <p className="text-xs text-gray-500 font-medium">Vaccines Administered</p>
                         <p className="text-sm font-bold text-gray-900">5.7 Million+</p>
                     </div>
                 </div>

                 <div className="absolute right-0 bottom-12 bg-white p-3 rounded-xl shadow-lg flex items-center gap-3 z-20">
                     <div className="bg-green-100 p-2 rounded-full text-green-600">
                         🛡️
                     </div>
                     <div>
                         <p className="text-xs text-gray-500 font-medium">Recovery Rate</p>
                         <p className="text-sm font-bold text-gray-900">98%</p>
                     </div>
                 </div>
             </div>
             
             {/* Blue Blob Background behind doctor */}
             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-3/5 bg-blue-500 rounded-t-full opacity-100 z-[-1]"></div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-7/12 p-8 md:p-16 flex flex-col bg-white relative">
            
            {/* Logo Area */}
            <div className="mb-4 font-bold text-2xl flex items-center gap-2 text-blue-600">
                <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center">✚</div>
                MyHHub
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 max-w-md mx-auto w-full">
                <button 
                     onClick={() => navigate('/register')}
                     className="flex-1 py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900 transition-colors capitalize"
                >
                    New {role}
                </button>
                <button 
                     className="flex-1 py-2 text-sm font-bold text-blue-600 bg-white shadow-sm rounded-lg transition-all capitalize"
                >
                    Existing {role}
                </button>
            </div>

            <div className="max-w-md mx-auto w-full">
                
                {/* Role Tabs (Secondary) - Visual Only for Login, but updates Text */}
                <div className="flex justify-center gap-2 mb-6">
                    {['patient', 'doctor', 'admin'].map((r) => (
                        <button 
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${role === r ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to start your session</h2>
                <p className="text-gray-400 text-sm mb-8">Secure, quick, and easy</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email ID / Phone</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                         <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-gray-600">
                                <Lock className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-right mt-2">
                             <a href="#" className="text-xs font-medium text-gray-400 hover:text-gray-600 underline">Reset Password</a>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-4 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all mt-4">
                        Login
                    </Button>
                    
                    <div className="text-center mt-6">
                        <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-800">
                            Login With Code
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
