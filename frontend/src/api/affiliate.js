import axios from 'axios';

const API_URL = '/api/affiliate';

export const affiliateAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAdminList = async () => {
  return await affiliateAPI.get('/auth/admins');
};

export const signupAffiliate = async (data) => {
  return await affiliateAPI.post('/auth/signup', data);
};

export const loginAffiliate = async (data) => {
  return await affiliateAPI.post('/auth/login', data);
};

export const getAffiliateStats = async (token) => {
  return await affiliateAPI.get('/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  });
};