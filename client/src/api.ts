import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const getActiveCycle = () => api.get('/cycles/active');
export const addSession = (letters: string[], session_date: string) =>
  api.post('/sessions', { letters, session_date });
export const deleteSession = (id: number) => api.delete(`/sessions/${id}`);
export const resetCycle = () => api.post('/cycles/reset');