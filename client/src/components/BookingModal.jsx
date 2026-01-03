import React, { useState } from 'react';
import { bookAppointment } from '../api/appointmentApi';
import { Button } from './ui/Button';
import { Calendar, Clock, Video, MapPin, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addDays } from 'date-fns';

const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState(''); // 'online' or 'physical'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate next 5 days for Date Selection
  const nextDays = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));

  // Mock slots (mix real availability if present, else default)
  const slots = doctor.availability && doctor.availability.length > 0 
      ? doctor.availability 
      : ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await bookAppointment({
        doctorId: doctor._id,
        doctorName: doctor.name,
        date,
        time,
        type,
        fees: type === 'online' ? (doctor.fees?.video || 30) : (doctor.fees?.visit || 60)
      });
      // onSuccess(); // Usually triggers a refresh or alert
      setStep(5); // Success State
    } catch (err) {
      setError(err.response?.data?.message || 'Booking Failed');
    } finally {
      setLoading(false);
    }
  };

  const fees = type === 'online' ? (doctor.fees?.video || 30) : (doctor.fees?.visit || 60);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-teal-700 p-6 text-white text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition">
                <X size={20} />
            </button>
            <h3 className="text-xl font-bold">Book Appointment</h3>
            <p className="text-teal-100 text-sm">with {doctor.name}</p>
            
            {/* Steps Indicator */}
            {step < 5 && (
                <div className="flex justify-center gap-2 mt-4">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${s <= step ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                </div>
            )}
        </div>

        <div className="p-6 min-h-[350px] flex flex-col">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center font-medium">{error}</div>}

            {/* Step 1: Select Date */}
            {step === 1 && (
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-teal-600" size={20} /> Select Date
                    </h4>
                    <div className="space-y-3">
                        {nextDays.map((d) => {
                            const dateStr = format(d, 'yyyy-MM-dd');
                            const isSelected = date === dateStr;
                            return (
                                <button 
                                    key={dateStr}
                                    onClick={() => setDate(dateStr)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                        isSelected 
                                        ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-md ring-1 ring-teal-500' 
                                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="font-semibold">{format(d, 'EEEE, d MMMM')}</span>
                                    {isSelected && <CheckCircle size={18} className="text-teal-600" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 2: Select Slot */}
            {step === 2 && (
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="text-teal-600" size={20} /> Select Time Slot
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        {slots.map((s) => (
                            <button 
                                key={s}
                                onClick={() => setTime(s)}
                                className={`py-3 px-2 rounded-lg text-sm font-bold border transition-all truncate ${
                                    time === s
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Select Type */}
            {step === 3 && (
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Video className="text-teal-600" size={20} /> Consultation Type
                    </h4>
                    <div className="space-y-4">
                        <button 
                            onClick={() => setType('online')}
                            className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                                type === 'online' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-100 hover:border-gray-300'
                            }`}
                        >
                            <div className={`p-3 rounded-full ${type === 'online' ? 'bg-teal-200 text-teal-800' : 'bg-gray-100 text-gray-500'}`}>
                                <Video size={24} />
                            </div>
                            <div className="text-left">
                                <h5 className="font-bold text-gray-900">Online Video Call</h5>
                                <p className="text-sm text-gray-500">Video consultation via app</p>
                                <span className="text-teal-600 font-bold mt-1 block">${doctor.fees?.video || 30}</span>
                            </div>
                        </button>

                        <button 
                            onClick={() => setType('physical')}
                            className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                                type === 'physical' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-100 hover:border-gray-300'
                            }`}
                        >
                            <div className={`p-3 rounded-full ${type === 'physical' ? 'bg-teal-200 text-teal-800' : 'bg-gray-100 text-gray-500'}`}>
                                <MapPin size={24} />
                            </div>
                            <div className="text-left">
                                <h5 className="font-bold text-gray-900">Clinic Visit</h5>
                                <p className="text-sm text-gray-500">In-person appointment</p>
                                <span className="text-teal-600 font-bold mt-1 block">${doctor.fees?.visit || 60}</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Confirm Details</h4>
                    
                    <div className="bg-gray-50 p-5 rounded-2xl space-y-4 mb-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Doctor</span>
                            <span className="font-bold text-gray-900">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Date</span>
                            <span className="font-bold text-gray-900">{format(new Date(date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Time</span>
                            <span className="font-bold text-gray-900">{time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Type</span>
                            <span className="font-bold text-teal-600 capitalize flex items-center gap-1">
                                {type === 'online' ? <Video size={14}/> : <MapPin size={14}/>} {type}
                            </span>
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center">
                            <span className="text-gray-900 font-medium">Total Fees</span>
                            <span className="text-xl font-bold text-teal-700">${fees}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                        Your appointment with {doctor.name} on {date} at {time} has been successfully booked.
                    </p>
                    <button onClick={() => window.location.href = '/dashboard/appointments'} className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition shadow-lg">
                        Go to Appointments
                    </button>
                </div>
            )}

            {/* Footer Buttons (Hidden on Success step) */}
            {step < 5 && (
                <div className="mt-6 flex gap-3">
                    {step > 1 && (
                        <button 
                            onClick={handleBack}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                    )}
                    
                    <button 
                        onClick={step === 4 ? handleSubmit : handleNext}
                        disabled={
                            (step === 1 && !date) ||
                            (step === 2 && !time) ||
                            (step === 3 && !type) ||
                            loading
                        }
                        className={`flex-1 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${
                            loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? 'Processing...' : step === 4 ? 'Confirm Booking' : 'Next Step'}
                        {!loading && step < 4 && <ChevronRight size={18} />}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
