import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAppointments, deriveAppointmentId } from '../../features/appointments/api'
import Badge from '../../components/ui/Badge'

const Appointments = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['appointments'], queryFn: () => getAppointments() })
  if (isLoading) return <div>Loading…</div>
  if (error) return <div className="text-red-600">Failed to load appointments</div>
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Appointments</h1>
      {!data?.items?.length ? (
        <div className="rounded border bg-white p-4 text-sm text-gray-600">No appointments found.</div>
      ) : (
        <ul className="space-y-2">
          {data.items.map((a, idx) => {
            const start = a.startTime ? new Date(a.startTime) : null
            const end = a.endTime ? new Date(a.endTime) : null
            const when = start ? `${start.toLocaleString()}${end ? ` - ${end.toLocaleTimeString()}` : ''}` : '—'
            return (
              <li key={deriveAppointmentId(a, idx)} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">{a.reason || 'Appointment'}</div>
                  <div>
                    {a.isEmergency ? <Badge color="red">Emergency</Badge> : <Badge color="blue">Scheduled</Badge>}
                    {a.status && <Badge className="ml-2" color={a.status === 'booked' ? 'green' : 'gray'}>{a.status}</Badge>}
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-600">{when}</div>
                <div className="mt-1 grid grid-cols-1 gap-1 text-xs text-gray-700 sm:grid-cols-2 md:grid-cols-3">
                  <div><span className="text-gray-500">Student:</span> {a.studentName || a.studentId}</div>
                  <div><span className="text-gray-500">Counselor:</span> {a.counselorName || a.counselorId}</div>
                  <div><span className="text-gray-500">Institution:</span> {a.institutionName || a.institutionId}</div>
                </div>
                {a.notes && <div className="mt-1 text-xs text-gray-700"><span className="text-gray-500">Notes:</span> {a.notes}</div>}
                {a.screeningId && <div className="mt-1 text-xs text-gray-700"><span className="text-gray-500">Screening:</span> {a.screeningId}</div>}
              </li>
            )
          })}
        </ul>
      )}
      {/* TODO: Admin-only appointment creation/assignment */}
    </div>
  )
}

export default Appointments
