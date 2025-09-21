import React, { useMemo, useState } from 'react'

const DataTable = ({ columns, data, renderActions, empty = 'No data', className = '', pageSize = 10 }) => {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sortKey) return data
    const copy = [...data]
    copy.sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va == null && vb == null) return 0
      if (va == null) return -1
      if (vb == null) return 1
      if (typeof va === 'number' && typeof vb === 'number') return va - vb
      return String(va).localeCompare(String(vb))
    })
    if (sortDir === 'desc') copy.reverse()
    return copy
  }, [data, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = sorted.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  <button className="flex items-center gap-1" onClick={() => toggleSort(c.key)}>
                    {c.title}
                    {sortKey === c.key && <span>{sortDir === 'asc' ? '▲' : '▼'}</span>}
                  </button>
                </th>
              ))}
              {renderActions && <th className="px-3 py-2"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {current.length === 0 && (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-4 text-center text-sm text-gray-400">{empty}</td>
              </tr>
            )}
            {current.map((row) => (
              <tr key={row.id || row._id} className="hover:bg-white/5">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 text-sm text-gray-100">{c.render ? c.render(row[c.key], row) : row[c.key]}</td>
                ))}
                {renderActions && (
                  <td className="px-3 py-2 text-right">{renderActions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
        <div>Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button className="rounded border border-white/20 bg-white/10 px-2 py-1 text-white transition hover:bg-white/15 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <button className="rounded border border-white/20 bg-white/10 px-2 py-1 text-white transition hover:bg-white/15 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
