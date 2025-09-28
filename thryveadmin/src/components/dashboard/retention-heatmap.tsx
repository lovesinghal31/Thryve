"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RetentionBlock } from '@/types/dashboard-aggregate';
import React from 'react';

interface RetentionHeatmapProps { data?: RetentionBlock }

// Simple color scale (could be improved): light gray to indigo
function color(rate: number) {
  if (rate >= 0.8) return 'bg-indigo-600 text-white';
  if (rate >= 0.6) return 'bg-indigo-500 text-white';
  if (rate >= 0.4) return 'bg-indigo-400 text-white';
  if (rate >= 0.2) return 'bg-indigo-300 text-white';
  if (rate > 0) return 'bg-indigo-100 text-indigo-700';
  return 'bg-muted text-muted-foreground';
}

export function RetentionHeatmap({ data }: RetentionHeatmapProps) {
  if (!data || data.cohorts.length === 0) {
    return (
      <Card className="glass glass-hover">
        <CardHeader><CardTitle>Retention Cohorts</CardTitle></CardHeader>
        <CardContent><div className="text-sm text-muted-foreground">No retention data</div></CardContent>
      </Card>
    );
  }

  // Determine max week columns
  const maxWeeks = Math.max(...data.cohorts.map(c => c.weeks.length));
  const weekOffsets = Array.from({ length: maxWeeks }, (_, i) => i);

  return (
  <Card className="glass glass-hover">
      <CardHeader><CardTitle>Retention Cohorts</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-1 text-left font-medium">Cohort</th>
                <th className="p-1 text-left font-medium">Size</th>
                {weekOffsets.map(w => (
                  <th key={w} className="p-1 font-medium">W{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.cohorts.map(c => (
                <tr key={c.cohort} className="border-t">
                  <td className="p-1 whitespace-nowrap font-medium">{c.cohort}</td>
                  <td className="p-1">{c.size}</td>
                  {weekOffsets.map(w => {
                    const wk = c.weeks.find(x => x.weekOffset === w);
                    const rate = wk ? wk.rate : 0;
                    return (
                      <td key={w} className="p-1">
                        <div className={`h-8 w-12 flex items-center justify-center rounded ${color(rate)}`}>{(rate*100).toFixed(0)}%</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
