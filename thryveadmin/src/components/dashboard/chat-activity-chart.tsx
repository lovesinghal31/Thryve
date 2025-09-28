"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChatActivityBlock } from '@/types/dashboard-aggregate';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ChatActivityChartProps { data?: ChatActivityBlock }

function build(data?: ChatActivityBlock) {
  if (!data) return [] as any[];
  return data.data.map(p => ({
    time: p.timestamp.slice(11,16), // HH:MM
    messages: p.messages,
    users: p.uniqueUsers
  }));
}

export function ChatActivityChart({ data }: ChatActivityChartProps) {
  const chartData = build(data);
  const has = chartData.length > 0;
  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Chat Activity</CardTitle></CardHeader>
      <CardContent style={{ height: 320 }}>
        {!has ? <div className="text-sm text-muted-foreground">No chat activity data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="messages" name="Messages" stroke="#6366f1" fillOpacity={1} fill="url(#colorMessages)" />
              <Area type="monotone" dataKey="users" name="Unique Users" stroke="#10b981" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {data?.peakHour && (
          <div className="mt-2 text-xs text-muted-foreground">Peak Hour: {data.peakHour.slice(11,16)} UTC</div>
        )}
      </CardContent>
    </Card>
  );
}
