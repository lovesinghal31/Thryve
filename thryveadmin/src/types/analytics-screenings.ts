export interface Screening {
  id: string;
  userId: string;
  tool: string;
  riskLevel: string;
  status: string; // e.g. submitted, draft
  totalScore?: number;
  createdAt: string;
}

export interface ScreeningListResponse {
  items: Screening[];
  total: number;
  page: number;
  pages: number;
}

export interface ScreeningStatsResponse {
  period: { from: string; to: string };
  totalScreenings: number;
  submittedScreenings: number;
  completionRate: number; // 0..1
  averageTotalScore: number;
  totalDistribution: Record<string, number>;
  riskLevelDistribution: Record<string, number>;
}

export interface DailyScreeningCountsResponse {
  metric: string; // e.g. daily_screenings
  series: { date: string; value: number }[];
}

export interface RiskDistributionResponse {
  dimension: string; // riskLevel
  total: number;
  items: { key: string; label: string; value: number; pct: number }[];
}

export interface ToolUsageSummaryResponse {
  total: number;
  tools: { key: string; label: string; count: number; averageScore: number }[];
}
