import axios from 'axios'
import { authStore } from '../features/auth/authStore'

const baseURL = import.meta.env.VITE_API_BASE || ''

export const api = axios.create({
  baseURL,
  withCredentials: true, // allow cookies for refresh token if server uses httpOnly
})

let isRefreshing = false
let refreshPromise = null

api.interceptors.request.use((config) => {
  const { accessToken } = authStore.getState()
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { logout, setAccessToken } = authStore.getState()
    const original = error.config || {}

    // If no response or not 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    // Prevent infinite loop
    if (original.__isRetry) {
      await logout()
      window.location.href = '/admin/login'
      return Promise.reject(error)
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = api.post('/users/refresh-token')
          .then((res) => {
            const newToken = res?.data?.data?.accessToken || res?.data?.accessToken
            if (newToken) setAccessToken(newToken)
            return newToken
          })
          .finally(() => { isRefreshing = false })
      }

      const newToken = await refreshPromise
      // retry original request
      original.__isRetry = true
      original.headers = original.headers || {}
      if (newToken) original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch (e) {
      await logout()
      window.location.href = '/admin/login'
      return Promise.reject(e)
    }
  }
)
