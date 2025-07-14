import axios from 'axios';

const API_URL = '/api/admin';

export const adminAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const signupAdmin = async (data) => {
  return await adminAPI.post('/auth/signup', data);
};

export const loginAdmin = async (data) => {
  return await adminAPI.post('/auth/login', data);
};

// Protected endpoints
export const getDashboardStats = async (token) => {
  return await adminAPI.get('/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchPendingAffiliates = (token) => {
  return  adminAPI.get('/affiliates/pending', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const approveAffiliate = (id, token) =>
   adminAPI.put(`/affiliates/approve/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAffiliate = (id, token) =>
   adminAPI.delete(`/affiliates/remove/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAffiliateStats = async (token) => {
  return await adminAPI.get('/dashboard/affiliates', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getAffiliatesByAdmin = async (adminId) => {
  return await adminAPI.get(`/dashboard/affiliates?adminId=${adminId}`);
};

export const fetchApprovedAffiliates = async (token) => {
  return await adminAPI.get('/dashboard/affiliates/approved', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

