"use client";
import { useQuery } from '@tanstack/react-query';
import {
  listScreenings,
  getScreeningStats,
  getDailyScreeningCounts,
  getRiskLevelDistribution,
  getToolUsageSummary,
  type ListScreeningsParams
} from '@/lib/api/analytics-screenings';

export function useScreeningList(params: ListScreeningsParams) {
  return useQuery({ queryKey: ['screenings','list', params], queryFn: () => listScreenings(params), staleTime: 60_000 });
}
export function useScreeningStats(institutionId?: string) {
  return useQuery({ queryKey: ['screenings','stats', institutionId], queryFn: () => getScreeningStats({ institutionId }), staleTime: 60_000 });
}
export function useScreeningDaily(days = 14, institutionId?: string) {
  return useQuery({ queryKey: ['screenings','daily', days, institutionId], queryFn: () => getDailyScreeningCounts({ days, institutionId }), staleTime: 60_000 });
}
export function useRiskDistribution(institutionId?: string, tool?: string) {
  return useQuery({ queryKey: ['screenings','riskDist', institutionId, tool], queryFn: () => getRiskLevelDistribution({ institutionId, tool }), staleTime: 60_000 });
}
export function useToolSummary(institutionId?: string) {
  return useQuery({ queryKey: ['screenings','toolSummary', institutionId], queryFn: () => getToolUsageSummary({ institutionId }), staleTime: 60_000 });
}
