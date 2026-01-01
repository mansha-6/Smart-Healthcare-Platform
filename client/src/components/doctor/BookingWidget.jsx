import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { bookAppointment } from '../../api/appointmentApi';

const BookingWidget = ({ doctorId, fees, bio, schedule }) => {
    // Generate next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            date: d,
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
            fullDate: d.toISOString().split('T')[0]
        };
    }).filter(d => {
        if (!schedule || !schedule.days || schedule.days.length === 0) return true;
        return schedule.days.includes(d.day);
    });

    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeTab, setTimeTab] = useState('Afternoon');
    const [loading, setLoading] = useState(false);

    const defaultTimeSlots = {
        Morning: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        Afternoon: ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
        Evening: ['06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM']
    };

    const timeSlots = schedule && schedule.timeSlots ? schedule.timeSlots : defaultTimeSlots;

    const handleBook = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select a date and time');
            return;
        }

        setLoading(true);
        try {
            await bookAppointment({ 
                doctorId, 
                date: selectedDate.fullDate, 
                time: selectedTime,
                reason: 'General Consultation' 
            });
            alert('Appointment booked successfully!');
            window.location.href = '/appointments'; 
        } catch (error) {
            console.error(error);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6 sticky top-6">
            
            {/* Bio Section */}
            {bio && (
                <div className="mb-8 border-b border-gray-50 pb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Doctor Biography</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {bio}
                    </p>
                </div>
            )}

            {/* Schedules Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Schedules</h3>
                <div className="flex items-center text-xs text-gray-500 cursor-pointer hover:text-teal-600">
                    Oct 2023 <span className="ml-1">▼</span>
                </div>
            </div>
            
            {/* Date Strip */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                {dates.map((item, idx) => {
                    const isSelected = selectedDate?.fullDate === item.fullDate;
                    return (
                        <button 
                            key={idx}
                            onClick={() => setSelectedDate(item)}
                            className={`flex flex-col items-center min-w-[64px] p-3 rounded-2xl transition-all border ${
                                isSelected 
                                ? 'bg-teal-700 text-white border-teal-700 shadow-lg shadow-teal-700/30' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-teal-200'
                            }`}
                        >
                            <span className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>{item.dayNum}</span>
                            <span className="text-xs font-medium">{item.day}</span>
                        </button>
                    );
                })}
            </div>

            {/* Choose Times Header */}
            <h4 className="font-bold text-gray-900 mb-4 text-base">Choose Times</h4>

            {/* Time Tabs */}
            <div className="bg-teal-50/50 p-1 rounded-full flex items-center justify-between mb-6">
                {Object.keys(timeSlots).map((period) => (
                    <button
                        key={period}
                        onClick={() => setTimeTab(period)}
                        className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                            timeTab === period
                            ? 'bg-teal-700 text-white shadow-md'
                            : 'text-teal-700 hover:bg-teal-100'
                        }`}
                    >
                        {period}
                    </button>
                ))}
            </div>

            {/* Time Slots Chips */}
            <div className="bg-gray-50/50 rounded-2xl p-4 mb-8">
                <p className="text-xs text-gray-500 font-bold mb-3">{timeTab} Schedule</p>
                <div className="flex flex-wrap gap-3">
                    {timeSlots[timeTab].map(time => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                selectedTime === time
                                ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400'
                            }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action */}
            <button 
                onClick={handleBook}
                disabled={loading}
                className="w-full bg-teal-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-800 transition shadow-xl shadow-teal-700/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {loading ? 'Booking...' : `Book Appointment ($${fees || 50.99})`}
            </button>
        </div>
    );
};

export default BookingWidget;
