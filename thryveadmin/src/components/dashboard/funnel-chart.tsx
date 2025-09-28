"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FunnelBlock } from '@/types/dashboard-aggregate';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

interface FunnelChartProps { data?: FunnelBlock }

function build(data?: FunnelBlock) {
  if (!data) return [] as any[];
  // Compute percentage relative to first stage
  const first = data.stages[0]?.value || 1;
  return data.stages.map(s => ({ ...s, pct: first ? (s.value / first) * 100 : 0 }));
}

export function FunnelChart({ data }: FunnelChartProps) {
  const chartData = build(data);
  const has = chartData.length > 0;
  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Acquisition Funnel</CardTitle></CardHeader>
      <CardContent style={{ height: 320 }}>
        {!has ? <div className="text-sm text-muted-foreground">No funnel data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false} />
              <Tooltip formatter={(val: any, _n, item: any) => [val, item.payload.label]} labelFormatter={() => ''} />
              <Bar dataKey="value" fill="#6366f1" radius={[4,4,4,4]}>
                <LabelList dataKey="pct" position="right" formatter={(v: any) => `${v.toFixed(1)}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        {data && (
          <div className="mt-2 text-xs text-muted-foreground">Overall conversion: {(data.conversionRate * 100).toFixed(1)}%</div>
        )}
      </CardContent>
    </Card>
  );
}
