"use client";
import { useQuery } from '@tanstack/react-query';
import {
  listAppointments,
  getAppointmentStatusSummary,
  getWeeklyAppointmentCounts,
  getCounselorLoad,
  getAppointmentFunnel,
  type ListAppointmentsParams
} from '@/lib/api/analytics-appointments';

export function useAppointmentList(params: ListAppointmentsParams) {
  return useQuery({ queryKey: ['appointments','list', params], queryFn: () => listAppointments(params), staleTime: 60_000 });
}
export function useAppointmentStatusSummary(institutionId?: string, from?: string, to?: string) {
  return useQuery({ queryKey: ['appointments','statusSummary', institutionId, from, to], queryFn: () => getAppointmentStatusSummary({ institutionId, from, to }), staleTime: 60_000 });
}
export function useWeeklyAppointmentCounts(weeks = 8, institutionId?: string) {
  return useQuery({ queryKey: ['appointments','weekly', weeks, institutionId], queryFn: () => getWeeklyAppointmentCounts({ weeks, institutionId }), staleTime: 60_000 });
}
export function useCounselorLoad(institutionId?: string) {
  return useQuery({ queryKey: ['appointments','counselorLoad', institutionId], queryFn: () => getCounselorLoad({ institutionId }), staleTime: 60_000 });
}
export function useAppointmentFunnel(institutionId?: string) {
  return useQuery({ queryKey: ['appointments','funnel', institutionId], queryFn: () => getAppointmentFunnel({ institutionId }), staleTime: 60_000 });
}
