import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from '../ui/AdminLayout'

import Login from '../pages/admin/Login'
import Signup from '../pages/admin/Signup'
import Dashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import UserDetail from '../pages/admin/UserDetail'
import Institutes from '../pages/admin/Institutes'
import Resources from '../pages/admin/Resources'
import Appointments from '../pages/admin/Appointments'
import Screenings from '../pages/admin/Screenings'
import Notifications from '../pages/admin/Notifications'
import Tasks from '../pages/admin/Tasks'
import Settings from '../pages/admin/Settings'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/admin/login" replace /> },
  { path: '/admin/login', element: <Login /> },
  { path: '/admin/signup', element: <Signup /> },
  {
    path: '/admin',
    element: <ProtectedRoute allowRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'users', element: <Users /> },
          { path: 'users/:id', element: <UserDetail /> },
          { path: 'institutes', element: <Institutes /> },
          { path: 'resources', element: <Resources /> },
          { path: 'appointments', element: <Appointments /> },
          { path: 'screenings', element: <Screenings /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
])

export default router
