// Types matching sample_admindasbhoard_data.json aggregate structure

export interface DashboardSummaryPeriod {
  range: string; // e.g. 2025-09-01/2025-09-27
  comparisonRange?: string;
}

export interface DashboardSummaryTotals {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  activeUsersDaily: number;
  activeUsersWeekly: number;
  activeUsersMonthly: number;
  averageSessionDurationSec: number;
  weeklyRetentionRate: number; // 0..1
  percentageUsersShowingImprovement: number; // 0..1
}

export interface DashboardSummaryFlags {
  highRiskFlags: number;
  emergencyEscalations: number;
}

export interface DashboardSummaryBlock {
  period: DashboardSummaryPeriod;
  totals: DashboardSummaryTotals;
  flags: DashboardSummaryFlags;
}

export interface SimpleTimePoint { date: string; value: number; }
export interface MultiSeriesPoint { date: string; value: number; }
export interface MultiSeriesEntry { key: string; label: string; color?: string; points: MultiSeriesPoint[] }

export interface DailyActiveUsersSeries {
  metric: string; // 'daily_active_users'
  granularity: 'day' | 'week' | 'month';
  series: SimpleTimePoint[];
}

export interface EngagementMultiSeries {
  granularity: 'day' | 'week' | 'month';
  series: MultiSeriesEntry[];
}

export interface TimeseriesBlock {
  daily_active_users?: DailyActiveUsersSeries;
  engagement_multi?: EngagementMultiSeries;
  [key: string]: unknown;
}

export interface DistributionItem { key: string; label: string; value?: number; [k: string]: unknown }
export interface DistributionBlock { dimension: string; period?: string; items: DistributionItem[]; total?: number }
export interface CounselorLoadItem extends DistributionItem { activeClients: number; openAppointments: number }

export interface DistributionsAggregate {
  riskLevel?: DistributionBlock;
  counselorLoad?: { dimension: string; items: CounselorLoadItem[] };
  [key: string]: unknown;
}

export interface AppointmentsWeeklyStatus {
  granularity: 'week';
  categories: string[]; // e.g. ['2025-W31']
  series: { key: string; label: string; values: number[] }[];
}

export interface FunnelStage { key: string; label: string; value: number }
export interface FunnelBlock { period: string; stages: FunnelStage[]; conversionRate: number }

export interface RetentionCohortWeek { weekOffset: number; rate: number }
export interface RetentionCohort { cohort: string; start: string; size: number; weeks: RetentionCohortWeek[] }
export interface RetentionBlock { metric: string; cohorts: RetentionCohort[] }

export interface ScreeningToolSeverity { range: string; count: number }
export interface ScreeningToolEntry { key: string; label: string; count: number; avgScore: number; severityDistribution?: ScreeningToolSeverity[] }
export interface ScreeningToolsBlock { period: string; summary: { totalScreenings: number; averageCompletionRate: number }; tools: ScreeningToolEntry[] }

export interface ChatActivityPoint { timestamp: string; messages: number; uniqueUsers: number }
export interface ChatActivityBlock { granularity: string; timezone: string; data: ChatActivityPoint[]; peakHour?: string }

export interface TopCounselorItem { id: string; label: string; value: number; avgSatisfaction?: number }
export interface TopCounselorsBlock { metric: string; period: string; items: TopCounselorItem[] }

export interface ScoreTrendSeriesPoint { week: string; avgScore: number }
export interface ScoreTrendSeries { riskLevel: string; points: ScoreTrendSeriesPoint[] }
export interface ScoreTrendByRiskBlock { tool: string; granularity: string; series: ScoreTrendSeries[] }

export interface AggregateExampleRefs {
  dateRange: { from: string; to: string };
  summaryRef: string;
  engagementTimeseriesRef: string;
  riskDistributionRef: string;
  appointmentsWeeklyStatusRef: string;
  funnelRef: string;
  retentionRef: string;
  topCounselorsRef: string;
}

export interface AdminDashboardAggregate {
  summary: DashboardSummaryBlock;
  timeseries: TimeseriesBlock;
  distributions: DistributionsAggregate;
  appointmentsWeeklyStatus: AppointmentsWeeklyStatus;
  funnel: FunnelBlock;
  retention: RetentionBlock;
  screeningTools: ScreeningToolsBlock;
  chatActivity: ChatActivityBlock;
  topCounselors: TopCounselorsBlock;
  scoreTrendByRisk: ScoreTrendByRiskBlock;
  aggregateExample?: AggregateExampleRefs;
  _meta?: { generatedAt: string; notes?: string; version: number };
}

export type AdminDashboardData = AdminDashboardAggregate; // alias
