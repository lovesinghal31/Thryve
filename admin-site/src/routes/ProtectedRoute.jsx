import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '../features/auth/authStore'
import { useStore } from 'zustand'

const ProtectedRoute = ({ allowRoles = ['admin'] }) => {
  const { isAuthenticated, role } = useStore(authStore)
  if (!isAuthenticated || !allowRoles.includes(role)) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
