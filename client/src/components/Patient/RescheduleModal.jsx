import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const RescheduleModal = ({ appointment, onClose, onSuccess }) => {
    const { token } = useAuth();
    const [date, setDate] = useState(appointment.date.split('T')[0]);
    const [time, setTime] = useState(appointment.time);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/appointments/reschedule/${appointment._id}`,
                { date, time },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Rescheduled Successfully!');
            onSuccess();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reschedule');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="font-bold text-lg mb-4">Reschedule Appointment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700">New Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">New Time</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">{loading ? 'Saving...' : 'Confirm'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RescheduleModal;
