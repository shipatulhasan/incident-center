import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode
} from 'react'

import { useAppMutation } from '@/api/useAppMutation'
import { useAppQuery } from '@/api/useAppQuery'
import { useQueryClient } from '@tanstack/react-query'
import { authStorage } from '@/lib/auth'

interface AuthContextType {
  user: TIUser | null
  loading: boolean
  isAuthenticated: boolean

  login: (payload: TLoginPayload) => Promise<void>

  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')
  const queryClient = useQueryClient()


  const {
    data,
    isPending: loading,
  } = useAppQuery<TApiResponse<{
    user: TIUser
  }>>({
    queryKey: ['me'],
    url: '/auth/me',
    enabled: !!token
  })
  

  const loginMutation = useAppMutation<TLoginResponse, TLoginPayload>({
    url: '/auth/login'
  })

  const login = useCallback(
    async (payload: TLoginPayload) => {
      const res = await loginMutation.mutateAsync(payload)

      authStorage.setToken(res.data.token)
      console.log(res)

      queryClient.setQueryData<TApiResponse<{ user: TIUser }>>(
  ["me"],
  {
    success: true,
    message: "",
    data: {
      user: res.data.user,
    },
  }
);
      return res.data;
    },
    [loginMutation, queryClient]
  )

  const logout = useCallback(() => {
    authStorage.removeToken();

    window.location.href = '/auth/login'
  }, [])

  const value = useMemo(
    () => ({
      user: data?.data?.user ?? null,
      loading,
      isAuthenticated: !!data?.data?.user,
      login,
      logout,
      loginLoading: loginMutation.isPending,
    }),
    [data, loading, login, logout, loginMutation.isPending]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
