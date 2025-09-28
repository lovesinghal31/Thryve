"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DistributionsAggregate } from '@/types/dashboard-aggregate';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface CounselorLoadChartProps { distributions?: DistributionsAggregate }

export function CounselorLoadChart({ distributions }: CounselorLoadChartProps) {
  const items = distributions?.counselorLoad?.items || [];
  const data = items.map(i => ({ name: i.label, active: i.activeClients, open: i.openAppointments }));
  const has = data.length > 0;
  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Counselor Load</CardTitle></CardHeader>
      <CardContent style={{ height: 320 }}>
        {!has ? <div className="text-sm text-muted-foreground">No counselor data</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" name="Active Clients" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="open" name="Open Appts" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
