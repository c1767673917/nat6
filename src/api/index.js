import axios from 'axios';

const API_BASE_URL = 'https://m.loux.us.kg/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const memoApi = {
  login: (username) => api.post('/auth/login', { username }),
  getMemos: () => api.get('/memos'),
  createMemo: (memo) => api.post('/memos', memo),
  updateMemo: (id, memo) => api.put(`/memos/${id}`, memo),
  deleteMemo: (id) => api.delete(`/memos/${id}`),
}; 