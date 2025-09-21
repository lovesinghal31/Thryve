import { create } from 'zustand'

const STORAGE_KEY = 'admin_auth'

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null }
}
const save = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export const authStore = create((set, get) => ({
  user: load()?.user || null,
  accessToken: load()?.accessToken || null,
  role: load()?.role || null,
  isAuthenticated: !!(load()?.accessToken),

  setSession: ({ user, accessToken }) => {
    const s = {
      user,
      accessToken,
      role: user?.role || null,
      isAuthenticated: !!accessToken,
    }
    save(s)
    set(s)
  },

  setAccessToken: (token) => {
    const s = { ...get(), accessToken: token, isAuthenticated: !!token }
    save(s)
    set(s)
  },

  logout: async () => {
    const cleared = { user: null, accessToken: null, role: null, isAuthenticated: false }
    save(cleared)
    set(cleared)
  },
}))
