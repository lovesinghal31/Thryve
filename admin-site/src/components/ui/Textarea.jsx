import React from 'react'

const Textarea = React.forwardRef(({ label, error, className = '', rows = 4, ...props }, ref) => (
  <label className="block w-full">
    {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
))

export default Textarea
