import { redirect } from 'next/navigation';

interface Params { params: { id: string } }

export default function LegacyUserDetailRedirect({ params }: Params){
  redirect(`/dashboard/users/${params.id}`);
  return null;
}
