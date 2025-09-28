"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { AppointmentsWeeklyStatus } from '@/types/dashboard-aggregate';

interface AppointmentsWeeklyStatusChartProps { data?: AppointmentsWeeklyStatus }

function buildData(block?: AppointmentsWeeklyStatus) {
  if (!block) return [] as any[];
  const rows: any[] = [];
  block.categories.forEach((cat, idx) => {
    const row: Record<string, any> = { week: cat };
    block.series.forEach(s => { row[s.key] = s.values[idx] ?? 0; });
    rows.push(row);
  });
  return rows;
}

const COLORS: Record<string,string> = {
  scheduled: '#6366f1',
  completed: '#10b981',
  cancelled: '#ef4444',
  noShow: '#f59e0b'
};

export function AppointmentsWeeklyStatusChart({ data }: AppointmentsWeeklyStatusChartProps) {
  const chartData = buildData(data);
  const has = chartData.length > 0;
  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Appointments Weekly Status</CardTitle></CardHeader>
      <CardContent style={{ height: 320 }}>
        {!has ? <div className="text-sm text-muted-foreground">No appointments data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} stackOffset="none" margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              {data!.series.map(s => (
                <Bar key={s.key} dataKey={s.key} name={s.label} stackId="a" fill={COLORS[s.key] || '#8884d8'} radius={[4,4,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
