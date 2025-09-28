import { redirect } from 'next/navigation';

export default function LegacyInstitutionsIndex() {
  redirect('/dashboard/institutions');
}
