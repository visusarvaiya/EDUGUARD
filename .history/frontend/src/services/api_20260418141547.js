import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),
  verifyOTP: (userId, otp) =>
    api.post('/auth/verify-otp', { userId, otp }),
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),
};

export const riskAPI = {
  getStudentRisk: (studentId) =>
    api.get(`/risk/students/${studentId}/risk`),
  getRiskHistory: (studentId) =>
    api.get(`/risk/students/${studentId}/history`),
  simulateRisk: (data) =>
    api.post('/risk/simulate', data),
};

export const interventionAPI = {
  logIntervention: (data) =>
    api.post('/interventions', data),
  getInterventions: (studentId) =>
    api.get(`/interventions/${studentId}`),
};

export const alertAPI = {
  getUnreadAlerts: () =>
    api.get('/alerts/unread'),
  markAlertAsRead: (alertId) =>
    api.patch(`/alerts/${alertId}/read`),
  markAllAlertsAsRead: () =>
    api.patch('/alerts/read-all'),
};

export const coordinatorAPI = {
  getSummary: (params) =>
    api.get('/coordinator/summary', { params }),
  getSystemicIssues: () =>
    api.get('/coordinator/systemic-issues'),
};

export const reportAPI = {
  getPDFReport: (studentId) =>
    api.get(`/reports/pdf/${studentId}`, { responseType: 'blob' }),
  getCSVReport: (params) =>
    api.get('/reports/csv', { params, responseType: 'blob' }),
};

export default api;
