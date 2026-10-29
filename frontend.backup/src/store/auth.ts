import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  username: string | null
  btc_address: string | null
  wallet_connected: boolean
  onboarded: boolean
}

interface AuthStore {
  token:    string | null
  user:     User | null
  setAuth:  (token: string, user: User) => void
  setUser:  (user: Partial<User>) => void
  logout:   () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user:  null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (partial) => set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),
      logout:  () => set({ token: null, user: null }),
    }),
    { name: 'btcov-auth' }
  )
)
