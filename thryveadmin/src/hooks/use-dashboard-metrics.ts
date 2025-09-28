"use client";
import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '@/lib/api/dashboard';
import type { DashboardMetrics } from '@/types/api';

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics, Error>({
    queryKey: ['dashboard-metrics'],
    queryFn: getDashboardMetrics,
    refetchInterval: 60_000, // refresh every minute
  });
}
