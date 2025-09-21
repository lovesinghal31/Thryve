import React from 'react'

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <label className="block w-full">
      {label && <span className="mb-1 block text-sm font-medium text-gray-200">{label}</span>}
      <input
        ref={ref}
        className={`w-full rounded-md border ${error ? 'border-rose-500/60' : 'border-white/10'} bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 outline-none backdrop-blur-xl transition focus:border-blue-400/60 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  )
})

export default Input
