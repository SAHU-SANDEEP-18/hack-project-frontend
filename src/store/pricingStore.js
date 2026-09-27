import { create } from 'zustand';
import { getCatalogApi, syncPricingApi, createServiceApi, updateServiceApi, deleteServiceApi } from '../api/pricing.api';
import { useUiStore } from './uiStore';

export const usePricingStore = create((set, get) => ({
  catalog: [],
  isLoading: false,
  isSyncing: false,
  error: null,

  fetchCatalog: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCatalogApi();
      set({ catalog: response.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      useUiStore.getState().addToast(`Failed to load catalog: ${err.message}`, 'error');
    }
  },

  syncCatalog: async () => {
    set({ isSyncing: true, error: null });
    try {
      const response = await syncPricingApi();
      const updatedCatalog = response.data?.catalog || [];
      set({ catalog: updatedCatalog, isSyncing: false });
      useUiStore.getState().addToast(response.message || 'Catalog synced with Google Sheet/CSV', 'success');
    } catch (err) {
      set({ isSyncing: false, error: err.message });
      useUiStore.getState().addToast(`Sync failed: ${err.message}`, 'error');
    }
  },

  addService: async (serviceData) => {
    try {
      const response = await createServiceApi(serviceData);
      useUiStore.getState().addToast('Service created successfully', 'success');
      await get().fetchCatalog();
      return response.data;
    } catch (err) {
      useUiStore.getState().addToast(`Failed to add service: ${err.message}`, 'error');
      throw err;
    }
  },

  editService: async (id, serviceData) => {
    try {
      const response = await updateServiceApi(id, serviceData);
      useUiStore.getState().addToast('Service updated successfully', 'success');
      await get().fetchCatalog();
      return response.data;
    } catch (err) {
      useUiStore.getState().addToast(`Failed to update service: ${err.message}`, 'error');
      throw err;
    }
  },

  removeService: async (id) => {
    try {
      await deleteServiceApi(id);
      useUiStore.getState().addToast('Service deleted from catalog', 'success');
      await get().fetchCatalog();
    } catch (err) {
      useUiStore.getState().addToast(`Failed to delete service: ${err.message}`, 'error');
      throw err;
    }
  },
}));
