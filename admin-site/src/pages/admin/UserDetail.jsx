import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUserActivitySummary } from '../../features/users/api'

const UserDetail = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({ queryKey: ['user', id, 'activity'], queryFn: () => getUserActivitySummary(id) })

  if (isLoading) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">Loading…</div>
  if (error) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-rose-300 backdrop-blur-xl">Failed to load user activity</div>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-white">User Activity Summary</h1>
      <pre className="overflow-auto rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-200 backdrop-blur-xl">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default UserDetail
