import React from 'react'
import Button from './Button'
import { authStore } from '../../features/auth/authStore'
import { LogOut, Shield } from 'lucide-react'

const Topbar = () => {
  const handleLogout = async () => {
    await authStore.getState().logout()
    window.location.href = '/admin/login'
  }
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-white/5 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 font-semibold">
        <Shield size={18} />
        <span>Admin Panel</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">{authStore.getState().user?.username || 'Admin'}</span>
        <Button variant="secondary" size="sm" onClick={handleLogout} className="inline-flex items-center gap-1">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Topbar
