// Central API-related envelope & helper types derived from API_SPEC.md
// Customize base URL via environment variable in `src/lib/api/client.ts`.

export interface ApiSuccessEnvelope<T> {
  statusCode: number;
  data: T;
  message?: string;
  success: true;
}

export interface ApiErrorEnvelope {
  statusCode: number;
  data: Record<string, never> | unknown;
  message: string;
  success: false;
  errors?: unknown[];
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

export interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pages: number;
}

// User roles enumerated from spec.
export type UserRole = 'student' | 'counselor' | 'admin' | 'superadmin';

export interface User {
  _id: string;
  username?: string;
  pseudoname?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institutionId?: string;
  // Additional backend fields can be appended safely here.
  [key: string]: unknown;
}

// Public profile subset – may overlap with `User` but intentionally minimal.
export interface PublicUserProfile {
  _id: string;
  username?: string;
  pseudoname?: string;
  role: UserRole;
  avatarUrl?: string;
  institutionId?: string;
}

export interface InstitutionInput {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

export interface InstitutionCreatedResponse {
  institueName: string; // (spelling as returned by backend per spec)
  contactEmail: string;
}

// Dashboard metrics (all numeric fields optional because backend may evolve / return 0s)
export interface DashboardMetrics {
  instituteName?: string;
  totalUsers?: number;
  activeUsersDaily?: number;
  activeUsersWeekly?: number;
  activeUsersMonthly?: number;
  newUsers?: number;
  returningUsers?: number;
  averageSessionDuration?: number;
  percentageUsersShowingImprovement?: number;
  totalScreenings?: number;
  screeningsByTool?: Record<string, number>;
  averageScores?: Record<string, number>;
  riskLevelDistribution?: Record<string, number>;
  highRiskFlags?: number;
  screeningCompletionRate?: number;
  totalAppointments?: number;
  appointmentsByStatus?: Record<string, number>;
  averageWaitTimeForAppointment?: number;
  counselorLoadDistribution?: Record<string, number>;
  appointmentConversionRate?: number;
  emergencyEscalations?: number;
  totalChatRooms?: number;
  totalMessages?: number;
  averageMessagesPerUser?: number;
  averageResponseTimePeerSupport?: number;
  totalResources?: number;
  weeklyRetentionRate?: number;
  [key: string]: unknown;
}

// Common query params for pagination.
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface UserListQuery extends PaginationQuery {
  role?: UserRole;
  institutionId?: string;
  q?: string;
}

// Auth related types from spec
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string; // Provided directly in data
}

export interface RefreshTokenRequest {
  refreshToken?: string; // optional if cookie-based
}

export interface RefreshTokenResponseData {
  accessToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}
