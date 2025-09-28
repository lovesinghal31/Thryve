import { apiClient, extractData } from './client';
import type { ApiEnvelope, DashboardMetrics } from '@/types/api';
import type { AdminDashboardData } from '@/types/dashboard-aggregate';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await apiClient.get<ApiEnvelope<DashboardMetrics>>('/admin-dashboard/admin-dashboard');
  return extractData(res.data);
}

// New aggregate (sample-based). Adjust endpoint path to backend implementation.
export async function getAdminDashboardAggregate(): Promise<AdminDashboardData> {
  // Backend confirmed path: /admin-dashboard/admin-dashboard (same as legacy metrics but richer payload)
  const res = await apiClient.get<ApiEnvelope<AdminDashboardData>>('/admin-dashboard/admin-dashboard');
  return extractData(res.data);
}
