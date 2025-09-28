"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { EngagementMultiSeries } from '@/types/dashboard-aggregate';

interface EngagementMultiChartProps { data?: EngagementMultiSeries }

// Pivot series array-of-series shape into recharts friendly array-of-rows by date
function pivot(data?: EngagementMultiSeries) {
  if (!data) return [] as any[];
  const dateSet = new Set<string>();
  data.series.forEach(s => s.points.forEach(p => dateSet.add(p.date)));
  const dates = Array.from(dateSet).sort();
  return dates.map(date => {
    const row: Record<string, any> = { date };
    data.series.forEach(s => {
      const point = s.points.find(p => p.date === date);
      row[s.key] = point ? point.value : null;
    });
    return row;
  });
}

export function EngagementMultiChart({ data }: EngagementMultiChartProps) {
  const chartData = pivot(data);
  const hasData = chartData.length > 0 && (data?.series?.length || 0) > 0;

  return (
    <Card className="glass glass-hover">
      <CardHeader>
        <CardTitle>User Engagement (Multi-Series)</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 320 }}>
        {!hasData ? (
          <div className="text-sm text-muted-foreground">No engagement data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickFormatter={d => d.slice(5)} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip labelFormatter={(l: any) => `Date: ${l}`} />
              <Legend />
              {data!.series.map(s => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color || '#6366f1'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
