import React from 'react'
import { useQuery } from '@tanstack/react-query'

const Screenings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['screenings'],
    queryFn: async () => ({
      screenings: [
        { _id: 's1', tool: 'PHQ-9', riskLevel: 'medium', createdAt: new Date().toISOString() },
        { _id: 's2', tool: 'GAD-7', riskLevel: 'high', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ],
    }),
  })
  if (isLoading) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">Loading…</div>
  if (error) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-rose-300 backdrop-blur-xl">Failed to load screenings</div>
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Screenings</h1>
      <ul className="space-y-2">
        {(data?.screenings || []).map((s) => (
          <li key={s._id} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <div className="text-sm text-white">{s.tool} — {s.riskLevel}</div>
            <div className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {/* TODO: Admin-only moderation exports */}
    </div>
  )
}

export default Screenings
