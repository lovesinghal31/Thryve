import { apiClient } from './client';
import type {
  ScreeningListResponse,
  ScreeningStatsResponse,
  DailyScreeningCountsResponse,
  RiskDistributionResponse,
  ToolUsageSummaryResponse
} from '@/types/analytics-screenings';

const BASE = '/admin/analytics/screenings'; // NOTE: axios base should already include /api/v1

export interface ListScreeningsParams {
  page?: number; limit?: number; institutionId?: string; tool?: string; riskLevel?: string; status?: string; studentId?: string;
}

export async function listScreenings(params: ListScreeningsParams = {}): Promise<ScreeningListResponse> {
  const res = await apiClient.get(BASE, { params });
  return res.data.data || res.data; // support envelope or raw
}

export async function getScreeningStats(params: { institutionId?: string } = {}): Promise<ScreeningStatsResponse> {
  const res = await apiClient.get(`${BASE}/stats`, { params });
  return res.data.data || res.data;}

export async function getDailyScreeningCounts(params: { days?: number; institutionId?: string } = {}): Promise<DailyScreeningCountsResponse> {
  const res = await apiClient.get(`${BASE}/timeseries/daily`, { params });
  return res.data.data || res.data; }

export async function getRiskLevelDistribution(params: { institutionId?: string; tool?: string } = {}): Promise<RiskDistributionResponse> {
  const res = await apiClient.get(`${BASE}/distribution/risk`, { params });
  return res.data.data || res.data; }

export async function getToolUsageSummary(params: { institutionId?: string } = {}): Promise<ToolUsageSummaryResponse> {
  const res = await apiClient.get(`${BASE}/tools/summary`, { params });
  return res.data.data || res.data; }
