"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScoreTrendByRiskBlock } from '@/types/dashboard-aggregate';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ScoreTrendChartProps { data?: ScoreTrendByRiskBlock }

const COLORS: Record<string,string> = { low: '#10b981', moderate: '#f59e0b', high: '#ef4444', critical: '#8b5cf6' };

function pivot(data?: ScoreTrendByRiskBlock) {
  if (!data) return [] as any[];
  const weekSet = new Set<string>();
  data.series.forEach(s => s.points.forEach(p => weekSet.add(p.week)));
  const weeks = Array.from(weekSet).sort();
  return weeks.map(week => {
    const row: Record<string, any> = { week };
    data.series.forEach(s => {
      const pt = s.points.find(p => p.week === week);
      row[s.riskLevel] = pt ? pt.avgScore : null;
    });
    return row;
  });
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const chartData = pivot(data);
  const has = chartData.length > 0;
  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>{data ? `${data.tool.toUpperCase()} Score Trend by Risk` : 'Score Trend'}</CardTitle></CardHeader>
      <CardContent style={{ height: 320 }}>
        {!has ? <div className="text-sm text-muted-foreground">No score trend data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              {data!.series.map(s => (
                <Line key={s.riskLevel} type="monotone" dataKey={s.riskLevel} name={s.riskLevel} stroke={COLORS[s.riskLevel] || '#6366f1'} strokeWidth={2} dot={false} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
