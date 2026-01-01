import API from './index';

export const fetchMyReports = () => API.get('/reports/my-reports');
export const uploadReport = (data) => API.post('/reports/upload', data);
export const fetchPatientReports = (patientId) => API.get(`/reports/patient/${patientId}`);
export const uploadPrescription = (data) => API.post('/reports/upload-prescription', data);
