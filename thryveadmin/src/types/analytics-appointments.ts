export interface Appointment {
  id: string;
  studentId: string;
  counselorId: string;
  status: string; // scheduled, completed, cancelled, noShow
  isEmergency?: boolean;
  scheduledFor: string;
  createdAt: string;
}

export interface AppointmentListResponse {
  items: Appointment[];
  total: number;
  page: number;
  pages: number;
}

export interface AppointmentStatusSummaryResponse {
  total: number;
  statuses: { status: string; count: number; pct: number; emergencies: number }[];
}

export interface WeeklyAppointmentCountsResponse {
  granularity: 'week';
  categories: string[]; // weeks labels
  series: { key: string; label: string; values: number[] }[];
}

export interface CounselorLoadResponse {
  items: { counselorId: string; username: string; upcoming: number; completed30d: number }[];
}

export interface AppointmentFunnelResponse {
  period: { from: string; to: string };
  stages: { key: string; label: string; value: number }[];
  conversionRate: number;
  emergencyCount: number;
}
