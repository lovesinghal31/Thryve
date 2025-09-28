"use client";
import { useAdminDashboard } from '@/hooks/use-admin-dashboard';
import { MetricCards } from '@/components/dashboard/metric-cards';
import { RiskChart } from '@/components/dashboard/risk-chart';
import { ScreeningChart } from '@/components/dashboard/screening-chart';
import { EngagementMultiChart } from '@/components/dashboard/engagement-multi-chart';
import { AppointmentsWeeklyStatusChart } from '@/components/dashboard/appointments-weekly-status-chart';
import { FunnelChart } from '@/components/dashboard/funnel-chart';
import { RetentionHeatmap } from '@/components/dashboard/retention-heatmap';
import { CounselorLoadChart } from '@/components/dashboard/counselor-load-chart';
import { TopCounselors } from '@/components/dashboard/top-counselors';
import { ScoreTrendChart } from '@/components/dashboard/score-trend-chart';
import { ChatActivityChart } from '@/components/dashboard/chat-activity-chart';
import type { AdminDashboardData } from '@/types/dashboard-aggregate';

// Adapter helpers to map new aggregate structure to legacy components expecting simple metrics shape.
function extractLegacyMetrics(agg?: AdminDashboardData) {
  if (!agg) return undefined;
  const t = agg.summary.totals;
  return {
    totalUsers: t.totalUsers,
    activeUsersDaily: t.activeUsersDaily,
    activeUsersWeekly: t.activeUsersWeekly,
    activeUsersMonthly: t.activeUsersMonthly,
    newUsers: t.newUsers,
    returningUsers: t.returningUsers,
    riskLevelDistribution: Object.fromEntries(
      (agg.distributions.riskLevel?.items || []).map(i => [i.key, i.value || 0])
    ),
    screeningsByTool: Object.fromEntries(
      (agg.screeningTools.tools || []).map(tool => [tool.key, tool.count])
    ),
  } as any; // keeping loose until full refactor of components
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboard();
  const legacy = extractLegacyMetrics(data);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform KPIs and engagement metrics (aggregate format).</p>
      </div>
      {isError && <div className="text-sm text-red-600">{error.message}</div>}
      <MetricCards metrics={legacy} loading={isLoading} />
      <div className="grid gap-6 md:grid-cols-2">
        <RiskChart metrics={legacy} />
        <ScreeningChart metrics={legacy} />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <EngagementMultiChart data={data?.timeseries.engagement_multi} />
        <AppointmentsWeeklyStatusChart data={data?.appointmentsWeeklyStatus} />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FunnelChart data={data?.funnel} />
        <RetentionHeatmap data={data?.retention} />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <CounselorLoadChart distributions={data?.distributions} />
        <TopCounselors data={data?.topCounselors} />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ScoreTrendChart data={data?.scoreTrendByRisk} />
        <ChatActivityChart data={data?.chatActivity} />
      </div>
      {/* Charts complete for current aggregate dataset. */}
    </div>
  );
}
