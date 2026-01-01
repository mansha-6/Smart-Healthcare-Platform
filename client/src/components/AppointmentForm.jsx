import React, { useState } from 'react';
import { bookAppointment } from '../api/appointmentApi';

const AppointmentForm = ({ doctorId }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment({ doctorId, date, time, reason });
      alert('Appointment booked successfully!');
    } catch (error) {
      alert('Failed to book appointment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)} 
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <textarea 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600"
      >
        Confirm Booking
      </button>
    </form>
  );
};

export default AppointmentForm;
