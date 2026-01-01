import React, { useEffect, useState } from 'react';
import { fetchDoctors } from '../api/doctorApi';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal'; // Import Modal
import { useSearchParams } from 'react-router-dom';

const DoctorList = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Filtered list
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchSpec, setSearchSpec] = useState('');
  
  const [searchCity, setSearchCity] = useState('');
  const [searchAvail, setSearchAvail] = useState('');
  
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For Modal

  const MOCK_DOCTORS = [
    { 
        _id: "mock-1", name: "Dr. Chloe Kelly", specialization: "Neurologist", experience: 12, fees: 60, rating: 4.9, 
        image: "https://randomuser.me/api/portraits/women/60.jpg",
        bio: "Expert in neurological disorders with a focus on migraine and stroke prevention. providing compassionate care for over a decade.",
        isAvailable: true, gender: "Female", address: "Central Hospital, NY"
    },
    { 
        _id: "mock-2", name: "Dr. Lauren Hemp", specialization: "Orthopedic", experience: 8, fees: 55, rating: 4.8, 
        image: "https://randomuser.me/api/portraits/men/33.jpg",
        bio: "Specializing in sports injuries and joint replacement surgeries. Dedicated to getting you back to your active lifestyle.",
        isAvailable: true, gender: "Male", address: "Ortho Clinic, NY"
    },
    { 
        _id: "mock-3", name: "Dr. Stefan Persson", specialization: "Cardiologist", experience: 15, fees: 75, rating: 5.0, 
        image: "https://randomuser.me/api/portraits/men/86.jpg",
        bio: "Renowned cardiologist with extensive experience in interventional cardiology and heart failure management.",
        isAvailable: true, gender: "Male", address: "Heart Institute, NY"
    },
    { 
        _id: "mock-4", name: "Dr. Emily Blunt", specialization: "Dermatologist", experience: 6, fees: 45, rating: 4.7, 
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Focusing on cosmetic and medical dermatology. Helping you achieve healthy, glowing skin with personalized treatments.",
        isAvailable: true, gender: "Female", address: "Skin Care Center, NY"
    },
    { 
        _id: "mock-5", name: "Dr. James Wilson", specialization: "Pediatrician", experience: 10, fees: 50, rating: 4.9, 
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        bio: "Friendly and caring pediatrician dedicated to the health and well-being of children from infancy through adolescence.",
        isAvailable: true, gender: "Male", address: "Kids Health, NY"
    },
    { 
        _id: "mock-6", name: "Dr. Sarah Connor", specialization: "Psychiatrist", experience: 14, fees: 70, rating: 4.8, 
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        bio: "Compassionate psychiatrist specializing in anxiety, depression, and stress management. Here to listen and help.",
        isAvailable: true, gender: "Female", address: "Mind Wellness, NY"
    },
    { 
        _id: "mock-7", name: "Dr. Robert Stark", specialization: "General Physician", experience: 20, fees: 40, rating: 4.6, 
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        bio: "Experienced general practitioner providing comprehensive primary care for the whole family.",
        isAvailable: true, gender: "Male", address: "City Clinic, NY"
    },
    { 
        _id: "mock-8", name: "Dr. Lisa Cuddy", specialization: "Endocrinologist", experience: 11, fees: 65, rating: 4.9, 
        image: "https://randomuser.me/api/portraits/women/32.jpg",
        bio: "Specialist in hormone-related diseases including diabetes, thyroid disorders, and metabolic imbalances.",
        isAvailable: false, gender: "Female", address: "Metabolic Center, NY"
    },
    { 
        _id: "mock-9", name: "Dr. Gregory House", specialization: "Nephrologist", experience: 18, fees: 80, rating: 4.5, 
        image: "https://randomuser.me/api/portraits/men/99.jpg",
        bio: "Expert in kidney diseases and hypertension. Known for diagnosing complex cases.",
        isAvailable: true, gender: "Male", address: "Teaching Hospital, NY"
    },
    { 
        _id: "mock-10", name: "Dr. Meredith Grey", specialization: "General Surgeon", experience: 10, fees: 90, rating: 4.9, 
        image: "https://randomuser.me/api/portraits/women/24.jpg",
        bio: "Skilled general surgeon with expertise in abdominal surgeries and trauma care.",
        isAvailable: true, gender: "Female", address: "Seattle Greys, NY"
    },
    { 
        _id: "mock-11", name: "Dr. Derek Shepherd", specialization: "Neurologist", experience: 15, fees: 100, rating: 5.0, 
        image: "https://randomuser.me/api/portraits/men/50.jpg",
        bio: "World-class neurosurgeon specializing in complex brain and spine surgeries.",
        isAvailable: true, gender: "Male", address: "Neuro Center, NY"
    },
    { 
        _id: "mock-12", name: "Dr. Cristina Yang", specialization: "Cardiologist", experience: 12, fees: 95, rating: 5.0, 
        image: "https://randomuser.me/api/portraits/women/48.jpg",
        bio: "Highly skilled cardiothoracic surgeon focused on advanced heart procedures.",
        isAvailable: true, gender: "Female", address: "Heart Center, NY"
    }
  ];

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const { data } = await fetchDoctors();
        // Combine real data with mock data to ensure a full list for demo purposes
        const combinedDoctors = [...(data || []), ...MOCK_DOCTORS];
        
        // Remove duplicates if any real doc has same ID as mock (unlikely but safe)
        const uniqueDoctors = Array.from(new Map(combinedDoctors.map(item => [item._id, item])).values());
        
        setDoctors(uniqueDoctors);
        setFilteredDoctors(uniqueDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors(MOCK_DOCTORS);
        setFilteredDoctors(MOCK_DOCTORS);
      } finally {
        setLoading(false);
      }
    };
    getDoctors();
  }, []);

  // Filter logic
  useEffect(() => {
    const results = doctors.filter(doc => {
        const nameMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const specMatch = doc.specialization?.toLowerCase().includes(searchSpec.toLowerCase());
        const cityMatch = !searchCity || (doc.address && doc.address.toLowerCase().includes(searchCity.toLowerCase()));
        const availMatch = !searchAvail || (searchAvail === 'available' ? doc.isAvailable : true);
        
        return nameMatch && specMatch && cityMatch && availMatch;
    });
    setFilteredDoctors(results);
  }, [searchTerm, searchSpec, searchCity, searchAvail, doctors]);

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h2>
      
      {/* Search Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
            type="text" 
            placeholder="Search by Name..." 
            className="border p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
            className="border p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            value={searchSpec}
            onChange={(e) => setSearchSpec(e.target.value)}
        >
            <option value="">All Specializations</option>
            {[...new Set(doctors.map(d => d.specialization).filter(Boolean))].map(spec => (
                <option key={spec} value={spec}>{spec}</option>
            ))}
        </select>
        <input 
            type="text" 
            placeholder="Location..." 
            className="border p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
        />
        <select
            className="border p-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            value={searchAvail}
            onChange={(e) => setSearchAvail(e.target.value)}
        >
            <option value="">All Availability</option>
            <option value="available">Available Now</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id}>
             <DoctorCard doctor={doctor} onBook={() => handleBookClick(doctor)} />
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <BookingModal 
            doctor={selectedDoctor} 
            onClose={() => setSelectedDoctor(null)} 
            onSuccess={() => alert('Check your dashboard for confirmation!')}
        />
      )}
    </div>
  );
};

export default DoctorList;
