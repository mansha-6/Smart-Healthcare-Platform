import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Brain, 
    Heart, 
    Bone, 
    Microscope, 
    Eye, 
    Baby, 
    Stethoscope, 
    Activity,
    ChevronRight
} from 'lucide-react';

const categories = [
    { id: 1, name: "Neurology", icon: Brain, color: "text-red-500", bg: "bg-red-50" },
    { id: 2, name: "Cardiology", icon: Heart, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 3, name: "Orthopedics", icon: Bone, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 4, name: "Pathology", icon: Microscope, color: "text-purple-500", bg: "bg-purple-50" },
    { id: 5, name: "Ophthalmology", icon: Eye, color: "text-teal-500", bg: "bg-teal-50" },
    { id: 6, name: "Pediatrics", icon: Baby, color: "text-pink-500", bg: "bg-pink-50" },
    { id: 7, name: "General", icon: Stethoscope, color: "text-green-500", bg: "bg-green-50" },
    { id: 8, name: "Therapy", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
];

const DoctorCategories = () => {
    return (
        <div className="bg-transparent h-full">
            <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-xl font-bold text-gray-800">Most popular majors</h3>
                <Link to="/doctors" className="flex items-center text-sm font-semibold text-gray-500 hover:text-teal-600 transition">
                    See All <ChevronRight size={16} />
                </Link>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((cat) => (
                    <Link to={`/doctors?category=${cat.name}`} key={cat.id} className="flex flex-col items-center gap-3 p-1 hover:transform hover:scale-105 transition duration-200 group">
                        <div className={`${cat.bg} p-5 rounded-full shadow-sm`}>
                            <cat.icon className={`w-7 h-7 ${cat.color} opacity-90 group-hover:scale-110 transition`} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 text-center tracking-wide">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DoctorCategories;
