import { api } from "../client";

export const paymentService = {
  createCharge: async (payload: any) => {
    const response = await api.post('/payment/create-charge', payload);
    return response.data;
  },
  validateCharge: async (payload: any) => {
    const response = await api.post('/payment/verify-charge', payload);
    return response.data;
  },
};