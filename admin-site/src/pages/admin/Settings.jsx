import React from 'react'

const Settings = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-white">Settings</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="text-sm font-medium text-white">Roles & Permissions</div>
          <p className="mt-1 text-sm text-gray-300">Configure access levels for Admin, Counselor, and Student.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="text-sm font-medium text-white">System Configuration</div>
          <p className="mt-1 text-sm text-gray-300">Institutes, notifications, and security settings.</p>
        </div>
      </div>
    </div>
  )
}

export default Settings
