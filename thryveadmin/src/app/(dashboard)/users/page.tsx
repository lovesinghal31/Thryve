import { redirect } from 'next/navigation';

export default function LegacyUsersRedirect(){
  redirect('/dashboard/users');
  return null;
}
