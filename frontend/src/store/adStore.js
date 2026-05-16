import { create } from 'zustand';
import { API } from './authStore';

export const useAdStore = create((set) => ({
  ads: [],
  isLoading: false,
  error: null,

  fetchAds: async (placement = '') => {
    set({ isLoading: true, error: null });
    try {
      const url = placement ? `/ads?placement=${placement}` : '/ads';
      const { data } = await API.get(url);
      set({ ads: data, isLoading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch ads';
      set({ error: msg, isLoading: false });
    }
  },

  createAd: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post('/ads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({ ads: [data, ...state.ads], isLoading: false }));
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create ad';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  toggleAdStatus: async (id) => {
    try {
      const { data } = await API.patch(`/ads/${id}/toggle`);
      set((state) => ({
        ads: state.ads.map((ad) => (ad._id === id ? data : ad))
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to toggle ad';
      throw new Error(msg);
    }
  },

  deleteAd: async (id) => {
    try {
      await API.delete(`/ads/${id}`);
      set((state) => ({
        ads: state.ads.filter((ad) => ad._id !== id)
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete ad';
      throw new Error(msg);
    }
  }
}));
