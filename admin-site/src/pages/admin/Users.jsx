import React, { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, revokeSessions } from '../../features/users/api'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { pushToast } from '../../components/ui/Toast'

const Users = () => {
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [confirmUser, setConfirmUser] = useState(null)
  const qc = useQueryClient()

  const params = useMemo(() => ({ role: role || undefined, search: search || undefined }), [role, search])
  const { data, isLoading, error } = useQuery({ queryKey: ['users', params], queryFn: () => getUsers(params) })

  const mutation = useMutation({
    mutationFn: (id) => revokeSessions(id),
    onSuccess: () => {
      pushToast({ message: 'Sessions revoked' })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (e) => pushToast({ message: e?.response?.data?.message || 'Failed to revoke', variant: 'error' })
  })

  const columns = [
    { key: 'username', title: 'Username' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    {
      key: 'institute',
      title: 'Institute',
      render: (_v, row) => row.institute?.name || row.institute?.title || row.instituteName || row.institutionName || row.institutionId || '—',
    },
    { key: 'createdAt', title: 'Created', render: (v) => (v ? new Date(v).toLocaleString() : '—') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <Input label="Search" placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)} className="max-w-[200px]">
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="counselor">Counselor</option>
          <option value="staff">Staff</option>
          <option value="student">Student</option>
        </Select>
        <Button variant="secondary" onClick={() => { setRole(''); setSearch('') }}>Reset</Button>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">Loading…</div>
      )}
      {error && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-rose-300 backdrop-blur-xl">Failed to load users</div>
      )}

      <DataTable
        columns={columns}
        data={data?.users || []}
        renderActions={(row) => (
          <Button variant="danger" size="sm" onClick={() => setConfirmUser(row)}>Revoke Sessions</Button>
        )}
        empty={isLoading ? 'Loading…' : 'No users found'}
      />

      <Modal
        title="Revoke Sessions?"
        open={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        onConfirm={() => { mutation.mutate(confirmUser._id); setConfirmUser(null) }}
        confirmText={mutation.isPending ? 'Revoking…' : 'Confirm'}
      >
        This will log the user out from all devices.
      </Modal>
    </div>
  )
}

export default Users
