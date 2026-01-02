import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Video, FileText, ArrowRight, Activity } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-white pt-16 pb-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-100 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-teal-100 bg-white shadow-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2"></span>
                <span className="text-sm font-medium text-teal-800 tracking-wide uppercase">New Standard in Healthcare</span>
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block xl:inline">Smart Healthcare</span>
                <span className="block text-teal-600 xl:inline"> For Everyone</span>
              </h1>
              <p className="mt-6 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Experience the future of medical care. Consult top doctors via video, manage digital prescriptions, and track your recovery journey—all in one secure platform.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-teal-600/30 transition-all hover:-translate-y-1">
                        Get Started
                        <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </Link>
                    <Link to="/about" className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all">
                        Learn More
                    </Link>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                    Trusted by 10,000+ patients & 500+ doctors.
                </p>
              </div>
            </div>

            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-xl lg:max-w-md overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                  <img 
                    className="w-full" 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                    alt="Doctor with patient" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                       <div className="text-white">
                           <p className="text-xl font-bold">Dr. Sarah & Team</p>
                           <p className="text-sm opacity-90">Ready to assist you 24/7</p>
                       </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for better health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Video className="text-blue-600 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Video Consultations</h3>
                  <p className="text-gray-500 leading-relaxed">
                      Connect with specialists from the comfort of your home. High-quality secure video calls for seamless diagnosis.
                  </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileText className="text-teal-600 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Records</h3>
                  <p className="text-gray-500 leading-relaxed">
                      Never lose a prescription again. All your medical history, reports, and prescriptions are stored securely in one place.
                  </p>
              </div>

               {/* Feature 3 */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Activity className="text-purple-600 h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Health Tracking</h3>
                  <p className="text-gray-500 leading-relaxed">
                      Monitor your vitals and recovery progress with intuitive charts. Stay on top of your health goals effortlessly.
                  </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
