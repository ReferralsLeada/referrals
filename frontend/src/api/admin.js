import axios from 'axios';

const API_URL = import.meta.env.PROD
  ? 'https://referrals-qp8h.onrender.com/api/admin'
  : '/api/admin';

export const adminAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const signupAdmin = (data) => adminAPI.post('/auth/signup', data);
export const loginAdmin = (data) => adminAPI.post('/auth/login', data);

// Protected
export const getDashboardStats = (token) =>
  adminAPI.get('/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Affiliates
export const fetchPendingAffiliates = (token) =>
  adminAPI.get('/affiliates/pending', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveAffiliate = (id, token) =>
  adminAPI.put(`/affiliates/approve/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAffiliate = (id, token) =>
  adminAPI.delete(`/affiliates/remove/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAffiliateStats = (token) =>
  adminAPI.get('/dashboard/affiliates', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAffiliatesByAdmin = (adminId) =>
  adminAPI.get(`/affiliates?adminId=${adminId}`);
