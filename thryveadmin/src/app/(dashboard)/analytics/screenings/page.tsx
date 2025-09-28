// 1. backend api http://localhost:8000/api/v1/admin/analytics/screenings
// endpoints (all are get):
// - / (const { page = 1, limit = 25, institutionId, tool, riskLevel, status, studentId } = req.query;) -> listScreenings
// return data format { items: Screening[], total, page, pages }
// - /stats (const { institutionId } = req.query;) -> getScreeningStats
// return data format { period: {from: string, to: string},totalScreenings: number,submittedScreenings: number,completionRate: number,averageTotalScore: number,totalDistribution: {},riskLevelDistribution: {} }
// - /timeseries/daily (const { days = 14, institutionId } = req.query;) -> getDailyScreeningCounts
// return data format { metric: string,series: [{ date: string, value: number }] }
// - /distribution/risk (const { institutionId,tool } = req.query;) -> getRiskLevelDistribution
// return data format { dimension: string, total: number, items: [{key: string,lable: string,value: number,pct: number}] }
// - /tools/summary (const { institutionId } = req.query;) -> getToolUsageSummary
// return data format {total: number,tools: [{key: string,label: string,count: number,averageScore: number}]}

// to implement these in this page.tsx
// use these api and endpoints to fetch data from backend using axios and react-query and then display them using recharts and other components
// use the existing components like RiskChart and ScreeningChart to display the data
// use Card, CardHeader, CardTitle, CardContent from '@/components/ui/card' to display the charts in a card layout
// use the existing styles and classes used in other components for consistency
// make sure to handle loading and error states while fetching data from backend
// make sure to type the data properly using TypeScript interfaces
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { ScreeningChart } from "@/components/dashboard/screening-chart";
import {
  useScreeningList,
  useScreeningStats,
  useScreeningDaily,
  useRiskDistribution,
  useToolSummary,
} from "@/hooks/use-screenings-analytics";
import { useState } from "react";

// Simple inline chart for daily screenings (reuse ScreeningChart structure needs tool mapping -> we'll build quick component here)
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function DailyScreeningsChart({
  series,
}: {
  series?: { date: string; value: number }[];
}) {
  if (!series || series.length === 0)
    return <div className="text-sm text-muted-foreground">No timeseries</div>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart
        data={series}
        margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(d) => d.slice(5)}
        />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function ScreeningsAnalyticsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const list = useScreeningList({ page, limit: pageSize });
  const stats = useScreeningStats();
  const daily = useScreeningDaily(14);
  const riskDist = useRiskDistribution();
  const toolSummary = useToolSummary();

  const riskMetrics = {
    riskLevelDistribution: Object.fromEntries(
      (riskDist.data?.items || []).map((i) => [i.key, i.value])
    ),
  };
  const screeningByToolMetrics = {
    screeningsByTool: Object.fromEntries(
      (toolSummary.data?.tools || []).map((t) => [t.key, t.count])
    ),
  };

  const totalPages = list.data?.pages || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Screenings Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Insights across screening activity, risk levels and tool usage.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Total Screenings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats.isLoading ? "…" : stats.data?.totalScreenings ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats.isLoading ? "…" : stats.data?.submittedScreenings ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats.isLoading
                ? "…"
                : ((stats.data?.completionRate || 0) * 100).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Avg Total Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats.isLoading
                ? "…"
                : stats.data?.averageTotalScore?.toFixed(1) ?? "0.0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-4 rounded-lg">
          <div className="mb-2 text-sm font-medium">Daily Screenings (14d)</div>
          {daily.isError ? (
            <div className="text-sm text-red-600">Error loading</div>
          ) : daily.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : (
            <DailyScreeningsChart series={daily.data?.series} />
          )}
        </div>
        <RiskChart metrics={riskMetrics} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ScreeningChart metrics={screeningByToolMetrics} />
        {/* Tool Usage Table */}
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tool Usage</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2">Tool</th>
                  <th className="px-3 py-2">Count</th>
                  <th className="px-3 py-2">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {toolSummary.isLoading && (
                  <tr>
                    <td className="px-3 py-2" colSpan={3}>
                      Loading…
                    </td>
                  </tr>
                )}
                {toolSummary.isError && (
                  <tr>
                    <td className="px-3 py-2 text-red-600" colSpan={3}>
                      Error
                    </td>
                  </tr>
                )}
                {(toolSummary.data?.tools || []).map((t, idx) => {
                  const avg = typeof t.averageScore === 'number' && !Number.isNaN(t.averageScore) ? t.averageScore.toFixed(1) : '—';
                  return (
                    <tr key={t.key || `tool-${idx}`} className="border-t border-border/50">
                      <td className="px-3 py-2 font-medium">{t.label}</td>
                      <td className="px-3 py-2">{t.count}</td>
                      <td className="px-3 py-2">{avg}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* List Table */}
      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Screenings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Tool</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.isLoading && (
                <tr>
                  <td className="px-3 py-4" colSpan={7}>
                    Loading…
                  </td>
                </tr>
              )}
              {list.isError && (
                <tr>
                  <td className="px-3 py-4 text-red-600" colSpan={7}>
                    Failed to load
                  </td>
                </tr>
              )}
              {(list.data?.items || []).map((row, idx) => (
                <tr key={row.id || `row-${idx}`} className="border-t border-border/50 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                  <td className="px-3 py-2">{row.userId}</td>
                  <td className="px-3 py-2">{row.tool}</td>
                  <td className="px-3 py-2 capitalize">{row.riskLevel}</td>
                  <td className="px-3 py-2 capitalize">{row.status}</td>
                  <td className="px-3 py-2">{row.totalScore ?? "-"}</td>
                  <td className="px-3 py-2 text-xs">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(list.data?.items?.length || 0) === 0 &&
                !list.isLoading &&
                !list.isError && (
                  <tr>
                    <td className="px-3 py-4 text-muted-foreground" colSpan={7}>
                      No screenings found
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-border/50 text-xs">
            <span>
              Page {list.data?.page || page} / {totalPages}
            </span>
            <div className="space-x-2">
              <button
                disabled={page <= 1 || list.isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded border disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages || list.isFetching}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded border disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
