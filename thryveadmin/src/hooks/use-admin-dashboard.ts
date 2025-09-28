"use client";
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardAggregate } from '@/lib/api/dashboard';
import type { AdminDashboardData } from '@/types/dashboard-aggregate';

export function useAdminDashboard() {
  return useQuery<AdminDashboardData, Error>({
    queryKey: ['admin-dashboard-aggregate'],
    queryFn: getAdminDashboardAggregate,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}
