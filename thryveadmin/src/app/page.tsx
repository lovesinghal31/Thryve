import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Root route: decide whether to send user to dashboard or login.
export default async function Home() {
  // If you migrate to httpOnly cookie tokens, change the name here.
  const cookieStore = await cookies();
  const token = cookieStore.get?.('accessToken');
  if (token?.value) {
    redirect('/dashboard');
  }
  redirect('/login');
}
