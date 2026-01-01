import API from './index';

export const fetchDoctors = () => API.get('/doctor/list');
export const fetchDoctorById = (id) => API.get(`/doctor/${id}`);
export const updateDoctorProfile = (data) => API.put('/doctor/update-profile', data);
export const fetchDoctorStats = () => API.get('/doctor/stats');
export const uploadPrescription = (data) => API.post('/reports/upload-prescription', data); // Moving to correct route but keeping here for ease if preferred, or move to reportApi
// Actually uploadPrescription is on reports route now.

