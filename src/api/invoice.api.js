import axiosInstance from './axiosInstance';

export const generateInvoiceApi = (message) => {
  return axiosInstance.post('/invoices/generate', { message });
};

export const getInvoiceApi = (id) => {
  return axiosInstance.get(`/invoices/${id}`);
};

export const updateInvoiceApi = (id, data) => {
  return axiosInstance.patch(`/invoices/${id}`, data);
};

export const approveInvoiceApi = (id) => {
  return axiosInstance.post(`/invoices/${id}/approve`);
};

export const listInvoicesApi = (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return axiosInstance.get(`/invoices${queryString}`);
};

export const downloadInvoicePdfUrl = (id) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://hack-project-backend.onrender.com/api';
  return `${baseUrl}/invoices/${id}/pdf`;
};
