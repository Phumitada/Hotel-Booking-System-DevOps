import { api, axiosPublic } from "@/api/client";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post("/auth/login", payload);
    return response.data.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await api.post("/auth/register", payload);
    return response.data.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  getMe: async () => {
    try {
      const response = await axiosPublic.get("/auth/me");
      return response.data.data;
    } catch {
      return null;
    }
  },
};
