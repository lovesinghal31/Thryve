import React, { useState } from 'react'

const Tabs = ({ tabs, initial = 0, onChange }) => {
  const [idx, setIdx] = useState(initial)
  const change = (i) => {
    setIdx(i)
    onChange?.(i)
  }
  return (
    <div>
      <div className="mb-2 flex gap-2 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button key={t.key || i} onClick={() => change(i)} className={`-mb-px border-b-2 px-3 py-2 text-sm ${i === idx ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>{t.label}</button>
        ))}
      </div>
      <div>{tabs[idx]?.content}</div>
    </div>
  )
}

export default Tabs
