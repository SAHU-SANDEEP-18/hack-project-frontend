import { create } from 'zustand';
import {
  generateInvoiceApi,
  getInvoiceApi,
  updateInvoiceApi,
  approveInvoiceApi,
  listInvoicesApi,
} from '../api/invoice.api';
import { useUiStore } from './uiStore';
import { calculateInvoiceTotals } from '../services/invoice.service';

export const useInvoiceStore = create((set, get) => ({
  currentInvoice: null,
  invoices: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
  isGenerating: false,
  isLoading: false,
  isUpdating: false,
  isApproving: false,
  error: null,

  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),

  generateInvoice: async (message) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await generateInvoiceApi(message);
      const invoice = response.data;
      set({ currentInvoice: invoice, isGenerating: false });
      useUiStore.getState().addToast(`Invoice #${invoice.invoiceNumber} generated!`, 'success');
      return invoice;
    } catch (err) {
      set({ isGenerating: false, error: err.message });
      useUiStore.getState().addToast(`Extraction failed: ${err.message}`, 'error');
      throw err;
    }
  },

  fetchInvoice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getInvoiceApi(id);
      set({ currentInvoice: response.data, isLoading: false });
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.message });
      useUiStore.getState().addToast(`Failed to fetch invoice: ${err.message}`, 'error');
      throw err;
    }
  },

  updateInvoiceDraft: async (id, updatePayload) => {
    set({ isUpdating: true });
    try {
      const response = await updateInvoiceApi(id, updatePayload);
      const updated = response.data;
      set({ currentInvoice: updated, isUpdating: false });
      useUiStore.getState().addToast('Invoice changes saved', 'success');
      return updated;
    } catch (err) {
      set({ isUpdating: false });
      useUiStore.getState().addToast(`Failed to save invoice: ${err.message}`, 'error');
      throw err;
    }
  },

  updateCurrentItemLocally: (itemIndex, itemPatch, catalog = []) => {
    const current = get().currentInvoice;
    if (!current) return;

    const updatedItems = [...(current.items || [])];
    const targetItem = { ...updatedItems[itemIndex], ...itemPatch };

    // If matched service changed, try to populate price automatically from catalog
    if (itemPatch.matchedService) {
      const foundCatalog = catalog.find(
        (c) => c.name.toLowerCase() === itemPatch.matchedService.toLowerCase()
      );
      if (foundCatalog) {
        targetItem.unitPricePaise = foundCatalog.unitPricePaise;
        targetItem.matchStatus = 'matched';
      }
    }

    if (targetItem.unitPricePaise !== null && targetItem.unitPricePaise !== undefined) {
      targetItem.lineTotalPaise = Number(targetItem.unitPricePaise) * Number(targetItem.quantity || 1);
    } else {
      targetItem.lineTotalPaise = 0;
    }

    updatedItems[itemIndex] = targetItem;

    const totals = calculateInvoiceTotals(updatedItems, current.taxRatePercent || 18);

    set({
      currentInvoice: {
        ...current,
        items: updatedItems,
        subtotalPaise: totals.subtotalPaise,
        taxAmountPaise: totals.taxAmountPaise,
        totalPaise: totals.totalPaise,
      },
    });
  },

  addItemLocally: (newItem, catalog = []) => {
    const current = get().currentInvoice;
    if (!current) return;

    let unitPricePaise = newItem.unitPricePaise || null;
    let matchStatus = newItem.matchStatus || 'not_found';
    let matchedService = newItem.matchedService || null;

    if (matchedService) {
      const foundCatalog = catalog.find(
        (c) => c.name.toLowerCase() === matchedService.toLowerCase()
      );
      if (foundCatalog) {
        unitPricePaise = foundCatalog.unitPricePaise;
        matchStatus = 'matched';
      }
    }

    const qty = Number(newItem.quantity) || 1;
    const itemToAdd = {
      requestedText: newItem.requestedText || matchedService || 'Custom Item',
      matchedService,
      quantity: qty,
      unitPricePaise,
      lineTotalPaise: unitPricePaise !== null ? unitPricePaise * qty : 0,
      matchStatus,
      candidates: [],
    };

    const updatedItems = [...(current.items || []), itemToAdd];
    const totals = calculateInvoiceTotals(updatedItems, current.taxRatePercent || 18);

    set({
      currentInvoice: {
        ...current,
        items: updatedItems,
        subtotalPaise: totals.subtotalPaise,
        taxAmountPaise: totals.taxAmountPaise,
        totalPaise: totals.totalPaise,
      },
    });
  },

  removeItemLocally: (itemIndex) => {
    const current = get().currentInvoice;
    if (!current) return;

    const updatedItems = current.items.filter((_, idx) => idx !== itemIndex);
    const totals = calculateInvoiceTotals(updatedItems, current.taxRatePercent || 18);

    set({
      currentInvoice: {
        ...current,
        items: updatedItems,
        subtotalPaise: totals.subtotalPaise,
        taxAmountPaise: totals.taxAmountPaise,
        totalPaise: totals.totalPaise,
      },
    });
  },

  approveInvoice: async (id) => {
    set({ isApproving: true });
    try {
      const response = await approveInvoiceApi(id);
      const approved = response.data;
      set({ currentInvoice: approved, isApproving: false });
      useUiStore.getState().addToast(`Invoice #${approved.invoiceNumber} Approved! Ready for PDF download.`, 'success');
      return approved;
    } catch (err) {
      set({ isApproving: false });
      useUiStore.getState().addToast(`Approval failed: ${err.message}`, 'error');
      throw err;
    }
  },

  fetchInvoicesList: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await listInvoicesApi(params);
      const invoicesArray = Array.isArray(response.data)
        ? response.data
        : response.data?.invoices || [];
      set({
        invoices: invoicesArray,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      useUiStore.getState().addToast(`Failed to load invoices list: ${err.message}`, 'error');
    }
  },
}));
