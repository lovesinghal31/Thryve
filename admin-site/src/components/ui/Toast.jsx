import React, { useEffect, useState } from 'react'

let pushToastHandler = null

export const pushToast = (toast) => {
  if (pushToastHandler) pushToastHandler(toast)
}

const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    pushToastHandler = (t) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, ...t }])
      const timeout = t.timeout ?? 3000
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), timeout)
    }
    return () => { pushToastHandler = null }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-md border px-3 py-2 text-sm shadow ${t.variant === 'error' ? 'border-red-300 bg-red-50 text-red-800' : 'border-green-300 bg-green-50 text-green-800'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

export default Toast
