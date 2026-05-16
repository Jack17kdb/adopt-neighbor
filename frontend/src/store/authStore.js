import { create } from 'zustand';
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true
});

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/auth/login', { email, password });
      set({ user: data, isLoading: false, isCheckingAuth: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  addStaffMember: async (staffData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/admin/staff', staffData);
      set({ isLoading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add staff member';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try { await API.get('/auth/logout'); } catch {}
    set({ user: null, isCheckingAuth: false });
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await API.get('/auth/authcheck');
      set({ user: data, isCheckingAuth: false });
    } catch {
      set({ user: null, isCheckingAuth: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export { API };
