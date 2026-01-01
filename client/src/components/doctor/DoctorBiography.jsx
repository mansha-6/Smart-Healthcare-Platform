import React from 'react';
import { Briefcase, Award, GraduationCap, Globe, BookOpen, Star, MapPin, Mail } from 'lucide-react';

const DoctorBiography = ({ doctor, onEdit }) => {
    // Mock data for education/qualifications if not in doctor object yet
    const education = [
        { degree: "Doctor of Medicine (MD)", school: "Harvard Medical School", year: "2015", desc: "Graduated with Honors" },
        { degree: "Residency in Cardiology", school: "Johns Hopkins Hospital", year: "2018", desc: "Chief Resident" }
    ];

    const certifications = [
        "Board Certified Cardiologist (ABIM)",
        "Advanced Cardiac Life Support (ACLS)",
        "Member of American College of Cardiology"
    ];

    const languages = ["English", "Spanish", "French"];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-teal-600" /> Biography & Qualifications
                </h2>
                <button 
                    onClick={onEdit} 
                    className="px-4 py-2 bg-teal-50 text-teal-600 font-medium rounded-lg hover:bg-teal-100 transition"
                >
                    Edit Profile
                </button>
            </div>

            {/* Top Stats Row - Mimicking PatientRecords Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Experience</p>
                        <h3 className="text-3xl font-bold text-gray-800">{doctor?.experience || '8'}+ Years</h3>
                        <p className="text-xs text-teal-500 mt-1 flex items-center">
                            <Star size={12} className="mr-1" fill="currentColor"/> Highly Rated
                        </p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-full text-teal-500"><Briefcase size={24} /></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Qualifications</p>
                        <h3 className="text-3xl font-bold text-gray-800">{certifications.length} Verified</h3>
                        <p className="text-xs text-purple-500 mt-1">Board Certified</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-full text-purple-500"><Award size={24} /></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Languages</p>
                        <h3 className="text-xl font-bold text-gray-800 flex flex-wrap gap-1">
                            {languages.map((l, i) => (
                                <span key={i} className="text-gray-700">{l}{i < languages.length -1 ? ',' : ''}</span>
                            ))}
                        </h3>
                         <p className="text-xs text-blue-500 mt-1">International Support</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-full text-blue-500"><Globe size={24} /></div>
                </div>
            </div>

            {/* Detailed Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Bio & Education */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Biography Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">Professional Biography</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {doctor?.about || 
                            "Dr. John Doe is a dedicated cardiologist with over 8 years of experience in diagnosing and treating cardiovascular diseases. He obtained his medical degree from Harvard Medical School and completed his residency at Johns Hopkins. Dr. Doe is passionate about preventative cardiology and patient education, ensuring that every patient understands their health journey."}
                        </p>
                        
                        <div className="mt-6 flex gap-4">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MapPin size={16} /> <span>{doctor?.address || 'New York, NY'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Mail size={16} /> <span>{doctor?.email || 'dr.doe@hospital.com'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2 flex items-center gap-2">
                             <GraduationCap className="text-teal-600" size={20}/> Education & Training
                        </h3>
                        <div className="space-y-6">
                            {education.map((edu, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-teal-500 rounded-full mt-1.5"></div>
                                        {idx !== education.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-lg">{edu.school}</h4>
                                        <p className="text-teal-600 font-medium">{edu.degree}</p>
                                        <p className="text-gray-500 text-sm mb-1">{edu.year}</p>
                                        <p className="text-gray-600 text-sm">{edu.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Specializations & Certifications */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Specializations */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4">Specialization</h3>
                         <div className="flex flex-wrap gap-2">
                             {doctor?.specialization?.split(',').map((spec, i) => (
                                 <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100">
                                     {spec.trim()}
                                 </span>
                             )) || (
                                 <>
                                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100">Cardiology</span>
                                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100">Heart Surgery</span>
                                 </>
                             )}
                         </div>
                    </div>

                     {/* Certifications List */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4">Certifications</h3>
                         <ul className="space-y-3">
                             {certifications.map((cert, i) => (
                                 <li key={i} className="flex gap-3 text-sm text-gray-600">
                                     <Award className="text-purple-500 shrink-0" size={18} />
                                     <span>{cert}</span>
                                 </li>
                             ))}
                         </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorBiography;
