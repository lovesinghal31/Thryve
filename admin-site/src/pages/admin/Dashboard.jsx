import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminDashboard } from '../../features/dashboard/api'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/ui/ChartCard'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts'

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#22c55e', '#a78bfa']

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: getAdminDashboard })

  // Build derived datasets without hooks to avoid hook order issues with early returns
  const kpis = [
    { title: 'Institute', value: data?.instituteName || '—' },
    { title: 'Total Users', value: data?.totalUsers ?? 0 },
    { title: 'New Users', value: data?.newUsers ?? 0 },
    { title: 'Returning Users', value: data?.returningUsers ?? 0 },
  ]

  const activityBars = [
    { name: 'Daily', value: data?.activeUsersDaily ?? 0 },
    { name: 'Weekly', value: data?.activeUsersWeekly ?? 0 },
    { name: 'Monthly', value: data?.activeUsersMonthly ?? 0 },
  ]

  const screeningsByTool = Object.entries(data?.screeningsByTool || {}).map(([k, v]) => ({ name: k, value: v }))

  const riskLevelDistribution = Object.entries(data?.riskLevelDistribution || {}).map(([k, v]) => ({ name: k === 'null' ? 'Unknown' : k, value: v }))

  const appointmentsByStatus = Object.entries(data?.appointmentsByStatus || {}).map(([k, v]) => ({ name: k, value: v }))

  const tooltipProps = {
    wrapperStyle: { outline: 'none' },
    contentStyle: {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 8,
      backdropFilter: 'blur(8px)',
      color: '#fff',
    },
    labelStyle: { color: '#fff' },
    itemStyle: { color: '#fff' },
    cursor: { fill: 'rgba(255,255,255,0.06)' },
  }

  const axisCommon = {
    axisLine: false,
    tickLine: false,
    stroke: 'rgba(255,255,255,0.35)',
    tick: { fill: '#E5E7EB', fontSize: 12 },
  }

  if (isLoading) return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-24 animate-pulse rounded bg-gray-200" />))}</div>
  if (error) return <div className="text-red-600">Failed to load dashboard</div>

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {kpis.map((k) => (<StatCard key={k.title} title={k.title} value={k.value} />))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Active Users (Daily/Weekly/Monthly)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityBars}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" {...axisCommon} />
              <YAxis {...axisCommon} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="value" fill="#2563eb" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Screenings by Tool">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={screeningsByTool}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" {...axisCommon} />
              <YAxis {...axisCommon} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="value" fill="#16a34a" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Level Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskLevelDistribution} dataKey="value" nameKey="name" outerRadius={100}>
                {riskLevelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Appointments by Status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appointmentsByStatus}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" {...axisCommon} />
              <YAxis {...axisCommon} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="value" fill="#f59e0b" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Avg Session Duration (mins)" value={data?.averageSessionDuration ?? 0} />
        <StatCard title="Avg Wait Time (mins)" value={data?.averageWaitTimeForAppointment ?? 0} />
        <StatCard title="Improvement (%)" value={data?.percentageUsersShowingImprovement ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Screenings" value={data?.totalScreenings ?? 0} />
        <StatCard title="High Risk Flags" value={data?.highRiskFlags ?? 0} />
        <StatCard title="Completion Rate (%)" value={data?.screeningCompletionRate ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Appointments" value={data?.totalAppointments ?? 0} />
        <StatCard title="Conversion Rate (%)" value={Number.parseFloat(data?.appointmentConversionRate || 0).toFixed(2)} />
        <StatCard title="Emergency Escalations" value={data?.emergencyEscalations ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Resources" value={data?.totalResources ?? 0} />
        <StatCard title="Total Chat Rooms" value={data?.totalChatRooms ?? 0} />
        <StatCard title="Avg Messages/User" value={Number.parseFloat(data?.averageMessagesPerUser || 0).toFixed(2)} />
      </div>

      <div>
        <StatCard title="Weekly Retention Rate (%)" value={data?.weeklyRetentionRate ?? 0} />
      </div>
    </div>
  )
}

export default Dashboard
