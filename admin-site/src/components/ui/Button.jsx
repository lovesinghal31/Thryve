import React from 'react'

const variants = {
  primary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
  secondary: 'bg-white/5 hover:bg-white/10 text-gray-100 border border-white/10',
  danger: 'bg-red-600/90 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-white/5 text-gray-100',
}

const sizes = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4.5 py-2.5 text-base',
}

const Button = ({ children, className = '', variant = 'primary', size = 'md', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
