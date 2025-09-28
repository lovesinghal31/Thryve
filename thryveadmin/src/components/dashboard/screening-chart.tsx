"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
interface ScreeningChartProps { metrics?: { screeningsByTool?: Record<string, number> } }

export function ScreeningChart({ metrics }: ScreeningChartProps) {
  const screenings = metrics?.screeningsByTool || {};
  const data = Object.entries(screenings).map(([tool, count]) => ({ tool, count }));

  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Screenings by Tool</CardTitle></CardHeader>
      <CardContent style={{ height: 300 }}>
        {data.length === 0 ? <div className="text-sm text-muted-foreground">No data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="tool" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
