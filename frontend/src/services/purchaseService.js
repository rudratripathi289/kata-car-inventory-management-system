import api from '../api/axios';

export const getMyPurchases = async () => {
  const response = await api.get('/purchases');
  return response.data;
};
