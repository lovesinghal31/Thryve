import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '../../components/ui/Button'

const Resources = () => {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['resources', 'completed'],
    queryFn: async () => ({
      resources: [
        { _id: 'r1', title: 'Coping Skills 101', description: 'Quick guide to coping techniques', completed: false },
        { _id: 'r2', title: 'Mindfulness Basics', description: 'Intro to mindfulness exercises', completed: true },
      ],
    }),
  })

  const complete = useMutation({
    mutationFn: (id) => Promise.resolve({ success: true, id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] })
  })

  if (isLoading) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">Loading…</div>
  if (error) return <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-rose-300 backdrop-blur-xl">Failed to load resources</div>

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Resources</h1>
      <ul className="space-y-2">
        {(data?.resources || []).map((r) => (
          <li key={r._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-gray-300">{r.description}</div>
            </div>
            {!r.completed && <Button size="sm" onClick={() => complete.mutate(r._id)}>Mark Complete</Button>}
          </li>
        ))}
      </ul>
      {/* TODO: Admin-only resource CRUD in future */}
    </div>
  )
}

export default Resources
