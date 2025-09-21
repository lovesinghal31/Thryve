import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, readAllNotifications, readNotification } from '../../features/notifications/api'
import Button from '../../components/ui/Button'

const Notifications = () => {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications })
  const readAll = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] })
  })
  const readOne = useMutation({
    mutationFn: (id) => readNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] })
  })

  if (isLoading) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">Loading…</div>
  if (error) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-rose-300 backdrop-blur-xl">Failed to load notifications</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button variant="secondary" onClick={() => readAll.mutate()}>Mark all as read</Button></div>
      <div className="space-y-2">
        {(data?.notifications || []).map((n) => (
          <div
            key={n._id}
            className={`rounded-xl border p-3 backdrop-blur-xl ${n.read ? 'border-white/10 bg-white/5' : 'border-blue-400/20 bg-blue-400/10'}`}
          >
            <div className="text-sm font-medium text-white">{n.title || 'Notification'}</div>
            <div className="text-sm text-gray-300">{n.message}</div>
            {!n.read && (
              <div className="mt-2"><Button size="sm" onClick={() => readOne.mutate(n._id)}>Mark as read</Button></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
