"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TopCounselorsBlock } from '@/types/dashboard-aggregate';
import { Progress } from '@/components/ui/progress';

interface TopCounselorsProps { data?: TopCounselorsBlock }

export function TopCounselors({ data }: TopCounselorsProps) {
  const items = data?.items || [];
  if (items.length === 0) {
    return (
      <Card className="glass glass-hover">
        <CardHeader><CardTitle>Top Counselors</CardTitle></CardHeader>
        <CardContent><div className="text-sm text-muted-foreground">No counselor performance data</div></CardContent>
      </Card>
    );
  }

  const max = Math.max(...items.map(i => i.value));
  return (
    <Card className="glass glass-hover">
      <CardHeader><CardTitle>Top Counselors</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.map(c => {
          const pct = max ? (c.value / max) * 100 : 0;
          return (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted-foreground">{c.value} sessions · {c.avgSatisfaction?.toFixed(1)}★</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
