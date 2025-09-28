import { apiClient, extractData } from './client';
import type { ApiEnvelope, InstitutionInput, InstitutionCreatedResponse } from '@/types/api';

export async function addInstitution(payload: InstitutionInput): Promise<InstitutionCreatedResponse> {
  const res = await apiClient.post<ApiEnvelope<InstitutionCreatedResponse>>('/institutes/add', payload);
  return extractData(res.data);
}
