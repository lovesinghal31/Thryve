import { apiClient } from './client';
import type {
  AppointmentListResponse,
  AppointmentStatusSummaryResponse,
  WeeklyAppointmentCountsResponse,
  CounselorLoadResponse,
  AppointmentFunnelResponse
} from '@/types/analytics-appointments';

const BASE = '/admin/analytics/appointments';

export interface ListAppointmentsParams { page?: number; limit?: number; institutionId?: string; counselorId?: string; studentId?: string; status?: string; isEmergency?: boolean; from?: string; to?: string; }

function unwrap<T>(res: any): T { return res.data?.data || res.data; }

export async function listAppointments(params: ListAppointmentsParams = {}): Promise<AppointmentListResponse> {
  return unwrap(await apiClient.get(BASE, { params }));
}
export async function getAppointmentStatusSummary(params: { institutionId?: string; from?: string; to?: string } = {}): Promise<AppointmentStatusSummaryResponse> {
  return unwrap(await apiClient.get(`${BASE}/status-summary`, { params }));
}
export async function getWeeklyAppointmentCounts(params: { weeks?: number; institutionId?: string } = {}): Promise<WeeklyAppointmentCountsResponse> {
  return unwrap(await apiClient.get(`${BASE}/weekly-status`, { params }));
}
export async function getCounselorLoad(params: { institutionId?: string } = {}): Promise<CounselorLoadResponse> {
  return unwrap(await apiClient.get(`${BASE}/counselor-load`, { params }));
}
export async function getAppointmentFunnel(params: { institutionId?: string } = {}): Promise<AppointmentFunnelResponse> {
  return unwrap(await apiClient.get(`${BASE}/funnel`, { params }));
}
