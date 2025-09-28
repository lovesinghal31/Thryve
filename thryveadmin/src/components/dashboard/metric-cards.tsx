"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Accept a loose shape now (aggregate adapter passes subset of fields)
interface LightweightMetricsShape {
  totalUsers?: number;
  activeUsersDaily?: number;
  activeUsersWeekly?: number;
  activeUsersMonthly?: number;
  newUsers?: number;
  returningUsers?: number;
  [k: string]: any;
}
interface MetricCardsProps { metrics?: LightweightMetricsShape; loading?: boolean; }

const primaryMetrics: { key: keyof LightweightMetricsShape; label: string }[] = [
  { key: 'totalUsers', label: 'Total Users' },
  { key: 'activeUsersDaily', label: 'Active (Daily)' },
  { key: 'activeUsersWeekly', label: 'Active (Weekly)' },
  { key: 'activeUsersMonthly', label: 'Active (Monthly)' },
  { key: 'newUsers', label: 'New Users' },
  { key: 'returningUsers', label: 'Returning Users' },
];

export function MetricCards({ metrics, loading }: MetricCardsProps) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {primaryMetrics.map(m => (
        <Card key={String(m.key)} className="overflow-hidden glass glass-hover">
          <CardHeader className="py-2 px-3"><CardTitle className="text-xs font-medium tracking-wide text-muted-foreground">{m.label}</CardTitle></CardHeader>
          <CardContent className="py-2 px-3">
            <div className="text-2xl font-semibold">
              {loading ? '…' : (metrics?.[m.key] as number | undefined) ?? 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
