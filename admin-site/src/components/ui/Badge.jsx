import React from 'react'

const colorMap = {
  gray: 'bg-white/10 text-gray-100 border border-white/10',
  blue: 'bg-sky-500/20 text-sky-300',
  green: 'bg-emerald-500/20 text-emerald-300',
  red: 'bg-rose-500/20 text-rose-300',
  yellow: 'bg-amber-500/20 text-amber-200',
}

const Badge = ({ children, color = 'gray', className = '' }) => (
  <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${colorMap[color]} ${className}`}>{children}</span>
)

export default Badge
