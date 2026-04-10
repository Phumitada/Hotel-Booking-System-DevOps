import { api, axiosPublic } from "@/api/client";
import { useAuthStore } from "@/stores/auth.store";

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
    const token = useAuthStore.getState().accessToken;
    if (!token) return null;
    try {
      const response = await axiosPublic.get("/auth/me");
      const user = response.data.data;
      if (!user) return null;
      return { user, accessToken: token }  
    } catch {
      return null;
    }
  },
};
