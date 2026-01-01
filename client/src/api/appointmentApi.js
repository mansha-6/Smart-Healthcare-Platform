import API from './index';

export const bookAppointment = (data) => API.post('/appointments/book', data);
export const fetchMyAppointments = () => API.get('/appointments/history');
export const fetchDoctorAppointments = () => API.get('/appointments/doctor-appointments');
export const updateAppointmentStatus = (id, status) => API.put(`/appointments/${id}/status`, { status });
export const cancelAppointment = (id) => API.delete(`/appointments/cancel/${id}`);
