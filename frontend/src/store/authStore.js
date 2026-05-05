import { create } from 'zustand';
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true
});

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/auth/login', { email, password });
      set({ user: data, isLoading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/auth/register', { username, email, password });
      set({ user: data, isLoading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try { await API.get('/auth/logout'); } catch {}
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const { data } = await API.get('/auth/authcheck');
      set({ user: data });
    } catch {
      set({ user: null });
    }
  },

  clearError: () => set({ error: null }),
}));

export { API };
