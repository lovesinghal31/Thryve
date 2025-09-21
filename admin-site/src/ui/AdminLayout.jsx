import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
import Topbar from '../components/ui/Topbar'

const AdminLayout = () => {
  return (
    <div className="min-h-screen text-gray-200">
      <div className="flex">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width)' }}>
          <Topbar />
          <main className="p-4">
            <div className="mx-auto max-w-7xl space-y-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
