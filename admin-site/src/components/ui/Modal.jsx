import React from 'react'
import Button from './Button'

const Modal = ({ title, open, onClose, onConfirm, confirmText = 'Confirm', children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-xl backdrop-blur-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-white">✕</button>
        </div>
        <div className="mb-4 text-sm text-gray-200">{children}</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
