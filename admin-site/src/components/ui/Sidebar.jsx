import React from 'react'
import { NavLink } from 'react-router-dom'
import { authStore } from '../../features/auth/authStore'
import { useStore } from 'zustand'
import { LayoutDashboard, Users, Building2, CalendarDays, ClipboardList, BookOpen, Bell, ListChecks, Settings } from 'lucide-react'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', Icon: Users },
  { to: '/admin/institutes', label: 'Institutes', Icon: Building2 },
  { to: '/admin/appointments', label: 'Appointments', Icon: CalendarDays },
  { to: '/admin/screenings', label: 'Screenings', Icon: ClipboardList },
  { to: '/admin/resources', label: 'Resources', Icon: BookOpen },
  { to: '/admin/notifications', label: 'Notifications', Icon: Bell },
  { to: '/admin/tasks', label: 'Tasks', Icon: ListChecks },
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
]

const Sidebar = () => {
  const { user } = useStore(authStore)
  return (
    <aside
      className="fixed left-0 top-0 h-full border-r border-white/10 bg-white/5 backdrop-blur-xl"
      style={{ width: 'var(--sidebar-width)' }}
    >
      <div className="border-b border-white/10 p-4">
        <div className="text-xl font-bold tracking-tight">Admin</div>
        <div className="text-xs text-gray-400">{user?.email || '—'}</div>
      </div>
      <nav className="p-2">
        {nav.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
