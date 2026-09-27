import axiosInstance from './axiosInstance';

export const getCatalogApi = () => {
  return axiosInstance.get('/pricing');
};

export const syncPricingApi = () => {
  return axiosInstance.post('/pricing/sync');
};

export const createServiceApi = (serviceData) => {
  return axiosInstance.post('/pricing/services', serviceData);
};

export const updateServiceApi = (id, serviceData) => {
  return axiosInstance.patch(`/pricing/services/${id}`, serviceData);
};

export const deleteServiceApi = (id) => {
  return axiosInstance.delete(`/pricing/services/${id}`);
};
