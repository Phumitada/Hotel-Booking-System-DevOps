import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/api/services/auth.service'
import { useErrorHandler } from './useErrorHandler'

export const useAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { setAuth, clearAuth, isAuthenticated, user, isLoading } = useAuthStore()
  const { handleError } = useErrorHandler()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  const { isLoading: isFetchingUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const data = await authService.getMe()
        if (data) {
          setAuth(data.user, data.accessToken)
        }
        return data
      } catch (error: any) {
        if (error?.response?.status === 401) {
          clearAuth()
          return null
        }
        throw error
      }
    },
    enabled: !isAuthenticated && !isAuthPage,
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.email}!`);
      navigate("/protected");
    },
    onError: (error: any) => {
      handleError(error, 'Login failed')
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      toast.success('Account created!')
      navigate('/protected')
    },
    onError: (error: any) => {
      handleError(error, 'Register failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
      toast.success("Logged out");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isFetchingUser,

    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};
