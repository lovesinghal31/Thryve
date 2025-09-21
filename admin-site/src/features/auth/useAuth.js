import { useCallback } from 'react'
import { useStore } from 'zustand'
import { authStore } from './authStore'

// All auth calls are stubbed to use local dummy data only
const DUMMY_ADMIN = {
  _id: 'admin-0001',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
}
const DUMMY_TOKEN = 'dummy-access-token'

export const useAuth = () => {
  const state = useStore(authStore)

  const login = useCallback(async (_payload) => {
    const user = DUMMY_ADMIN
    const accessToken = DUMMY_TOKEN
    authStore.getState().setSession({ user, accessToken })
    return { user, accessToken }
  }, [])

  const registerWithOtp = useCallback(async (_payload) => {
    // simulate success
    return { success: true }
  }, [])

  const verifyOtp = useCallback(async (_payload) => {
    const user = DUMMY_ADMIN
    const accessToken = DUMMY_TOKEN
    authStore.getState().setSession({ user, accessToken })
    return { user, accessToken }
  }, [])

  const changePassword = useCallback(async (_payload) => {
    return { success: true }
  }, [])

  const forgotPassword = useCallback(async (_payload) => {
    return { success: true }
  }, [])

  const resetPassword = useCallback(async (_payload) => {
    return { success: true }
  }, [])

  return {
    ...state,
    login,
    registerWithOtp,
    verifyOtp,
    changePassword,
    forgotPassword,
    resetPassword,
  }
}
