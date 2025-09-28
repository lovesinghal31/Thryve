"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentsWeeklyStatusChart } from '@/components/dashboard/appointments-weekly-status-chart';
import { CounselorLoadChart } from '@/components/dashboard/counselor-load-chart';
import { FunnelChart } from '@/components/dashboard/funnel-chart';
import {
	useAppointmentList,
	useAppointmentStatusSummary,
	useWeeklyAppointmentCounts,
	useCounselorLoad,
	useAppointmentFunnel
} from '@/hooks/use-appointments-analytics';

// Adapter to match FunnelChart prop (it expects FunnelBlock shape similar to aggregate):
function toFunnelBlock(f?: any) {
	if (!f) return undefined;
	// Provide a synthetic period string to satisfy FunnelBlock type
	const period = f.period?.from && f.period?.to ? `${f.period.from}/${f.period.to}` : 'period';
	return { stages: f.stages, conversionRate: f.conversionRate, period };
}

export default function AppointmentsAnalyticsPage() {
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const list = useAppointmentList({ page, limit: pageSize });
	const statuses = useAppointmentStatusSummary();
	const weekly = useWeeklyAppointmentCounts(8);
	const load = useCounselorLoad();
	const funnel = useAppointmentFunnel();

	const totalPages = list.data?.pages || 1;

	const total = statuses.data?.total || 0;
	const completed = statuses.data?.statuses.find(s => s.status === 'completed')?.count || 0;
	const cancelled = statuses.data?.statuses.find(s => s.status === 'cancelled')?.count || 0;
	const emergency = statuses.data?.statuses.reduce((a, s) => a + (s.emergencies || 0), 0) || 0;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Appointments Analytics</h1>
				<p className="text-sm text-muted-foreground">Operational insight across appointment lifecycle, counselor load and funnel performance.</p>
			</div>

			{/* KPI cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-xs">Total Appointments</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{statuses.isLoading ? '…' : total}</div></CardContent></Card>
				<Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-xs">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{statuses.isLoading ? '…' : completed}</div></CardContent></Card>
				<Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-xs">Cancelled</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{statuses.isLoading ? '…' : cancelled}</div></CardContent></Card>
				<Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-xs">Emergencies</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{statuses.isLoading ? '…' : emergency}</div></CardContent></Card>
			</div>

			{/* Charts Row 1 */}
			<div className="grid gap-6 md:grid-cols-2">
				<AppointmentsWeeklyStatusChart data={weekly.data as any} />
			<CounselorLoadChart distributions={{ counselorLoad: { dimension: 'counselor', items: (load.data?.items || []).map((i, idx) => ({ key: i.counselorId || `c-${idx}`, label: i.username, activeClients: i.upcoming, openAppointments: i.completed30d })) } }} />
			</div>

			{/* Funnel */}
			<FunnelChart data={toFunnelBlock(funnel.data)} />

			{/* Status distribution table */}
			<Card className="glass">
				<CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader>
				<CardContent className="p-0">
					<table className="w-full text-sm">
						<thead><tr className="text-left text-xs text-muted-foreground"><th className="px-3 py-2">Status</th><th className="px-3 py-2">Count</th><th className="px-3 py-2">% of Total</th><th className="px-3 py-2">Emergencies</th></tr></thead>
						<tbody>
							{statuses.isLoading && <tr><td className="px-3 py-3" colSpan={4}>Loading…</td></tr>}
							{statuses.isError && <tr><td className="px-3 py-3 text-red-600" colSpan={4}>Error</td></tr>}
							{(statuses.data?.statuses || []).map((s, idx) => (
								<tr key={s.status || `s-${idx}`} className="border-t border-border/50">
									<td className="px-3 py-2 capitalize">{s.status}</td>
									<td className="px-3 py-2">{s.count}</td>
									<td className="px-3 py-2">{(s.pct).toFixed(1)}%</td>
									<td className="px-3 py-2">{s.emergencies}</td>
								</tr>
							))}
							{(statuses.data?.statuses?.length || 0) === 0 && !statuses.isLoading && !statuses.isError && <tr><td className="px-3 py-3 text-muted-foreground" colSpan={4}>No data</td></tr>}
						</tbody>
					</table>
				</CardContent>
			</Card>

			{/* Appointments list */}
			<Card className="glass">
				<CardHeader className="pb-2"><CardTitle className="text-sm">Recent Appointments</CardTitle></CardHeader>
				<CardContent className="p-0">
					<table className="w-full text-sm">
						<thead><tr className="text-left text-xs text-muted-foreground"><th className="px-3 py-2">ID</th><th className="px-3 py-2">Student</th><th className="px-3 py-2">Counselor</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Emergency</th><th className="px-3 py-2">Scheduled For</th><th className="px-3 py-2">Created</th></tr></thead>
						<tbody>
							{list.isLoading && <tr><td className="px-3 py-4" colSpan={7}>Loading…</td></tr>}
							{list.isError && <tr><td className="px-3 py-4 text-red-600" colSpan={7}>Failed to load</td></tr>}
							{(list.data?.items || []).map((a, idx) => (
								<tr key={a.id || `row-${idx}`} className="border-t border-border/50 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
									<td className="px-3 py-2 font-mono text-xs">{a.id}</td>
									<td className="px-3 py-2">{a.studentId}</td>
									<td className="px-3 py-2">{a.counselorId}</td>
									<td className="px-3 py-2 capitalize">{a.status}</td>
									<td className="px-3 py-2">{a.isEmergency ? 'Yes' : 'No'}</td>
									<td className="px-3 py-2 text-xs">{new Date(a.scheduledFor).toLocaleString()}</td>
									<td className="px-3 py-2 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
								</tr>
							))}
							{(list.data?.items?.length || 0) === 0 && !list.isLoading && !list.isError && <tr><td className="px-3 py-4 text-muted-foreground" colSpan={7}>No appointments found</td></tr>}
						</tbody>
					</table>
					<div className="flex items-center justify-between px-3 py-2 border-t border-border/50 text-xs">
						<span>Page {list.data?.page || page} / {totalPages}</span>
						<div className="space-x-2">
							<button disabled={page <= 1 || list.isFetching} onClick={() => setPage(p => Math.max(1, p-1))} className="px-2 py-1 rounded border disabled:opacity-40">Prev</button>
							<button disabled={page >= totalPages || list.isFetching} onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-2 py-1 rounded border disabled:opacity-40">Next</button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


