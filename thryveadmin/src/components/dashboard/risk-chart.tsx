"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
const COLORS = ['#22c55e', '#facc15', '#ef4444', '#8b5cf6'];

interface RiskChartProps { metrics?: { riskLevelDistribution?: Record<string, number> } }

export function RiskChart({ metrics }: RiskChartProps) {
  const dist = metrics?.riskLevelDistribution || {};
  const data = Object.entries(dist).map(([name, value]) => ({ name, value }));

  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Risk Level Distribution</CardTitle></CardHeader>
      <CardContent style={{ height: 300 }}>
        {data.length === 0 ? <div className="text-sm text-muted-foreground">No data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
