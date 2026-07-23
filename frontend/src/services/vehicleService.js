import api from '../api/axios';

export const getVehicles = () => api.get('/vehicles');
export const searchVehicles = (params) => api.get('/vehicles/search', { params });
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (vehicleData) => api.post('/vehicles', vehicleData);
export const updateVehicle = (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
export const restockVehicle = (id, quantity) => api.post(`/vehicles/${id}/restock`, { quantity });
export const purchaseVehicle = (id, quantity) => api.post(`/vehicles/${id}/purchase`, { quantity });
